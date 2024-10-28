const express = require("express");
const { getYojnaOptions } = require("../controllers/yojanaProgramController");
const router = express.Router();

/**
 * @swagger
 * /api/yojna-program/options:
 *   get:
 *     summary: Retrieve available Yojna options, job types, and fees
 *     tags: [Yojna-Program]
 *     responses:
 *       200:
 *         description: List of Yojna options with job types and member fees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the Yojna
 *                   jobTypes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           description: Job type for the Yojna
 *                         fee:
 *                           type: number
 *                           description: Fee for the job type
 *       500:
 *         description: Server error
 */
router.get("/options", getYojnaOptions);

module.exports = router;
