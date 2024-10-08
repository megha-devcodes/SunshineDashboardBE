const Supervisor = require("../models/Supervisor");

const generateRegisterId = () => {
  const prefix = "SUP";
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNumber}`;
};

exports.createSupervisor = async (req, res) => {
  const {
    userId,
    name,
    fatherName,
    motherName,
    state,
    city,
    mobileNumber,
    email,
    registrationFee,
    commission,
    earningCommission,
    oldWalletCr,
    oldWalletDr,
    walletCr,
    walletDr,
    balance,
    totalInternReg,
    totalYojanaReg,
    totalReg,
    professionalInfo,
  } = req.body;

  try {
    const registerId = generateRegisterId();

    const newSupervisor = new Supervisor({
      userId,
      registerId,
      name,
      fatherName,
      motherName,
      state,
      city,
      mobileNumber,
      email,
      registrationFee,
      commission,
      earningCommission,
      oldWalletCr,
      oldWalletDr,
      walletCr,
      walletDr,
      balance,
      totalInternReg,
      totalYojanaReg,
      totalReg,
      professionalInfo,
    });

    const savedSupervisor = await newSupervisor.save();
    res.status(201).json({
      message: "Supervisor created successfully",
      data: savedSupervisor,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create supervisor", error });
  }
};