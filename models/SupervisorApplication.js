const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  addressLine: { type: String },
  post: { type: String },
  policeStation: { type: String },
  tehsil: { type: String },
  district: { type: String },
  state: { type: String },
  pincode: { type: String },
});

const SupervisorApplicationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    caste: {
      type: String,
      enum: ["General", "OBC", "SC", "ST"],
      required: true,
    },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    yojnaName: { type: String, required: true },
    jobType: { type: String, required: true },
    registrationFee: { type: Number, required: true },
    permanentAddress: AddressSchema,
    correspondenceAddress: AddressSchema,
    identityDocumentType: { type: String, required: true },
    documentNumber: { type: String, required: true },
    attachedDocument: { type: String },
    photo: { type: String },
    signature: { type: String },
    experienceYears: { type: Number },
    educationalQualification: { type: String },
    preferredPanchayat: { type: String },
    applicationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "SupervisorApplication",
  SupervisorApplicationSchema,
);
