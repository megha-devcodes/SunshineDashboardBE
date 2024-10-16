const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ message: "Access denied. Invalid token format." });
  }

  const token = tokenParts[1];

  try {
    const blacklistedToken = await Token.findOne({ token });
    if (blacklistedToken) {
      return res
        .status(401)
        .json({ message: "Token has been revoked (logged out)." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { verifyToken };
