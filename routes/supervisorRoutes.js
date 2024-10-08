const express = require("express");
const { createSupervisor } = require("../controllers/supervisorController");
const Supervisor = require("../models/Supervisor");
const { verifyToken } = require("../middleware/authMiddleware");
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

// Get a single supervisor by ID (Admin or self)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id);
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    // Allow admin or the owner of the supervisor data to access
    if (supervisor.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    res.json(supervisor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Create a new supervisor (Admin only)
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  // Call the controller's createSupervisor method
  await createSupervisor(req, res);
});

// Update a supervisor (Admin or self)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id);
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    if (supervisor.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const updatedSupervisor = await Supervisor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSupervisor);
  } catch (error) {
    res.status(400).json({ message: "Error updating supervisor", error });
  }
});

// Delete a supervisor (Admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  try {
    const supervisor = await Supervisor.findById(req.params.id);
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }
    await supervisor.remove();
    res.json({ message: "Supervisor deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;