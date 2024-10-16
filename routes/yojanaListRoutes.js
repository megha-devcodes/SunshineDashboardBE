const express = require("express");
const {
  getRegistrations,
  getRegistrationById,
  updateRegistration,
  addRegistration,
} = require("../controllers/yojanaListController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getRegistrations);

router.get("/:id", verifyToken, getRegistrationById);

router.put("/:id", verifyToken, updateRegistration);

router.post("/add", verifyToken, addRegistration);

module.exports = router;
