const mongoose = require("mongoose");

const YojanaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supervisor",
    required: true,
  },
  yojanaName: { type: String, required: true },
  memberFees: { type: Number, default: 30.0 },
  fullName: { type: String, required: true },
  guardianName: { type: String, required: true },
  motherName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  category: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String },

  // Address Information
  address: {
    state: { type: String, required: false },
    city: { type: String, required: false },
    village: { type: String, required: false },
    post: { type: String, required: false },
    policeStation: { type: String, required: false },
    tehsil: { type: String, required: false },
    district: { type: String, required: false },
    pincode: { type: String, required: false, match: /^\d{6}$/ },
  },
  correspondenceAddress: {
    village: { type: String },
    post: { type: String },
    policeStation: { type: String },
    tehsil: { type: String },
    district: { type: String },
    pincode: { type: String, match: /^\d{6}$/ },
  },

  // Other Information
  guardianAnnualIncome: { type: String },
  rationCard: { type: String },
  villageHeadName: { type: String },
  previousTrainingInstitute: { type: String },
  workDuration: { type: String },
  preferredPanchayat: { type: String },

  // Document uploads
  photo: { type: String },
  signature: { type: String },
  identityDocument: { type: String },
  documentNumber: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Yojana", YojanaSchema);
