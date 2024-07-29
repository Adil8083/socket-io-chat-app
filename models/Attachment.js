const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  type: String,
  size: Number,
  name: String,
  uri: String,
  width: Number,
  height: Number,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attachment", attachmentSchema);
