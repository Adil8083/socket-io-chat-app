const express = require("express");
const {
  createRoom,
  getRooms,
  getUserRooms,
  addMemberToRoom,
  removeMemberFromRoom,
  deleteRoom,
} = require("../controllers/roomController");
const router = express.Router();

router.get("/user/:userId", getUserRooms);
router.post("/", createRoom);
router.get("/", getRooms);
router.post("/add-member", addMemberToRoom);
router.post("/remove-member", removeMemberFromRoom);
router.delete("/delete", deleteRoom);

module.exports = router;
