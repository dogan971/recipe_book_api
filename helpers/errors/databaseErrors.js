const User = require("../../models/User");
const CustomError = require("./CustomError");
const asyncError = require("express-async-handler");
const Products = require("../../models/Products");
const checkUserExists = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "ownProducts",
    select: "name",
  });
  if (!user) {
    return next(new CustomError("There is no such user with that id", 400));
  }
  req.data = user;
  next();
});

const checkProductExists = asyncError(async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Products.findById(productId).populate({
    path: "likes",
    select: "name",
  });

  if (!product) return next(new CustomError("Invalid Product", 400));
  req.product = product;
  next();
});
const checkProductOwner = asyncError(async (req, res, next) => {
  const {productId} = req.params; 
  const user = req.data;
  if (user.ownProducts.find((x) => x._id.toString() === productId)) return next();
  return next(new CustomError("Your not have this product", 400));
});
const checkCommentOwner = asyncError(async (req, res, next) => {
  const product = req.product;
  const id = [];
  product.comment.map((data) => {
    id.push(data.commentOwnerId.toString());
  });
  if (id.indexOf(req.data._id.toString()) === 0) return next();
  return next(new CustomError("Your not have this comment", 400));
});
module.exports = {
  checkUserExists,
  checkProductExists,
  checkProductOwner,
  checkCommentOwner,
};
