const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: String,
  fullName: String,
  lastActive: Date,
  online: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
