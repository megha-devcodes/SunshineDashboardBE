const Yojana = require("../models/Yojana");

exports.registerYojana = async (req, res) => {
  const {
    yojanaName,
    fullName,
    guardianName,
    motherName,
    dob,
    gender,
    category,
    mobileNumber,
    email,
    address,
    correspondenceAddress,
    guardianAnnualIncome,
    rationCard,
    villageHeadName,
    previousTrainingInstitute,
    workDuration,
    preferredPanchayat,
    documentNumber,
  } = req.body;

  const photo = req.files.photo ? req.files.photo[0].filename : null;
  const signature = req.files.signature
    ? req.files.signature[0].filename
    : null;
  const identityDocument = req.files.identityDocument
    ? req.files.identityDocument[0].filename
    : null;

  try {
    const newRegistration = new Yojana({
      userId: req.user.id,
      yojanaName,
      fullName,
      guardianName,
      motherName,
      dob,
      gender,
      category,
      mobileNumber,
      email,
      address,
      correspondenceAddress,
      guardianAnnualIncome,
      rationCard,
      villageHeadName,
      previousTrainingInstitute,
      workDuration,
      preferredPanchayat,
      photo,
      signature,
      identityDocument,
      documentNumber,
    });

    const savedRegistration = await newRegistration.save();
    res.status(201).json({
      message: "Yojana registered successfully",
      data: savedRegistration,
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};
