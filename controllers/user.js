const asyncError = require("express-async-handler");
const User = require("../models/User");
const {
  validateUserInput,
  comparePassword,
} = require("../helpers/inputHelpers/input");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const CustomError = require("../helpers/errors/CustomError");
const registerUser = asyncError(async (req, res, next) => {
  const { name, password, email } = req.body;
  const user = await User.create({
    name,
    password,
    email,
  });
  return res.status(200).json({
    success: true,
    data: user,
  });
});
const getUser = asyncError(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.data,
  });
});
const getAllUser = asyncError(async (req, res) => {
  const user = await User.find().populate("ownProducts");
  return res.status(200).json({ user });
});
const login = asyncError(async (req, res,next) => {
  const { email, password } = req.body;
  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please check your input"), 400);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!comparePassword(password, user.password)) {
    return next(new CustomError("Please check your credentials", 400));
  }
  sendJwtToClient(user, res);
});
const logout = asyncError(async (req, res) => {
  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: false,
    })
    .json({
      success: true,
      message: "Logout Successfull",
    });
});
const editUser = asyncError(async (req, res) => {
  const user = req.data;
  const { name, email, password } = req.body;
  if (name !== null && name !== "") {
    user.name = name;
  }
  if (password !== null && password !== "") {
    user.password = password;
  }
  if (email !== null && email !== "") {
    user.email = email;
  }
  await user.save();
  return res.status(200).json({ user });
});
const deleteUser = asyncError(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  await user.remove();
  return res.status(200).json({ message: "Succesfully" });
});
module.exports = {
  registerUser,
  getUser,
  getAllUser,
  login,
  logout,
  editUser,
  deleteUser,
};
