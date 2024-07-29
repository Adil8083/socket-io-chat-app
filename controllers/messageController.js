const Message = require("../models/Message");
const Room = require("../models/Room");

exports.updateMessage = async (req, res) => {
  const { messageId, action, text } = req.body;

  try {
    let updatedMessage;
    switch (action) {
      case "pin":
        updatedMessage = await Message.findByIdAndUpdate(
          messageId,
          { pinned: true, updated: new Date() },
          { new: true }
        );
        break;
      case "unpin":
        updatedMessage = await Message.findByIdAndUpdate(
          messageId,
          { pinned: false, updated: new Date() },
          { new: true }
        );
        break;
      case "delete":
        updatedMessage = await Message.findByIdAndUpdate(
          messageId,
          { deleted: true, updated: new Date() },
          { new: true }
        );
        break;
      case "edit":
        updatedMessage = await Message.findByIdAndUpdate(
          messageId,
          { text, edited: true, updated: new Date() },
          { new: true }
        );
        break;
      // Add more actions as needed
      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send/Create a new message
exports.sendMessage = async (req, res) => {
  const { roomId, userId, text, attachments = [] } = req.body;

  try {
    // Create a new message
    const message = new Message({
      room: roomId,
      user: userId,
      text,
      attachments,
      timestamp: new Date(),
      edited: false,
      deleted: false,
      pinned: false,
      forwarded: false,
      status: "delivered",
      readBy: [],
      readCount: 0,
      mentionsUsers: [],
      created: new Date(),
      updated: new Date(),
    });

    await message.save();

    // Add message to the room
    await Room.findByIdAndUpdate(
      roomId,
      { $push: { messages: message._id }, updated: new Date() },
      { new: true } // Return the updated room
    ).populate("members"); // Populate members if needed

    // Optionally, populate the message before sending response
    await Message.populate(message, { path: "user" });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message });
  }
};
