const express = require("express");
const router = express.Router();

const resources = [
  {
    id: 1,
    title: "4-7-8 Breathing Exercise",
    category: "breathing",
    description: "Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.",
    duration: "5 min",
    icon: "🌬️",
  },
  {
    id: 2,
    title: "5-4-3-2-1 Grounding",
    category: "grounding",
    description: "Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
    duration: "3 min",
    icon: "🌿",
  },
  {
    id: 3,
    title: "Body Scan Meditation",
    category: "meditation",
    description: "Slowly scan from head to toe, relaxing each muscle group.",
    duration: "10 min",
    icon: "🧘",
  },
  {
    id: 4,
    title: "Journaling Prompt",
    category: "journaling",
    description: "Write about 3 things you're grateful for and 1 challenge you overcame today.",
    duration: "10 min",
    icon: "📝",
  },
  {
    id: 5,
    title: "iCall India Helpline",
    category: "crisis",
    description: "Free psychological counselling. Call: 9152987821",
    duration: "24/7",
    icon: "📞",
  },
  {
    id: 6,
    title: "Progressive Muscle Relaxation",
    category: "relaxation",
    description: "Tense and release each muscle group from toes to head.",
    duration: "15 min",
    icon: "💆",
  },
];

router.get("/", (req, res) => res.json(resources));
router.get("/:category", (req, res) => {
  const filtered = resources.filter((r) => r.category === req.params.category);
  res.json(filtered);
});

module.exports = router;
