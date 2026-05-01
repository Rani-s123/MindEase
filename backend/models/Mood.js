const mongoose = require("mongoose");

const MoodSchema = new mongoose.Schema({
  userId: { type: String, default: "guest" },
  mood: { type: String, enum: ["great", "good", "okay", "low", "bad"], required: true },
  note: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Mood", MoodSchema);
