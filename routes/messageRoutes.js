const express = require("express");
const {
  sendMessage,
  updateMessage,
} = require("../controllers/messageController");
const router = express.Router();

router.post("/", sendMessage);
router.patch("/update", updateMessage);

module.exports = router;
