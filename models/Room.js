const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  unRead: { type: Number, default: 0 },
  isTyping: { type: Boolean, default: false },
  memberCount: { type: Number, default: 0 },
  type: { type: String, enum: ["individual", "group"], required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  pinnedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", roomSchema);
