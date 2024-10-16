const mongoose = require("mongoose");

const YojanaSchema = new mongoose.Schema({
  registerId: { type: String, unique: true, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supervisor",
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
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  category: {
    type: String,
    enum: ["OBC", "General", "ST", "SC"],
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^\d{10}$/,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: false,
  },

  // Address Information
  address: {
    state: { type: String },
    city: { type: String },
    village: { type: String },
    post: { type: String },
    policeStation: { type: String },
    tehsil: { type: String },
    district: { type: String },
    pincode: {
      type: String,
      match: /^\d{6}$/,
      required: false,
    },
  },
  correspondenceAddress: {
    village: { type: String },
    post: { type: String },
    policeStation: { type: String },
    tehsil: { type: String },
    district: { type: String },
    pincode: {
      type: String,
      match: /^\d{6}$/,
    },
  },

  guardianAnnualIncome: { type: String },
  rationCard: { type: String },
  villageHeadName: { type: String },
  previousTrainingInstitute: { type: String },
  workDuration: { type: String },
  preferredPanchayat: { type: String },

  identityType: {
    type: String,
    enum: ["Aadhar", "Ration Card", "Income Tax", "Caste Certificate"],
    required: true,
  },
  documentNumber: { type: String, required: true },
  photo: { type: String },
  signature: { type: String },
  identityDocument: { type: String },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Yojana", YojanaSchema);
