const express = require("express");
const {
  getSupervisorProfile,
  getAllSupervisors,
  getSupervisorById,
  updateSupervisorCredits,
  updateSupervisor,
  updateSupervisorById,
  deleteSupervisorById,
} = require("../controllers/supervisorController");
const {
  generateApplicationPDF,
} = require("../controllers/applicationPDFController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Supervisors
 *   description: API for managing supervisors
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Supervisor:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *         fatherName:
 *           type: string
 *         motherName:
 *           type: string
 *         state:
 *           type: string
 *         city:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         photo:
 *           type: string
 *           format: binary
 *         registrationFee:
 *           type: number
 *           default: 1000.0
 *         commission:
 *           type: number
 *           default: 0.0
 *         earningCommission:
 *           type: number
 *           default: 0.0
 *         oldWalletCr:
 *           type: number
 *           default: 0.0
 *         oldWalletDr:
 *           type: number
 *           default: 0.0
 *         walletCr:
 *           type: number
 *           default: 0.0
 *         walletDr:
 *           type: number
 *           default: 0.0
 *         balance:
 *           type: number
 *           default: 0.0
 *         totalInternReg:
 *           type: number
 *           default: 0
 *         totalYojanaReg:
 *           type: number
 *           default: 0
 *         totalReg:
 *           type: number
 *           default: 0
 *         professionalInfo:
 *           type: object
 *           properties:
 *             mondalName:
 *               type: string
 *             departmentName:
 *               type: string
 *             workingArea:
 *               type: string
 *             workingCity:
 *               type: string
 */

/**
 * @swagger
 * /api/supervisors:
 *   get:
 *     summary: Get all supervisors (Admin only)
 *     description: Fetches all supervisors. Only accessible by admins.
 *     tags: [Supervisors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all supervisors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supervisor'
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get("/", verifyToken, isAdmin, getAllSupervisors);

/**
 * @swagger
 * /api/supervisors/profile:
 *   get:
 *     summary: Get supervisor profile (Admin or self)
 *     description: Fetches profile details of the supervisor. Accessible by Admins or the supervisor themselves.
 *     tags: [Supervisors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supervisor profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supervisor'
 *       403:
 *         description: Access denied
 *       404:
 *         description: Supervisor profile not found
 *       500:
 *         description: Server error
 */
router.get("/profile", verifyToken, getSupervisorProfile);

/**
 * @swagger
 * /api/supervisors/profile/update:
 *   put:
 *     summary: Update supervisor profile (Admin or self)
 *     description: Update profile details of the supervisor. Accessible by Admins or the supervisor themselves. Supervisors can only update specific fields (mobileNumber, photo, professionalInfo).
 *     tags: [Supervisors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supervisor'
 *     responses:
 *       200:
 *         description: Supervisor profile updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Supervisor profile not found
 *       500:
 *         description: Server error
 */
router.put("/profile/update", verifyToken, updateSupervisor);

/**
 * @swagger
 * /api/supervisors/{userId}:
 *   get:
 *     summary: Get a specific supervisor by their userID (Admin only)
 *     description: Fetches details of a specific supervisor using their userID. Accessible by Admins only.
 *     tags: [Supervisors]
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
 *         description: Supervisor data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supervisor'
 *       403:
 *         description: Access denied
 *       404:
 *         description: Supervisor not found
 *       500:
 *         description: Server error
 */
router.get("/:userId", verifyToken, isAdmin, getSupervisorById);
/**
 * @swagger
 * /api/supervisors/{userId}:
 *   put:
 *     summary: Update a specific supervisor by their userID (Admin only)
 *     description: Updates details of a specific supervisor using their userID. Accessible by Admins only.
 *     tags: [Supervisors]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supervisor'
 *     responses:
 *       200:
 *         description: Supervisor updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Supervisor not found
 *       500:
 *         description: Failed to update supervisor
 */
router.put("/:userId", verifyToken, isAdmin, updateSupervisorById);

/**
 * @swagger
 * /api/supervisors/{userId}:
 *   delete:
 *     summary: Delete a supervisor by their userID (Admin only)
 *     description: Deletes a specific supervisor using their userID. Accessible by Admins only.
 *     tags: [Supervisors]
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
 *         description: Supervisor deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Supervisor not found
 *       500:
 *         description: Server error occurred while trying to delete the supervisor
 */
router.delete("/:userId", verifyToken, isAdmin, deleteSupervisorById);

/**
 * @swagger
 * /api/supervisors/credits/update:
 *   put:
 *     summary: Admin updates supervisor credits and commission
 *     description: Allows admins to update supervisor's commission, credits, and debits.
 *     tags: [Supervisors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               credit:
 *                 type: number
 *               debit:
 *                 type: number
 *               commission:
 *                 type: number
 *     responses:
 *       200:
 *         description: Supervisor credits updated successfully
 *       404:
 *         description: Supervisor not found
 *       500:
 *         description: Failed to update supervisor credits
 */

router.put("/credits/update", verifyToken, isAdmin, updateSupervisorCredits);

/**
 * @swagger
 * /api/supervisors/application-pdf/{id}:
 *   get:
 *     summary: Generate and download PDF for a supervisor application
 *     tags: [Supervisors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the supervisor application
 *     responses:
 *       200:
 *         description: PDF generated and downloaded successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.get("/application-pdf/:id", verifyToken, generateApplicationPDF);

module.exports = router;
