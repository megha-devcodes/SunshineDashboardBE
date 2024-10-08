const mongoose = require("mongoose");

const YojanaRegistrationSchema = new mongoose.Schema(
  {
    registerId: { type: Number, required: true, unique: true },
    adhaarNo: { type: String, required: true },
    applicantName: { type: String, required: true },
    fatherName: { type: String, required: true },
    mobile: { type: String, required: true },
    trnxId: { type: String, default: "" },
    confirm: { type: Boolean, default: false },
    fee: { type: Number, default: 0 },
    entryDate: { type: Date, default: Date.now },
    state: { type: String, required: true },
    city: { type: String, required: true },
    gram: { type: String },
    post: { type: String },
    thana: { type: String },
    tehsil: { type: String },
    supervisorId: { type: String, required: true },
    yojanaName: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("YojanaRegistration", YojanaRegistrationSchema);
