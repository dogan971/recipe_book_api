const express = require("express");
const {
  checkUserExists,
  checkProductExists,
  checkProductOwner,
  checkCommentOwner,
} = require("../helpers/errors/databaseErrors");
const {
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
} = require("../controllers/product");
const { getAccessToRoute } = require("../helpers/authorization/auth");
const profileImageUpload = require("../middlewares/libraries/profileImageUploads");
const router = express.Router();
router.post(
  "/addProduct/:id/:categoryId",
  [checkUserExists, getAccessToRoute],
  addProduct
);
router.post(
  "/addProductToCategory/:productId/:categoryId",
  [checkProductExists, getAccessToRoute],
  addProductToCategory
);
router.put(
  "/editProduct/:productId/:id",
  [checkUserExists, getAccessToRoute, checkProductExists, checkProductOwner],
  editProduct
);
router.delete(
  "/deleteProduct/:productId/:categoryId/:id",
  [checkUserExists, getAccessToRoute, checkProductExists, checkProductOwner],
  deleteProduct
);
router.get("/getAllProducts", getAllProducts);
router.post(
  "/addCommentToProduct/:productId/:id",
  [checkUserExists, getAccessToRoute, checkProductExists],
  addCommentToProduct
);
router.put(
  "/editComment/:productId/:id",
  [checkUserExists, getAccessToRoute, checkProductExists, checkCommentOwner],
  editComment
);
router.delete(
  "/deleteComment/:productId/:id",
  [checkUserExists, getAccessToRoute, checkProductExists, checkCommentOwner],
  deleteComment
);
router.post(
  "/addLikeToProduct/:productId/:id",
  [checkUserExists, getAccessToRoute, checkProductExists],
  addLikeToProduct
);
router.post(
  "/uploadImage/:productId",
  [getAccessToRoute,checkProductExists, profileImageUpload.single("image")],
  imageUpload
);

module.exports = router;
