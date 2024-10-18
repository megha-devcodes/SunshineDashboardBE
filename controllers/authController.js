const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserFactory = require("../factories/UserFactory");
const User = require("../models/User");
const Token = require("../models/Token");
require("dotenv").config();

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = await UserFactory.createUser({ name, email, password, role });

    const token = jwt.sign(
      { userID: user.userID, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .status(201)
      .json({
        message: "User registered successfully",
        token,
        userID: user.userID,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userID: user.userID, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Logout user
exports.logout = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(400).json({ message: "Token missing from request." });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    await new Token({
      token,
      expiresAt: new Date(Date.now() + 3600000),
    }).save();

    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    console.error("Logout failed:", error.message);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};
