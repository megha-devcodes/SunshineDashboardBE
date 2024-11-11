const Supervisor = require("../models/Supervisor");
const User = require("../models/User");
const UserFactory = require("../factories/UserFactory");

exports.getSupervisorProfile = async (req, res) => {
  try {
    const supervisor = await Supervisor.findOne({ userId: req.user.userID });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor profile not found." });
    }

    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const supervisorProfile = {
      ...supervisor._doc,
      name: user.name,
      email: user.email,
    };

    res.status(200).json(supervisorProfile);
  } catch (error) {
    console.error("Error fetching supervisor profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllSupervisors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "asc",
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const searchCriteria = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } },
            { state: { $regex: search, $options: "i" } },
            { userId: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Supervisor.countDocuments(searchCriteria);

    const sortOrder = order === "desc" ? -1 : 1;
    const sortCriteria = { [sortBy]: sortOrder };

    const supervisors = await Supervisor.find(searchCriteria)
      .sort(sortCriteria)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      data: supervisors,
    });
  } catch (error) {
    console.error("Error fetching all supervisors:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getSupervisorById = async (req, res) => {
  try {
    const { userId } = req.params;
    const supervisor = await Supervisor.findOne({ userId });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }
    res.status(200).json(supervisor);
  } catch (error) {
    console.error("Error fetching supervisor by ID:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateSupervisor = async (req, res) => {
  const allowedFieldsForSupervisor = [
    "mobileNumber",
    "photo",
    "professionalInfo",
  ];
  const restrictedFieldsForAdmin = [
    "balance",
    "walletCr",
    "walletDr",
    "oldBalance",
    "oldWalletCr",
    "oldWalletDr",
    "commission",
    "earningCommission",
    "userId",
  ];
  const isAdmin = req.user.role === "admin";
  const updates = req.body;

  if (req.file) {
    updates.photo = req.file.path;
  }

  if (
    updates.professionalInfo &&
    typeof updates.professionalInfo === "string"
  ) {
    try {
      updates.professionalInfo = JSON.parse(updates.professionalInfo);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid format for professionalInfo" });
    }
  }

  if (!isAdmin) {
    const invalidFields = Object.keys(updates).filter(
      (field) => !allowedFieldsForSupervisor.includes(field)
    );
    if (invalidFields.length > 0) {
      return res.status(403).json({
        message:
          "Supervisors can only update mobileNumber, photo, and professionalInfo fields.",
      });
    }
  }

  if (isAdmin) {
    const invalidAdminFields = Object.keys(updates).filter((field) =>
      restrictedFieldsForAdmin.includes(field)
    );
    if (invalidAdminFields.length > 0) {
      return res.status(403).json({
        message:
          "Credits, balance, and wallet-related fields must be updated using the dedicated credits API.",
      });
    }
  }

  try {
    const supervisor = await Supervisor.findOne({ userId: req.user.userID });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor profile not found." });
    }

    if (isAdmin) {
      Object.keys(updates).forEach((field) => {
        if (!restrictedFieldsForAdmin.includes(field)) {
          supervisor[field] = updates[field];
        }
      });
    } else {
      allowedFieldsForSupervisor.forEach((field) => {
        if (updates[field] !== undefined) supervisor[field] = updates[field];
      });
    }

    await supervisor.save();

    res.status(200).json({
      message: "Supervisor profile updated successfully",
      data: supervisor,
    });
  } catch (error) {
    console.error("Error updating supervisor profile:", error);
    res
      .status(500)
      .json({ message: "Failed to update supervisor profile", error });
  }
};

exports.updateSupervisorCredits = async (req, res) => {
  const { userId, credit, debit, commission } = req.body;

  try {
    const supervisor = await Supervisor.findOne({ userId });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found." });
    }

    supervisor.oldBalance = supervisor.balance;
    supervisor.oldWalletCr = supervisor.walletCr;
    supervisor.oldWalletDr = supervisor.walletDr;

    if (commission !== undefined) {
      supervisor.commission = commission;
      supervisor.earningCommission += commission;
      supervisor.balance += commission;
    }

    if (credit) {
      supervisor.walletCr += credit;
      supervisor.balance += credit;
    }

    if (debit) {
      if (supervisor.balance >= debit) {
        supervisor.walletDr += debit;
        supervisor.balance -= debit;
      } else {
        return res
          .status(400)
          .json({ message: "Insufficient balance for the debit transaction." });
      }
    }

    await supervisor.save();
    res.status(200).json({
      message: "Supervisor credits updated successfully",
      data: supervisor,
    });
  } catch (error) {
    console.error("Error updating supervisor credits:", error);
    res
      .status(500)
      .json({ message: "Failed to update supervisor credits", error });
  }
};

exports.updateSupervisorById = async (req, res) => {
  const { userId } = req.params;
  const restrictedFieldsForAdmin = [
    "balance",
    "walletCr",
    "walletDr",
    "oldBalance",
    "oldWalletCr",
    "oldWalletDr",
    "commission",
    "earningCommission",
    "userId",
  ];

  const updates = req.body;

  if (req.file) {
    updates.photo = req.file.path;
  }

  const invalidFields = Object.keys(updates).filter((field) =>
    restrictedFieldsForAdmin.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(403).json({
      message:
        "Credits and commission must be updated using the dedicated credits API.",
    });
  }

  if (
    updates.professionalInfo &&
    typeof updates.professionalInfo === "string"
  ) {
    try {
      updates.professionalInfo = JSON.parse(updates.professionalInfo);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid format for professionalInfo" });
    }
  }

  try {
    const supervisor = await Supervisor.findOne({ userId });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found." });
    }

    Object.keys(updates).forEach((field) => {
      if (!restrictedFieldsForAdmin.includes(field)) {
        supervisor[field] = updates[field];
      }
    });

    await supervisor.save();

    res.status(200).json({
      message: "Supervisor updated successfully by Admin",
      data: supervisor,
    });
  } catch (error) {
    console.error("Error updating supervisor by admin:", error);
    res.status(500).json({ message: "Failed to update supervisor", error });
  }
};

exports.deleteSupervisorById = async (req, res) => {
  const { userId } = req.params;

  try {
    const supervisor = await Supervisor.findOne({ userId });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found." });
    }

    await User.deleteOne({ userID: userId });
    await Supervisor.deleteOne({ userId });

    res.status(200).json({ message: "Supervisor deleted successfully." });
  } catch (error) {
    console.error("Error deleting supervisor:", error);
    res.status(500).json({
      message: "Server error occurred while trying to delete the supervisor",
      error,
    });
  }
};
