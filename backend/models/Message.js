const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  userId: { type: String, default: "guest" },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
