const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide a category name"],
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
    },
  ],
});

module.exports = mongoose.model("Categories", CategoriesSchema);
