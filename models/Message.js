const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: String,
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attachment" }],
  timestamp: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  forwarded: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["sent", "delivered", "read", "failed"],
    default: "sent",
  },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  readCount: { type: Number, default: 0 },
  mentionsUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  quotedMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
