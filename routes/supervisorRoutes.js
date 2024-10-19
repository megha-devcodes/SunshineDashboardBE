const express = require("express");
const {
  getSupervisorProfile,
  updateSupervisor,
} = require("../controllers/supervisorController");
const { verifyToken } = require("../middleware/authMiddleware");
const UserFactory = require("../factories/UserFactory");
const Supervisor = require("../models/Supervisor");
const User = require("../models/User");

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
 *         userId:
 *           type: string
 *           description: Unique user ID for the supervisor
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
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  try {
    const supervisors = await Supervisor.find();
    res.json(supervisors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

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
router.get("/profile", verifyToken, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "supervisor") {
    return res.status(403).json({ message: "Access denied." });
  }
  await getSupervisorProfile(req, res);
});

/**
 * @swagger
 * /api/supervisors/profile/update:
 *   put:
 *     summary: Update supervisor profile (Admin or self)
 *     description: Update profile details of the supervisor. Accessible by Admins or the supervisor themselves.
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
router.put("/profile/update", verifyToken, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "supervisor") {
    return res.status(403).json({ message: "Access denied." });
  }
  await updateSupervisor(req, res);
});

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
router.get("/:userId", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  try {
    const supervisor = await Supervisor.findOne({ userId: req.params.userId });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    const user = await User.findOne({ userID: supervisor.userId });
    if (user) {
      supervisor._doc.name = user.name;
      supervisor._doc.email = user.email;
    }

    res.json(supervisor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

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
router.put("/:userId", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    const supervisor = await Supervisor.findOne({ userId: req.params.userId });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    await UserFactory.updateUser(supervisor.userId, req.body);

    supervisor.fatherName = req.body.fatherName || supervisor.fatherName;
    supervisor.motherName = req.body.motherName || supervisor.motherName;
    supervisor.state = req.body.state || supervisor.state;
    supervisor.city = req.body.city || supervisor.city;
    supervisor.mobileNumber = req.body.mobileNumber || supervisor.mobileNumber;
    supervisor.registrationFee =
      req.body.registrationFee || supervisor.registrationFee;
    supervisor.commission = req.body.commission || supervisor.commission;
    supervisor.earningCommission =
      req.body.earningCommission || supervisor.earningCommission;
    supervisor.oldWalletCr = req.body.oldWalletCr || supervisor.oldWalletCr;
    supervisor.oldWalletDr = req.body.oldWalletDr || supervisor.oldWalletDr;
    supervisor.walletCr = req.body.walletCr || supervisor.walletCr;
    supervisor.walletDr = req.body.walletDr || supervisor.walletDr;
    supervisor.balance = req.body.balance || supervisor.balance;
    supervisor.totalInternReg =
      req.body.totalInternReg || supervisor.totalInternReg;
    supervisor.totalYojanaReg =
      req.body.totalYojanaReg || supervisor.totalYojanaReg;
    supervisor.totalReg = req.body.totalReg || supervisor.totalReg;
    supervisor.professionalInfo =
      req.body.professionalInfo || supervisor.professionalInfo;

    await supervisor.save();

    res.json({ message: "Supervisor updated successfully", supervisor });
  } catch (error) {
    res.status(500).json({ message: "Failed to update supervisor", error });
  }
});

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
router.delete("/:userId", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    const supervisor = await Supervisor.findOne({ userId: req.params.userId });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    await User.deleteOne({ userID: req.params.userId });
    await Supervisor.deleteOne({ userId: req.params.userId });

    res.json({ message: "Supervisor deleted successfully" });
  } catch (error) {
    console.error("Error deleting supervisor:", error);
    res
      .status(500)
      .json({
        message: "Server error occurred while trying to delete the supervisor",
        error,
      });
  }
});

module.exports = router;
