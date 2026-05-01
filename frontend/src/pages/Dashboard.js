import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MOOD_SCORE = { great: 5, good: 4, okay: 3, low: 2, bad: 1 };
const MOOD_EMOJI = { great:"😄", good:"🙂", okay:"😐", low:"😔", bad:"😢" };

export default function Dashboard({ userId }) {
  const [moods, setMoods] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`/api/mood/${userId}`).catch(() => ({ data: [] })),
      axios.get(`/api/mood/streak/${userId}`).catch(() => ({ data: { streak: 0 } })),
    ]).then(([moodRes, streakRes]) => {
      setMoods(moodRes.data);
      setStreak(streakRes.data.streak);
      setLoading(false);
    });
  }, [userId]);

  const chartData = [...moods].reverse().slice(-14).map((m, i) => ({
    day: new Date(m.createdAt).toLocaleDateString("en-IN", { month:"short", day:"numeric" }),
    score: MOOD_SCORE[m.mood] || 3,
    mood: m.mood,
  }));

  const avgScore = moods.length
    ? (moods.reduce((sum, m) => sum + (MOOD_SCORE[m.mood] || 3), 0) / moods.length).toFixed(1)
    : "—";

  const mostCommon = moods.length
    ? Object.entries(
        moods.reduce((acc, m) => { acc[m.mood] = (acc[m.mood] || 0) + 1; return acc; }, {})
      ).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:"8px", padding:"8px 12px", fontSize:"13px" }}>
          <div>{d.day}</div>
          <div style={{ color:"var(--green)", fontWeight:500 }}>{MOOD_EMOJI[d.mood]} {d.mood}</div>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div style={{ padding:"2rem", color:"var(--text-muted)" }}>Loading your dashboard... 🌿</div>;

  return (
    <div>
      <h1 className="page-title">Your Dashboard</h1>
      <p className="page-subtitle">Track your mental wellness journey over time 📊</p>

      {/* Stats */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-num">{streak}</div>
          <div className="stat-label">Day streak 🔥</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{moods.length}</div>
          <div className="stat-label">Total check-ins</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{mostCommon ? MOOD_EMOJI[mostCommon] : "—"}</div>
          <div className="stat-label">Most common mood</div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-card" style={{ marginBottom:"1.5rem" }}>
        <div className="chart-title">Mood Over Last 14 Days</div>
        {chartData.length === 0 ? (
          <div style={{ textAlign:"center", padding:"2rem", color:"var(--text-muted)", fontSize:"14px" }}>
            No mood data yet. Start checking in daily! 🌱
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize:11 }} />
              <YAxis domain={[1,5]} ticks={[1,2,3,4,5]}
                tickFormatter={v => ["","😢","😔","😐","🙂","😄"][v]}
                tick={{ fontSize:14 }} width={32}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" stroke="#1D9E75" strokeWidth={2.5}
                dot={{ fill:"#1D9E75", strokeWidth:0, r:4 }}
                activeDot={{ r:6, fill:"#0F6E56" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Avg score */}
      <div className="card">
        <div style={{ display:"flex", gap:"1rem", alignItems:"center" }}>
          <div style={{ fontSize:"48px" }}>
            {avgScore !== "—" ? (avgScore >= 4 ? "😄" : avgScore >= 3 ? "🙂" : avgScore >= 2 ? "😐" : "😔") : "💚"}
          </div>
          <div>
            <div style={{ fontWeight:500, fontSize:"16px" }}>Average Mood Score: <span style={{ color:"var(--green)" }}>{avgScore}/5</span></div>
            <div style={{ fontSize:"13px", color:"var(--text-muted)", marginTop:"4px" }}>
              {avgScore >= 4 ? "You're doing really well! Keep it up 🌟" :
               avgScore >= 3 ? "You're managing okay. Small steps each day matter 🌿" :
               avgScore !== "—" ? "It's been tough. Remember to be gentle with yourself 💛" :
               "Start logging your moods to see your wellness trend!"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
