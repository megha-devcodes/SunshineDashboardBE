const mongoose = require("mongoose");

const SupervisorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    fatherName: { type: String },
    motherName: { type: String },
    state: { type: String },
    city: { type: String },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    registrationFee: { type: Number, default: 1000.0 },
    commission: { type: Number, default: 0.0 },
    earningCommission: { type: Number, default: 0.0 },
    oldWalletCr: { type: Number, default: 0.0 },
    oldWalletDr: { type: Number, default: 0.0 },
    walletCr: { type: Number, default: 0.0 },
    walletDr: { type: Number, default: 0.0 },
    balance: { type: Number, default: 0.0 },
    totalInternReg: { type: Number, default: 0 },
    totalYojanaReg: { type: Number, default: 0 },
    totalReg: { type: Number, default: 0 },
    professionalInfo: {
      mondalName: { type: String },
      departmentName: { type: String },
      workingArea: { type: String },
      workingCity: { type: String },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Supervisor", SupervisorSchema);
