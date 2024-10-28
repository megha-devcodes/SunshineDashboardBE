const express = require("express");
const { getIdentityTypes } = require("../controllers/identityController");
const router = express.Router();

/**
 * @swagger
 * /api/identity/types:
 *   get:
 *     summary: Retrieve list of identity document types
 *     tags: [Identity]
 *     responses:
 *       200:
 *         description: List of identity document types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: string
 *                     description: Identity type identifier
 *                   label_en:
 *                     type: string
 *                     description: Display label in English
 *                   label_hi:
 *                     type: string
 *                     description: Display label in Hindi
 *       500:
 *         description: Server error
 */
router.get("/types", getIdentityTypes);

module.exports = router;
