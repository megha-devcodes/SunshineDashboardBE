const express = require("express");
const { getCategoryTypes } = require("../controllers/categoryController");
const router = express.Router();

/**
 * @swagger
 * /api/category/types:
 *   get:
 *     summary: Retrieve list of category types
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of category types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: string
 *                     description: Category type identifier
 *                   label_en:
 *                     type: string
 *                     description: Display label in English
 *                   label_hi:
 *                     type: string
 *                     description: Display label in Hindi
 *       500:
 *         description: Server error
 */
router.get("/types", getCategoryTypes);

module.exports = router;
