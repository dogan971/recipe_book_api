const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Products = require("./Products");
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide a e-mail"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please Provide valid e-mail",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
    minlength: [6, "Please provide a password  with min length 6"],
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
    },
  ],
  ownProducts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
    },
  ],
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(err);
      this.password = hash;
      next();
    });
  });
});

UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
  const payload = {
    id: this._id,
    name: this.name,
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE,
  });
  return token;
};

UserSchema.post("remove", async function () {
  const product = await Products.find();
  product.map(async (data) => {
    if (this.ownProducts.filter((x) => x === data._id)) await data.remove();
  });
});
module.exports = mongoose.model("Users", UserSchema);
