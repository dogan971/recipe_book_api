const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUser,
  getAllUser,
  login,
  logout,
  editUser,
  deleteUser,
} = require("../controllers/user");
const { getAccessToRoute } = require("../helpers/authorization/auth");
const { checkUserExists } = require("../helpers/errors/databaseErrors");
router.post("/register", registerUser);
router.get("/getUser/:id", checkUserExists, getUser);
router.get("/getAllUser",getAllUser)
router.post("/login",login);
router.get("/logout", logout);
router.put("/editUser/:id",[checkUserExists,getAccessToRoute],editUser)
router.delete("/deleteUser/:id",[checkUserExists,getAccessToRoute],deleteUser)



module.exports = router;
