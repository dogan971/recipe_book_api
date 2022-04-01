const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Categories = require("./Categories");
const ProductsSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
  ],
  comment: {
    type: Array,
    default: [{}],
  },
  category: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Categories",
      required: true,
    },
  ],
  ownProductId: {
    type: String,
    ref: "Users",
  },
  product_image: {
    type: String,
    default: "default.jpg",
  },
});

ProductsSchema.post("remove", async function () {
  const id = this.category;
  const category = await Categories.findById(id);
  category.products.splice(this._id, 1);
  await category.save();
});
module.exports = mongoose.model("Products", ProductsSchema);
