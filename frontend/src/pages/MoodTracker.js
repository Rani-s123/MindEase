import React, { useState, useEffect } from "react";
import axios from "axios";

const MOODS = [
  { key: "great", emoji: "😄", label: "Great", color: "#22c55e" },
  { key: "good", emoji: "🙂", label: "Good", color: "#1D9E75" },
  { key: "okay", emoji: "😐", label: "Okay", color: "#f59e0b" },
  { key: "low", emoji: "😔", label: "Low", color: "#f97316" },
  { key: "bad", emoji: "😢", label: "Bad", color: "#ef4444" },
];

export default function MoodTracker({ userId }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`/api/mood/${userId}`);
      setHistory(res.data);
    } catch {}
  };

  const saveMood = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await axios.post("/api/mood", { mood: selected, note, userId });
      setSaved(true);
      setNote("");
      setSelected(null);
      fetchHistory();
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setLoading(false);
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const getMoodInfo = (key) => MOODS.find((m) => m.key === key) || MOODS[2];

  return (
    <div className="mood-page">
      <h1 className="page-title">Mood Tracker</h1>
      <p className="page-subtitle">Track how you feel each day to spot patterns and progress 🌱</p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="sidebar-label" style={{ marginBottom: "1rem" }}>How are you feeling right now?</div>
        <div className="mood-grid">
          {MOODS.map((m) => (
            <div
              key={m.key}
              className={`mood-card ${selected === m.key ? "selected" : ""}`}
              onClick={() => setSelected(m.key)}
            >
              <div className="mood-emoji">{m.emoji}</div>
              <div className="mood-name">{m.label}</div>
            </div>
          ))}
        </div>

        <textarea
          className="mood-note"
          placeholder="Add a note about how you're feeling (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            className="btn btn-primary"
            onClick={saveMood}
            disabled={!selected || loading}
            style={{ opacity: !selected ? 0.5 : 1 }}
          >
            {loading ? "Saving..." : "Save Mood ✓"}
          </button>
          {saved && (
            <span style={{ fontSize: "14px", color: "var(--green)", fontWeight: 500 }}>
              ✅ Mood saved!
            </span>
          )}
        </div>
      </div>

      {/* History */}
      <div className="mood-history">
        <div className="sidebar-label" style={{ marginBottom: "0.75rem" }}>Recent Check-ins</div>
        {history.length === 0 ? (
          <div className="card" style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
            No mood entries yet. Start tracking today! 🌱
          </div>
        ) : (
          history.map((entry, i) => {
            const mood = getMoodInfo(entry.mood);
            return (
              <div key={i} className="history-item">
                <div className="h-emoji">{mood.emoji}</div>
                <div className="h-text">
                  <div className="h-mood" style={{ color: mood.color }}>{mood.label}</div>
                  {entry.note && <div className="h-note">{entry.note}</div>}
                </div>
                <div className="h-date">{formatDate(entry.createdAt)}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
