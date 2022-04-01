const express = require("express");
const router = express.Router();
const { addCategory, getCategories } = require("../controllers/category");
router.post("/addCategory", addCategory);
router.get("/getCategories", getCategories);


module.exports = router;
