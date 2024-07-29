const Room = require("../models/Room");

exports.createRoom = async (name, type, members) => {
  const room = new Room({ name, type, members });
  await room.save();
  return room;
};

exports.getRooms = async () => {
  return await Room.find().populate("members messages");
};
