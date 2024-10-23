const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserFactory = require("../factories/UserFactory");
const User = require("../models/User");
const Token = require("../models/Token");
require("dotenv").config();

// Register a new admin (Admins only)
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    if (role && role !== "admin") {
      return res.status(403).json({
        message:
          "Cannot register supervisors directly. Use the application workflow.",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = await UserFactory.createUser({
      name,
      email,
      password,
      role: "admin",
    });

    const token = jwt.sign(
      { userID: user.userID, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(201).json({
      message: "Admin registered successfully",
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
      },
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

exports.updateUser = async (req, res) => {
  const { userID } = req.params;
  const updatedData = req.body;

  try {
    const requesterRole = req.user.role;
    const currentUser = await User.findOne({ userID });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      requesterRole === "supervisor" &&
      (updatedData.role || updatedData.email)
    ) {
      return res
        .status(403)
        .json({ message: "Supervisors cannot update role or email." });
    }

    if (
      requesterRole === "admin" &&
      currentUser.role === "admin" &&
      req.user.userID !== userID
    ) {
      return res
        .status(403)
        .json({ message: "Admins cannot update other admins." });
    }

    const updatedUser = await UserFactory.updateUser(
      userID,
      updatedData,
      requesterRole,
    );

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};
