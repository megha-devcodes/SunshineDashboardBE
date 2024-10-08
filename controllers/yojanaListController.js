const YojanaRegistration = require("../models/YojanaRegistration");

// Fetch the list of all Yojana Registrations
exports.getRegistrations = async (req, res) => {
  try {
    const registrations = await YojanaRegistration.find();
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch a single registration by ID
exports.getRegistrationById = async (req, res) => {
  try {
    const registration = await YojanaRegistration.findOne({
      registerId: req.params.id,
    });
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a registration
exports.updateRegistration = async (req, res) => {
  try {
    const { confirm, trnxId } = req.body;
    const updatedRegistration = await YojanaRegistration.findOneAndUpdate(
      { registerId: req.params.id },
      { confirm, trnxId },
      { new: true },
    );

    if (!updatedRegistration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.status(200).json(updatedRegistration);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add a new registration
exports.addRegistration = async (req, res) => {
  const {
    registerId,
    adhaarNo,
    applicantName,
    fatherName,
    mobile,
    fee,
    entryDate,
    state,
    city,
    gram,
    post,
    thana,
    tehsil,
    supervisorId,
    yojanaName,
  } = req.body;

  try {
    const newRegistration = new YojanaRegistration({
      registerId,
      adhaarNo,
      applicantName,
      fatherName,
      mobile,
      fee,
      entryDate,
      state,
      city,
      gram,
      post,
      thana,
      tehsil,
      supervisorId,
      yojanaName,
    });

    const savedRegistration = await newRegistration.save();
    res.status(201).json(savedRegistration);
  } catch (error) {
    res.status(500).json({ message: "Error adding registration", error });
  }
};
