const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/errors/CustomError");
// Storage,FileFilter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rootDir = path.dirname(require.main.filename);
    cb(null, path.join(rootDir, "/public/uploads"));
  },
  filename: function (req, file, cb) {
    //File-Mimetype-image/...
    const extension = file.mimetype.split("/")[1];
    req.savedProfileImage = "image_" + req.product.id + "." + extension;
    cb(null, req.savedProfileImage);
  },
});

const fileFilter = (req, file, cb) => {
  let allowedMimeTypes = ["image/jpg", "image/png", "image/gif", "image/jpeg"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new CustomError("Please provide a valid image file", 400), false);
  }
  return cb(null, true);
};

const profileImageUpload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = profileImageUpload;
