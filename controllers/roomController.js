const Room = require("../models/Room");

exports.createRoom = async (req, res) => {
  const { name, type, members } = req.body;
  try {
    const room = new Room({ name, type, members });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("members")
      .populate({ path: "messages", populate: { path: "user" } });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserRooms = async (req, res) => {
  try {
    const userId = req.params.userId;
    const rooms = await Room.find({ members: userId })
      .populate("members")
      .populate({ path: "messages", populate: { path: "user" } });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Controller for adding a member to a room
exports.addMemberToRoom = async (req, res) => {
  const { roomId, userId } = req.body;
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (!room.members.includes(userId)) {
      room.members.push(userId);
      room.memberCount = room.members.length;
      room.updated = new Date();
      room.populate("members");
      await room.save();
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for removing a member from a room
exports.removeMemberFromRoom = async (req, res) => {
  const { roomId, userId } = req.body;
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    room.members = room.members.filter(
      (member) => member.toString() !== userId
    );
    room.memberCount = room.members.length;
    room.updated = new Date();
    room.populate("members");
    await room.save();
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting a room
exports.deleteRoom = async (req, res) => {
  const { roomId } = req.body;
  try {
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new room
exports.createRoom = async (req, res) => {
  const { name = "", type, members, avatar = "" } = req.body;

  try {
    // Check if the room already exists
    const participants = members.sort();
    const existingRoom = await Room.findOne({
      members: { $all: participants, $size: participants.length },
      type: type || (members.length === 2 ? "individual" : "group"),
    }).populate("members");

    if (existingRoom) {
      return res.status(200).json(existingRoom); // Room exists, return it
    }

    // Create a new room
    const room = new Room({
      name,
      avatar,
      type: type || (members.length === 2 ? "individual" : "group"),
      members,
      memberCount: members.length,
      unRead: 0,
      isTyping: false,
      messages: [],
      pinnedMessages: [],
      created: new Date(),
      updated: new Date(),
    });

    await room.save();

    // Populate members for the response
    await room.populate("members").execPopulate();

    res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: error.message });
  }
};
