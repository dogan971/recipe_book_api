const asyncError = require("express-async-handler");
const Categories = require("../models/Categories");
const addCategory = asyncError(async (req, res) => {
  const { name } = req.body;
  const category = await Categories.create({
    name,
  });
  return res.status(200).json({
    data: category,
  });
});
const getCategories = asyncError(async (req, res) => {
  const categories = await Categories.find().populate({
    path: "products",
    select: "name likes",
  });
  return res.status(200).json({
    categories,
  });
});
module.exports = { addCategory, getCategories };
