const express = require("express");
const { generatePDF } = require("../controllers/yojanaPDFController");

const router = express.Router();

router.get('/:id', generatePDF);

module.exports = router;
