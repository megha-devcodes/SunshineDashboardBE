const mongoose = require("mongoose");

const SupervisorSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User", required: true },
    fullName: { type: String}, 
    fatherName: { type: String },
    motherName: { type: String },
    state: { type: String },
    city: { type: String },
    mobileNumber: { type: String },
    photo: { type: String },
    registrationFee: { type: Number, default: 1000.0 },
    commission: { type: Number, default: 0.0 },
    earningCommission: { type: Number, default: 0.0 },
    oldWalletCr: { type: Number, default: 0.0 },
    oldWalletDr: { type: Number, default: 0.0 },
    walletCr: { type: Number, default: 0.0 },
    walletDr: { type: Number, default: 0.0 },
    oldBalance: { type: Number, default: 0.0 },
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
    joiningDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supervisor", SupervisorSchema);
