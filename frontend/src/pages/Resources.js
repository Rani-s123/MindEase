import React, { useState, useEffect } from "react";
import axios from "axios";

const FALLBACK = [
  { id:1, icon:"🌬️", title:"4-7-8 Breathing", category:"breathing", duration:"5 min", description:"Inhale 4 counts, hold 7, exhale 8. Repeat 4 times to activate your parasympathetic nervous system." },
  { id:2, icon:"🌿", title:"5-4-3-2-1 Grounding", category:"grounding", duration:"3 min", description:"Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Brings you back to the present." },
  { id:3, icon:"🧘", title:"Body Scan Meditation", category:"meditation", duration:"10 min", description:"Slowly scan from head to toe, consciously releasing tension in each muscle group." },
  { id:4, icon:"📝", title:"Gratitude Journaling", category:"journaling", duration:"10 min", description:"Write 3 things you're grateful for and 1 challenge you overcame today. Shifts focus to the positive." },
  { id:5, icon:"📞", title:"iCall India Helpline", category:"crisis", duration:"24/7", description:"Free psychological counselling by trained professionals. Call: 9152987821. Confidential and supportive." },
  { id:6, icon:"💆", title:"Progressive Muscle Relaxation", category:"relaxation", duration:"15 min", description:"Tense and release each muscle group from toes to head. Reduces physical tension from stress." },
  { id:7, icon:"🚶", title:"Mindful Walking", category:"mindfulness", duration:"20 min", description:"Walk slowly, noticing each step. Feel the ground, observe surroundings without judgment." },
  { id:8, icon:"🎵", title:"Music Therapy", category:"relaxation", duration:"Any", description:"Listen to calming music — 432Hz frequencies or nature sounds can reduce anxiety significantly." },
  { id:9, icon:"🌊", title:"Cold Water Face Splash", category:"grounding", duration:"1 min", description:"Splash cold water on your face to trigger the dive reflex — instantly slows heart rate." },
];

const CATEGORIES = ["all", "breathing", "grounding", "meditation", "journaling", "relaxation", "mindfulness", "crisis"];

export default function Resources() {
  const [resources, setResources] = useState(FALLBACK);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get("/api/resources")
      .then(res => { if (res.data?.length) setResources(res.data); })
      .catch(() => {});
  }, []);

  const filtered = filter === "all" ? resources : resources.filter(r => r.category === filter);

  return (
    <div>
      <h1 className="page-title">Wellness Resources</h1>
      <p className="page-subtitle">Evidence-based tools to help you feel calmer and more grounded 🌿</p>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"1.5rem" }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding:"6px 14px", borderRadius:"20px", border:"1px solid",
              fontSize:"13px", cursor:"pointer", fontFamily:"inherit",
              borderColor: filter === cat ? "var(--green)" : "var(--border)",
              background: filter === cat ? "var(--green-light)" : "white",
              color: filter === cat ? "var(--green-dark)" : "var(--text-muted)",
              fontWeight: filter === cat ? 500 : 400,
              textTransform:"capitalize",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="resources-grid">
        {filtered.map(r => (
          <div
            key={r.id}
            className="resource-card"
            onClick={() => setExpanded(expanded === r.id ? null : r.id)}
          >
            <div className="res-icon">{r.icon}</div>
            <div className="res-title">{r.title}</div>
            <div className="res-desc">{r.description}</div>
            <div className="res-meta">
              <span className="res-duration">⏱ {r.duration}</span>
              <span className="res-category" style={{textTransform:"capitalize"}}>{r.category}</span>
            </div>
            {expanded === r.id && r.category === "crisis" && (
              <div style={{
                marginTop:"12px", padding:"10px", background:"#fff5f5",
                borderRadius:"8px", border:"1px solid #fed7d7",
                fontSize:"13px", color:"#c53030"
              }}>
                📞 <strong>iCall India: 9152987821</strong><br/>
                Available Mon–Sat, 8am–10pm. Free & confidential.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
