const YojanaRegistration = require("../models/YojanaRegistration");

exports.getRegistrations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "entryDate",
      order = "desc",
    } = req.query;

    const searchQuery = search
      ? {
          $or: [
            { applicantName: { $regex: search, $options: "i" } },
            { adhaarNo: { $regex: search, $options: "i" } },
            { mobile: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const total = await YojanaRegistration.countDocuments(searchQuery);

    const sortOrder = order === "desc" ? -1 : 1;
    const sortCriteria = { [sortBy]: sortOrder };

    const registrations = await YojanaRegistration.find(searchQuery)
      .populate("supervisorId", "name mobileNumber")
      .sort(sortCriteria)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      data: registrations,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch a single registration by registerId
exports.getRegistrationById = async (req, res) => {
  try {
    const registration = await YojanaRegistration.findOne({
      registerId: req.params.id,
    }).populate("supervisorId", "name mobileNumber");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json(registration);
  } catch (error) {
    console.error("Error fetching registration:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a registration by registerId
exports.updateRegistration = async (req, res) => {
  try {
    const { confirm, trnxId } = req.body;

    const updatedRegistration = await YojanaRegistration.findOneAndUpdate(
      { registerId: req.params.id },
      { confirm, trnxId },
      { new: true, runValidators: true }
    );

    if (!updatedRegistration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json(updatedRegistration);
  } catch (error) {
    console.error("Error updating registration:", error);
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
    // Check if the registerId is unique
    const existingRegistration = await YojanaRegistration.findOne({
      registerId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "Register ID already exists. Please use a unique ID.",
      });
    }

    // Create new registration object
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

    // Save the registration
    const savedRegistration = await newRegistration.save();
    res.status(201).json({
      message: "Registration added successfully",
      data: savedRegistration,
    });
  } catch (error) {
    console.error("Error adding registration:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.errors });
    }
    res.status(500).json({ message: "Server error", error });
  }
};
