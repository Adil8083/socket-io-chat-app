const socketIo = require("socket.io");
const Room = require("../models/Room");
const Message = require("../models/Message");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on(
      "joinRoom",
      async ({ userId, participantsIds, roomName = "", roomAvatar = "" }) => {
        try {
          // Find an existing room with the same participants
          const participants = participantsIds.sort();

          const existingRoom = await Room.findOne({
            members: { $all: participants, $size: participants.length },
            type: participants.length === 2 ? "individual" : "group",
          })
            .populate({
              path: "members",
              // No need to specify select here to get all fields
            })
            .populate({
              path: "messages",
              populate: {
                path: "user",
              },
              // No need to specify select here to get all fields
            });

          let room;

          if (existingRoom) {
            // Room exists
            room = existingRoom;
          } else {
            // Create a new room
            room = new Room({
              name: roomName,
              avatar: roomAvatar, // Set default avatar or a logic to generate avatar
              type: participants.length === 2 ? "individual" : "group",
              members: participants,
              memberCount: participants.length,
              unRead: 0,
              isTyping: false,
              messages: [],
              pinnedMessages: [],
              created: new Date(),
              updated: new Date(),
            });

            await room.save();

            room = await Room.findById(room._id)
              .populate({
                path: "members",

                // No need to specify select here to get all fields
              })
              .populate({
                path: "messages",
                populate: {
                  path: "user",
                },
              });
          }

          // Join the socket to the room
          socket.join(room._id.toString());
          socket.emit("roomJoined", room);
          console.log(`User ${userId} joined room ${room._id}`);
        } catch (error) {
          console.error("Error joining room:", error);
          socket.emit("error", "An error occurred while joining the room");
        }
      }
    );

    socket.on("sendMessage", async ({ roomId, userId, text, attachments }) => {
      console.log(`User ${userId} sent message in room ${roomId}`, { text });
      try {
        const message = new Message({
          room: roomId,
          user: userId,
          text: text,
          attachments: [],
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
          // You can set other fields here if needed
        });

        await message.save();

        await Room.findByIdAndUpdate(
          roomId,
          { $push: { messages: message._id }, updated: new Date() },
          { new: true } // Return the updated room
        );

        await Message.populate(message, "user");

        // Emit the message to the room
        io.to(roomId).emit("message", message);
        console.log(`Message sent in room ${roomId}`);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", "An error occurred while sending the message");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = socketHandler;
