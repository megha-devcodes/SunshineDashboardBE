const express = require("express");
const { generatePDF } = require("../controllers/yojanaPDFController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Yojana PDF
 *   description: API for generating Yojana registration PDFs
 */

/**
 * @swagger
 * /api/yojana-pdf/{id}:
 *   get:
 *     summary: Generate a PDF for a specific Yojana registration
 *     tags: [Yojana PDF]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Registration ID of the Yojana form
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "PDF generated successfully"
 *                 pdfPath:
 *                   type: string
 *                   example: "/public/pdfs/REG-123456789.pdf"
 *       404:
 *         description: Registration not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/:id", verifyToken, generatePDF);

module.exports = router;
