import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Heart } from "lucide-react";
import Chat from "./pages/Chat";
import MoodTracker from "./pages/MoodTracker";
import Resources from "./pages/Resources";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import "./App.css";

const PageWrapper = ({ children }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="page-wrapper"
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("mindease_user");
    const savedToken = localStorage.getItem("mindease_token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("mindease_user", JSON.stringify(userData));
    localStorage.setItem("mindease_token", authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("mindease_user");
    localStorage.removeItem("mindease_token");
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {user && (
          <nav className="navbar">
            <div className="nav-logo">
              <Heart className="logo-heart" fill="var(--green)" color="var(--green)" size={26} />
              <span className="logo-text">MindEase</span>
            </div>
            <div className="nav-links">
              <NavLink to="/chat" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Chat</NavLink>
              <NavLink to="/mood" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Mood</NavLink>
              <NavLink to="/resources" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Resources</NavLink>
              <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
            </div>
            <div className="nav-user">
              <div className="user-badge">{user.name?.charAt(0).toUpperCase()}</div>
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </nav>
        )}

        <main className={user ? "main-content" : ""}>
          <AnimatePresence mode="wait">
            <Routes>
              {!user ? (
                <>
                  <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
                  <Route path="/auth" element={<PageWrapper><Auth onLogin={handleLogin} /></PageWrapper>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              ) : (
                <>
                  <Route path="/chat" element={<PageWrapper><Chat userId={user.id} /></PageWrapper>} />
                  <Route path="/mood" element={<PageWrapper><MoodTracker userId={user.id} /></PageWrapper>} />
                  <Route path="/resources" element={<PageWrapper><Resources /></PageWrapper>} />
                  <Route path="/dashboard" element={<PageWrapper><Dashboard userId={user.id} /></PageWrapper>} />
                  <Route path="/" element={<Navigate to="/chat" replace />} />
                  <Route path="*" element={<Navigate to="/chat" replace />} />
                </>
              )}
            </Routes>
          </AnimatePresence>
        </main>

        {user && (
          <footer className="footer">
            <p>MindEase is a supportive tool, not a replacement for professional therapy. If you're in crisis, call <strong>iCall India: 9152987821</strong></p>
          </footer>
        )}
      </div>
    </BrowserRouter>
  );
}
