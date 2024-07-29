const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socketHandler = require("./utils/socket");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

socketHandler(io); // Pass the server to socketHandler

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = server;
