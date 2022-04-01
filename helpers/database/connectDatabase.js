const mongoose = require("mongoose");
const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connection Succesfully"))
    .catch((err) => console.error(err));
};

module.exports = connectDatabase;