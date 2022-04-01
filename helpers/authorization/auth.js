const jwt = require("jsonwebtoken");
const CustomError = require("../errors/CustomError");
const { isTokenIncluded, getAccessTokenFromHeader } = require("./tokenHelpers");
const getAccessToRoute = (req, res, next) => {
  // Token
  const { JWT_SECRET_KEY } = process.env;
  if (!isTokenIncluded(req)) {
    // 401 , 403
    // 401:Unauthorized
    // 403:Forbidden
    return next(
      new CustomError("You are not authorized to access this route"),
      401
    );
  }
  const accesstoken = getAccessTokenFromHeader(req);
  jwt.verify(accesstoken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(
        new CustomError("You are not authorized to access this route", 401)
      );
    }
    req.user = {
      id: decoded.id,
      name: decoded.name,
    };
    next();
  });
};module.exports = { getAccessToRoute };
