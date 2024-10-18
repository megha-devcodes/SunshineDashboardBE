const mongoose = require("mongoose");

const YojanaSchema = new mongoose.Schema({
  registerId: { type: String, unique: true, required: true },
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  yojanaName: {
    type: String,
    enum: ["FREE SEWING MACHINE DISTRIBUTION PARIYOJNA"],
    required: true,
  },
  memberFees: { type: Number, default: 30.0 },

  fullName: { type: String, required: true },
  guardianName: { type: String, required: true },
  motherName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  category: { type: String, enum: ["OBC", "General", "ST", "SC"], required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: false },

  address: {
    state: { type: String, required: true },
    city: { type: String, required: true },
    village: { type: String },
    post: { type: String },
    policeStation: { type: String },
    tehsil: { type: String },
    district: { type: String, required: true },
    pincode: { type: String, required: false },
  },
  correspondenceAddress: {
    village: { type: String },
    post: { type: String },
    policeStation: { type: String },
    tehsil: { type: String },
    district: { type: String },
    pincode: { type: String },
  },

  guardianAnnualIncome: { type: String },
  rationCard: { type: String },
  villageHeadName: { type: String },
  previousTrainingInstitute: { type: String },
  workDuration: { type: String },
  preferredPanchayat: { type: String },

  identityType: { type: String, required: true },
  documentNumber: { type: String, required: true },
  photo: { type: String },
  signature: { type: String },
  identityDocument: { type: String },

  trnxId: { type: String, default: "" },
  confirm: { type: Boolean, default: false },
  fee: { type: Number, default: 0 },
  entryDate: { type: Date, default: Date.now },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Yojana", YojanaSchema);