const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are MindEase, a compassionate and empathetic AI mental health companion. 
Your role is to:
- Listen actively and validate the user's feelings
- Provide emotional support and encouragement
- Suggest evidence-based coping techniques (breathing, grounding, journaling)
- Recommend professional help when needed
- Never diagnose or replace a therapist
- Always respond warmly, gently, and with empathy
- Keep responses concise (2-4 sentences) unless more detail is needed
- Use calming language and appropriate emojis occasionally
- If user mentions self-harm or crisis, immediately provide crisis resources (iCall India: 9152987821)`;

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message, userId = "guest", history = [] } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // Save user message
    await Message.create({ userId, role: "user", content: message });

    // Build messages array for OpenAI
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-10), // last 10 messages for context
      { role: "user", content: message },
    ];

    let reply = "";

    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here') {
      // Real OpenAI call
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages,
          max_tokens: 300,
          temperature: 0.75,
        }),
      });
      const data = await response.json();
      if (response.ok && data.choices?.[0]?.message?.content) {
        reply = data.choices[0].message.content;
      } else {
        console.error("OpenAI API Error:", data.error || data);
        reply = getFallbackResponse(message);
      }
    } else {
      // Fallback responses if no API key
      reply = getFallbackResponse(message);
    }

    // Save assistant reply
    await Message.create({ userId, role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong", reply: "I'm here for you. Please try again." });
  }
});

// GET /api/chat/history
router.get("/history/:userId", async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.params.userId })
      .sort({ createdAt: 1 })
      .limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch history" });
  }
});

function getFallbackResponse(text) {
  const t = text.toLowerCase();
  
  // Specific Moods & Topics
  if (t.includes("anxi") || t.includes("worry") || t.includes("panic"))
    return "Anxiety can feel overwhelming, but you're not alone. Try breathing in for 4 counts, holding for 4, and exhaling for 6. Would you like to talk about what's triggering these feelings? 💚";
  if (t.includes("sleep") || t.includes("insomnia") || t.includes("tired") || t.includes("exhaust"))
    return "Sleep struggles are so exhausting. A consistent bedtime routine and limiting screens before bed can really help. What does your evening usually look like? 🌙";
  if (t.includes("sad") || t.includes("depress") || t.includes("hopeless") || t.includes("cry"))
    return "I'm really glad you're talking to me. Feeling sad is valid and you deserve support. Have you been able to speak to anyone you trust about this? 💛";
  if (t.includes("stress") || t.includes("overwhelm") || t.includes("pressure"))
    return "It sounds like you have a lot going on. Let's take it one step at a time. What feels most urgent to you right now? 🌿";
  if (t.includes("lonely") || t.includes("alone") || t.includes("isolated"))
    return "Loneliness can feel really heavy. Reaching out like this is a brave step. Would you like to explore some ways to feel more connected? 💙";
  if (t.includes("breath") || t.includes("calm") || t.includes("relax"))
    return "Let's do this together: breathe in slowly for 4 counts... hold for 4... breathe out for 6. How do you feel? 🌬️";
  if (t.includes("angry") || t.includes("mad") || t.includes("frustrat") || t.includes("annoy"))
    return "It's completely okay to feel frustrated or angry right now. Sometimes venting helps. I'm here if you want to let it all out. 🍃";
  if (t.includes("crisis") || t.includes("harm") || t.includes("suicide") || t.includes("die"))
    return "I'm really concerned about you right now. Please reach out to iCall India at 9152987821 — they are available 24/7 and can help. You matter. 💚";
  
  // Greetings & Conversational
  if (t.match(/^(hi|hello|hey|namaste|greetings)/))
    return "Hello there! I'm MindEase, your companion. How is your heart feeling today? ✨";
  if (t.includes("how are you"))
    return "I'm doing well, thank you for asking! But more importantly, how are you feeling in this moment? 🌻";
  if (t.includes("thank you") || t.includes("thanks") || t.includes("appreciate"))
    return "You're so welcome. I'm always here whenever you need a safe space to talk. 💚";
  if (t.includes("who are you") || t.includes("what is your name") || t.includes("your name"))
    return "I'm MindEase, your AI mental wellness companion. I'm here to listen without judgment and support you however I can. 🌿";
  if (t.includes("joke") || t.includes("funny") || t.includes("laugh"))
    return "Why did the scarecrow win an award? Because he was outstanding in his field! 😄 I hope that brought a tiny smile to your face. How are you feeling?";

  // Dynamic Generic Fallbacks
  const genericResponses = [
    "Thank you for sharing that with me. I'm here to listen. Can you tell me a little more about what you've been experiencing? 💚",
    "I hear you. Sometimes it helps just to put things into words. What else is on your mind today? 🌿",
    "That makes sense. I'm really glad you decided to share that with me. How can I best support you right now? ✨",
    "It takes courage to open up. I'm here for you, no matter what. Take your time, and tell me more when you're ready. 💙",
    "I understand. Is there a specific part of that which is bothering you the most? 🌻"
  ];
  
  // Return a random generic response
  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}

module.exports = router;
