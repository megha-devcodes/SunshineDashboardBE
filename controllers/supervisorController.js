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

exports.updateSupervisor = async (req, res) => {
  const {
    fatherName,
    motherName,
    state,
    city,
    mobileNumber,
    registrationFee,
    commission,
    earningCommission,
    oldWalletCr,
    oldWalletDr,
    walletCr,
    walletDr,
    balance,
    oldBalance,
    totalInternReg,
    totalYojanaReg,
    totalReg,
    professionalInfo,
    photo,
  } = req.body;

  try {
    const supervisor = await Supervisor.findOne({ userId: req.user.userID });

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor profile not found." });
    }

    supervisor.fatherName = fatherName || supervisor.fatherName;
    supervisor.motherName = motherName || supervisor.motherName;
    supervisor.state = state || supervisor.state;
    supervisor.city = city || supervisor.city;
    supervisor.mobileNumber = mobileNumber || supervisor.mobileNumber;
    supervisor.registrationFee = registrationFee || supervisor.registrationFee;
    supervisor.commission = commission || supervisor.commission;
    supervisor.earningCommission =
      earningCommission || supervisor.earningCommission;
    supervisor.oldWalletCr = oldWalletCr || supervisor.oldWalletCr;
    supervisor.oldWalletDr = oldWalletDr || supervisor.oldWalletDr;
    supervisor.walletCr = walletCr || supervisor.walletCr;
    supervisor.walletDr = walletDr || supervisor.walletDr;
    supervisor.balance = balance || supervisor.balance;
    supervisor.oldBalance = oldBalance || supervisor.oldBalance;
    supervisor.totalInternReg = totalInternReg || supervisor.totalInternReg;
    supervisor.totalYojanaReg = totalYojanaReg || supervisor.totalYojanaReg;
    supervisor.totalReg = totalReg || supervisor.totalReg;
    supervisor.professionalInfo =
      professionalInfo || supervisor.professionalInfo;
    supervisor.photo = photo || supervisor.photo;

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
