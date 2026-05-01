const express = require("express");
const router = express.Router();
const Mood = require("../models/Mood");

// POST /api/mood - save mood
router.post("/", async (req, res) => {
  try {
    const { mood, note, userId = "guest" } = req.body;
    if (!mood) return res.status(400).json({ error: "Mood is required" });
    const entry = await Mood.create({ mood, note, userId });
    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ error: "Could not save mood" });
  }
});

// GET /api/mood/:userId - get mood history
router.get("/:userId", async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch moods" });
  }
});

// GET /api/mood/streak/:userId
router.get("/streak/:userId", async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < moods.length; i++) {
      const moodDate = new Date(moods[i].createdAt);
      moodDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((currentDate - moodDate) / (1000 * 60 * 60 * 24));
      if (diffDays === streak) streak++;
      else break;
    }
    res.json({ streak });
  } catch (err) {
    res.status(500).json({ error: "Could not calculate streak" });
  }
});

module.exports = router;
