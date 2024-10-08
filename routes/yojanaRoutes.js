const express = require("express");
const router = express.Router();
const { registerYojana } = require("../controllers/yojanaController");
const upload = require("../middleware/uploadMiddleware");
const { verifyToken } = require("../middleware/authMiddleware");

router.post(
  "/register",
  verifyToken,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "identityDocument", maxCount: 1 },
  ]),
  registerYojana,
);

module.exports = router;
