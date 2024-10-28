const express = require("express");
const {
  generateCertificate,
} = require("../controllers/certificationController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/certificate/generate/{userId}:
 *   post:
 *     summary: Generate a certificate for a supervisor (Admin only)
 *     tags: [Certificate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID of the supervisor
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 description: Date of certificate issuance (optional)
 *               role:
 *                 type: string
 *                 description: Role or title on the certificate (optional)
 *               description:
 *                 type: string
 *                 description: Custom certificate description (optional)
 *             example:
 *               date: "2024-10-16"
 *               role: "Volunteer"
 *               description: "For outstanding contributions and dedication."
 *     responses:
 *       200:
 *         description: Certificate generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Supervisor not found
 *       500:
 *         description: Failed to generate certificate
 */
router.post("/generate/:userId", verifyToken, isAdmin, generateCertificate);

module.exports = router;
