const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const AsyncHandler = require("express-async-handler");
const User = require("../models/User");

dotenv.config();

const protected = AsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // ex : "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];
      //we use one to get the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      //we use two to get the user data with out password
      next();
    } catch (error) {
      console.log(error);
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = protected;
