const express = require("express");
const app = express();
const dotenv = require("dotenv");
const routers = require("./routes/index");
const customError = require("./middlewares/errors/customError");
const connectionDatabase = require("./helpers/database/connectDatabase");
const path = require("path");
const { dirname } = require("path");
// Environment Variables
dotenv.config({
  path: "./config/env/config.env",
});
const PORT = process.env.PORT || 5000;
// MongoDB
connectionDatabase();
// Routers

app.use(express.json());
app.use("/api", routers);
app.use(customError);
// Connect Server
app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
  console.log("Server started: " + PORT);
});
