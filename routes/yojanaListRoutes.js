const express = require("express");
const {
  getRegistrations,
  getRegistrationById,
  updateRegistration,
} = require("../controllers/yojanaListController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getRegistrations);

router.get("/:registerId", verifyToken, getRegistrationById);

router.put("/:registerId", verifyToken, updateRegistration);

module.exports = router;
