const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userID: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "supervisor"],
      default: "supervisor",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
