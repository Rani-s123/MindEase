import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const MOODS = [
  { key: "great", emoji: "😄", label: "Great" },
  { key: "good", emoji: "🙂", label: "Good" },
  { key: "okay", emoji: "😐", label: "Okay" },
  { key: "low", emoji: "😔", label: "Low" },
  { key: "bad", emoji: "😢", label: "Bad" },
];

const QUICK_REPLIES = [
  "I feel anxious",
  "I can't sleep",
  "I feel overwhelmed",
  "I need to calm down",
  "I feel lonely",
  "I'm feeling sad",
];

const MOOD_RESPONSES = {
  great: "That's wonderful to hear! 😊 What's making today great for you?",
  good: "Glad you're doing well! How can I support you today? 💚",
  okay: "Just okay is perfectly valid. Is there anything on your mind? 🌿",
  low: "I'm sorry you're feeling low. I'm here for you — want to talk about it? 💛",
  bad: "I'm really sorry you're feeling bad. You don't have to face this alone. 💚",
};

export default function Chat({ userId }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm MindEase, your mental wellness companion 💚 I'm here to listen, support, and help you feel better. How are you doing today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      const res = await axios.get(`/api/mood/streak/${userId}`);
      setStreak(res.data.streak);
    } catch {
      setStreak(0);
    }
  };

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood.key);
    try {
      await axios.post("/api/mood", { mood: mood.key, userId });
      fetchStreak();
    } catch {}
    const response = MOOD_RESPONSES[mood.key];
    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    const chatHistory = newMessages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await axios.post("/api/chat", {
        message: msg,
        userId,
        history: chatHistory,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm here for you. Something went wrong on my end — please try again. 💚",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-card">
          <div className="sidebar-label">How are you feeling?</div>
          <div className="mood-quick">
            {MOODS.map((m) => (
              <button
                key={m.key}
                className={`mood-q-btn ${selectedMood === m.key ? "active" : ""}`}
                onClick={() => handleMoodSelect(m)}
                title={m.label}
              >
                {m.emoji}
                <div className="mood-q-label">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-card">
          <div className="sidebar-label">Check-in Streak</div>
          <div className="streak-display">
            <div className="streak-num">{streak}</div>
            <div className="streak-label">days in a row 🔥</div>
          </div>
        </div>

        <div className="sidebar-card">
          <div className="sidebar-label">Quick Resources</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {["🌬️ Breathing exercise", "🌿 Grounding technique", "📝 Journaling prompt", "📞 iCall: 9152987821"].map(
              (r, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "12px",
                    padding: "7px 10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    background: "var(--bg)",
                  }}
                  onClick={() => sendMessage(`Tell me about ${r.slice(3)}`)}
                >
                  {r}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        <div className="chat-header">
          <div className="chat-avatar">💚</div>
          <div>
            <div className="chat-name">MindEase Companion</div>
            <div className="chat-status">● Online · here for you</div>
          </div>
        </div>

        <div className="messages-area">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role === "user" ? "user" : ""}`}>
              <div className="msg-avatar">
                {msg.role === "user" ? "You" : "M"}
              </div>
              <div className="bubble">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="message">
              <div className="msg-avatar">M</div>
              <div className="bubble">
                <div className="typing-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-chips">
          {QUICK_REPLIES.map((q, i) => (
            <button key={i} className="chip" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>

        <div className="input-row">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Share what's on your mind..."
            rows={1}
          />
          <button className="send-btn" onClick={() => sendMessage()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
