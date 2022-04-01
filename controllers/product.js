const Product = require("../models/Products");
const Categories = require("../models/Categories");
const asyncError = require("express-async-handler");
const CustomError = require("../helpers/errors/CustomError");
const addProduct = asyncError(async (req, res, next) => {
  const { name } = req.body;
  const { id, categoryId } = req.params;
  const user = req.data;
  const product = await Product.create({
    name,
    ownProductId: id,
    category: categoryId,
  });
  user.ownProducts.push(product._id);
  await user.save();
  return res.status(200).json({ product });
});
const addProductToCategory = asyncError(async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const category = await Categories.findById(categoryId);
  const product = req.product;
  if (category.products.indexOf(product._id) === -1) {
    category.products.push(product._id);
    await category.save();
    return res.status(200).json({ category });
  }
  return next(new CustomError("This product already exists", 400));
});
const editProduct = asyncError(async (req, res) => {
  const product = req.product;
  const { name } = req.body;
  product.name = name;
  await product.save();
  return res.status(200).json({ product });
});
const deleteProduct = asyncError(async (req, res) => {
  const { productId } = req.params;
  const user = req.data;
  user.ownProducts.splice(productId, 1);
  await user.save();
  const product = await Product.findById(productId);
  await product.remove();
  return res.status(200).json({ message: "Successfully" });
});
const getAllProducts = asyncError(async (req, res, next) => {
  const Products = await Product.find()
    .populate({
      path: "category",
      select: "name",
    })
    .populate({ path: "ownProductId", select: "name" });
  return res.status(200).json({
    Products,
  });
});
const addCommentToProduct = asyncError(async (req, res, next) => {
  const { comment } = req.body;
  const product = req.product;
  if (comment !== null && comment !== "") {
    if (product.comment.find((x) => x.comment === comment)) {
      return next(new CustomError("This comment already exists", 400));
    }
    product.comment.push({
      commentOwnerId: req.data._id,
      commentOwner: req.data.name,
      comment: comment,
    });
    await product.save();
  }
  return res.status(200).json({ data: product });
});
const editComment = asyncError(async (req, res, next) => {
  const { newComment, oldComment } = req.body;
  const product = req.product;
  product.comment.map((data) => {
    if (data.comment === oldComment) {
      const index = product.comment.indexOf(data);
      product.comment.splice(index, 1, {
        commentOwner: req.data.name,
        comment: newComment,
        commentOwnerId: req.data._id,
      });
    }
  });
  await product.save();
  return res.status(200).json({ data: product.comment });
});
const deleteComment = asyncError(async (req, res, next) => {
  const product = req.product;
  product.comment.map((data) => {
    if (data.commentOwnerId.toString() === req.data._id.toString()) {
      const index = product.comment.indexOf(data);
      product.comment.splice(index, 1);
    }
  });
  await product.save();
  return res.status(200).json({ data: product.comment });
});
const addLikeToProduct = asyncError(async (req, res, next) => {
  const product = req.product;
  const user = req.data;
  if (product.likes.find((x) => x._id.toString() === user._id.toString())) {
    product.likes.splice(user._id, 1);
    user.likes.splice(product._id, 1);
    await product.save();
    await user.save();
    return res.status(200).json({ message: "Like Removed" });
  }
  product.likes.push(user._id);
  user.likes.push(product._id);
  await product.save();
  await user.save();
  return res.status(200).json({ data: product });
});
const imageUpload = asyncError(async (req, res, next) => {
  //Image upload Success
  const product = await Product.findById(
    req.product._id,
    {
      product_image: req.savedProfileImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Image Upload Successfull",
    data: product.product_image,
  });
});
module.exports = {
  addProduct,
  addProductToCategory,
  editProduct,
  deleteProduct,
  getAllProducts,
  addCommentToProduct,
  editComment,
  deleteComment,
  addLikeToProduct,
  imageUpload,
};
