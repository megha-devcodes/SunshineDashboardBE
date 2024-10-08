const express = require("express");
const {
  getRegistrations,
  getRegistrationById,
  updateRegistration,
  addRegistration,
} = require("../controllers/yojanaListController");
const router = express.Router();

router.get("/", getRegistrations);

router.get("/:id", getRegistrationById);

router.put("/:id", updateRegistration);

router.post("/add", addRegistration);

module.exports = router;
