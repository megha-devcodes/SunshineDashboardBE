const express = require("express");
const { generateIdCard } = require("../controllers/idCardController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/id-card/generate/{userId}:
 *   get:
 *     summary: Generate ID card for a supervisor (Admin only)
 *     tags: [ID Card]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID of the supervisor
 *     responses:
 *       200:
 *         description: ID card generated successfully
 *       404:
 *         description: Supervisor not found
 *       500:
 *         description: Failed to generate ID card
 */
router.get("/generate/:userId", verifyToken, isAdmin, generateIdCard);

module.exports = router;
