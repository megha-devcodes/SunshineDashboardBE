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

// Get all supervisors (Admin only)
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

// Get supervisor profile (Admin or self)
router.get("/profile", verifyToken, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "supervisor") {
    return res.status(403).json({ message: "Access denied." });
  }

  await getSupervisorProfile(req, res);
});

// Update supervisor profile (Admin or self)
router.put("/profile/update", verifyToken, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "supervisor") {
    return res.status(403).json({ message: "Access denied." });
  }

  await updateSupervisor(req, res);
});

// Get a specific supervisor by their userID (Admin only)
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

// Update a specific supervisor by their userID (Admin only)
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

// Delete a supervisor by their userID (Admin only)
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
