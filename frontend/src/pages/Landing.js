import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, BarChart2, BookOpen, Shield, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  const features = [
    { icon: <MessageCircle size={28} className="text-green" />, title: 'AI Chat Support', desc: 'Talk to an empathetic AI companion available 24/7' },
    { icon: <BarChart2 size={28} className="text-green" />, title: 'Mood Tracking', desc: 'Log your daily mood and see patterns over time' },
    { icon: <BookOpen size={28} className="text-green" />, title: 'Wellness Resources', desc: 'Breathing exercises, meditations and coping tools' },
    { icon: <Shield size={28} className="text-green" />, title: 'Private & Safe', desc: 'Your conversations are secure and confidential' }
  ];

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="landing-logo">
          <Heart fill="var(--green)" color="var(--green)" size={28} />
          <span>MindEase</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <button className="landing-login-btn" onClick={() => navigate('/auth')}>
            Sign In
          </button>
        </motion.div>
      </nav>

      <main className="landing-main">
        <motion.div className="landing-hero" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="sdg-badge">
            <span className="sdg-icon">🌍</span>
            <span>Supporting UN SDG 3 — Good Health & Well-being</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-title">
            Your compassionate<br />
            <span className="text-gradient">mental health</span> companion
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-subtitle">
            Talk to our AI companion, track your daily moods, and access mental wellness resources — all in one safe, private space designed to help you thrive.
          </motion.p>

          <motion.div variants={itemVariants} className="hero-actions">
            <button className="btn-primary large-btn shadow-glow" onClick={() => navigate('/auth')}>
              Start your journey <ArrowRight size={18} />
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants} className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Decorative background elements */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
    </div>
  );
}
