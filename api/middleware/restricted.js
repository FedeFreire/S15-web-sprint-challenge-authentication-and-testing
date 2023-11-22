const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets/index.js");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    const error = new Error("token required");
    error.statusCode = 401;
    return next(error);
  }

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      const error = new Error("token invalid");
      error.statusCode = 401;
      return next(error);
    } else {
      req.decodedToken = decodedToken;
      next();
    }
  });
};

/*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
