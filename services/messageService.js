const Message = require("../models/Message");
const Room = require("../models/Room");

exports.sendMessage = async (roomId, userId, content) => {
  const message = new Message({ room: roomId, user: userId, content });
  await message.save();

  await Room.findByIdAndUpdate(roomId, { $push: { messages: message._id } });

  return message;
};
