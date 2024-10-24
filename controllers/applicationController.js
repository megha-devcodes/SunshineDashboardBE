const bcrypt = require("bcryptjs");
const SupervisorApplication = require("../models/SupervisorApplication");
const UserFactory = require("../factories/UserFactory");
const User = require("../models/User");
const Supervisor = require("../models/Supervisor");

exports.generateCredentials = async (req, res) => {
  try {
    const { userID, password } = await UserFactory.generateCredentials();
    res.status(200).json({
      message: "Credentials generated successfully.",
      userID,
      password,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate credentials.", error });
  }
};

exports.createSupervisorApplication = async (req, res) => {
  try {
    const {
      fullName,
      email,
      permanentAddress,
      correspondenceAddress,
      ...applicationData
    } = req.body;

    const parsedPermanentAddress =
      typeof permanentAddress === "string"
        ? JSON.parse(permanentAddress)
        : permanentAddress;
    const parsedCorrespondenceAddress =
      typeof correspondenceAddress === "string"
        ? JSON.parse(correspondenceAddress)
        : correspondenceAddress;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This email is already registered." });
    }

    const { userID, password } = await UserFactory.generateCredentials();
    const hashedPassword = await bcrypt.hash(password, 12);

    const photo = req.files?.photo?.[0]?.filename || null;
    const signature = req.files?.signature?.[0]?.filename || null;
    const attachedDocument = req.files?.attachedDocument?.[0]?.filename || null;

    const newApplication = new SupervisorApplication({
      userId: userID,
      password: hashedPassword,
      fullName,
      email,
      photo,
      signature,
      attachedDocument,
      permanentAddress: parsedPermanentAddress,
      correspondenceAddress: parsedCorrespondenceAddress,
      ...applicationData,
    });

    const savedApplication = await newApplication.save();

    res.status(201).json({
      message: "Application submitted successfully.",
      data: savedApplication,
      credentials: { userID, password },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit application.", error });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
    } = req.query;

    const query = {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
      ],
    };

    const applications = await SupervisorApplication.find(query)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalApplications = await SupervisorApplication.countDocuments(query);

    res.status(200).json({
      message: "Applications fetched successfully",
      total: totalApplications,
      page: parseInt(page),
      limit: parseInt(limit),
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications.", error });
  }
};

exports.approveApplication = async (req, res) => {
  const { applicationId } = req.params;
  try {
    const application = await SupervisorApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (application.applicationStatus !== "Pending") {
      return res
        .status(400)
        .json({ message: "Application has already been processed." });
    }

    const existingUser = await User.findOne({ email: application.email });
    if (existingUser) {
      return res.status(400).json({
        message: "Duplicate email found. Cannot approve this application.",
      });
    }

    const user = new User({
      userID: application.userId,
      name: application.fullName,
      email: application.email,
      password: application.password,
      role: "supervisor",
    });

    await user.save();

    const newSupervisor = new Supervisor({
      userId: application.userId,
      fullName: application.fullName,
      fatherName: application.fatherName,
      motherName: application.motherName,
      state: application.permanentAddress.state,
      city: application.permanentAddress.city,
      mobileNumber: application.mobileNumber,
      registrationFee: application.registrationFee,
      photo: application.photo,
      joiningDate: new Date(),
    });

    await newSupervisor.save();

    application.applicationStatus = "Approved";
    await application.save();

    res.status(200).json({ message: "Application approved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve application.", error });
  }
};

exports.rejectApplication = async (req, res) => {
  const { applicationId } = req.params;
  try {
    const application = await SupervisorApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (application.applicationStatus === "Approved") {
      await User.deleteOne({ userID: application.userId });
    }

    application.applicationStatus = "Rejected";
    await application.save();

    res.status(200).json({ message: "Application rejected successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject application.", error });
  }
};

exports.deleteApplication = async (req, res) => {
  const { applicationId } = req.params;
  try {
    const application = await SupervisorApplication.findByIdAndDelete(
      applicationId
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({ message: "Application deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete application.", error });
  }
};
