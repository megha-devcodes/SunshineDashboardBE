const Yojana = require("../models/Yojana");

exports.registerYojana = async (req, res) => {
  try {
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
      identityType,
    } = req.body;

    const userId = req.user.id;

    const photo = req.files?.photo?.[0]?.filename || null;
    const signature = req.files?.signature?.[0]?.filename || null;
    const identityDocument = req.files?.identityDocument?.[0]?.filename || null;

    const registerId = `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newRegistration = new Yojana({
      registerId,
      userId,
      yojanaName,
      fullName,
      guardianName,
      motherName,
      dob,
      gender,
      category,
      mobileNumber,
      email,
      address: {
        state: address?.state,
        city: address?.city,
        village: address?.village,
        post: address?.post,
        policeStation: address?.policeStation,
        tehsil: address?.tehsil,
        district: address?.district,
        pincode: address?.pincode,
      },
      correspondenceAddress: {
        village: correspondenceAddress?.village,
        post: correspondenceAddress?.post,
        policeStation: correspondenceAddress?.policeStation,
        tehsil: correspondenceAddress?.tehsil,
        district: correspondenceAddress?.district,
        pincode: correspondenceAddress?.pincode,
      },
      guardianAnnualIncome,
      rationCard,
      villageHeadName,
      previousTrainingInstitute,
      workDuration,
      preferredPanchayat,
      identityType,
      documentNumber,
      photo,
      signature,
      identityDocument,
    });

    const savedRegistration = await newRegistration.save();

    res.status(201).json({
      message: "Yojana registered successfully",
      data: savedRegistration,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", error: error.errors });
    }
    console.error("Registration failed:", error);
    res.status(500).json({ message: "Registration failed", error });
  }
};
