import React, { useState } from 'react';
import { login, register } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = isLogin ? await login({ email: form.email, password: form.password }) : await register(form);
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const variants = {
    hidden: { opacity: 0, x: isLogin ? -30 : 30 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    exit: { opacity: 0, x: isLogin ? 30 : -30, transition: { duration: 0.2 } }
  };

  return (
    <div className="auth-page">
      <div className="auth-card-wrapper">
        <motion.div 
          className="auth-card glass-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="auth-header">
            <motion.div 
              className="auth-logo"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Heart fill="var(--green)" color="var(--green)" size={32} />
            </motion.div>
            <h1 className="auth-title">MindEase</h1>
            <p className="auth-subtitle">{isLogin ? 'Welcome back to your safe space' : 'Start your wellness journey today'}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={isLogin ? 'login' : 'register'}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleSubmit}
              className="auth-form"
            >
              {!isLogin && (
                <div className="input-group">
                  <UserIcon className="input-icon" size={18} />
                  <input 
                    type="text" 
                    placeholder="Your name" 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    required 
                  />
                </div>
              )}
              <div className="input-group">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  value={form.email} 
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  required 
                />
              </div>
              <div className="input-group">
                <Lock className="input-icon" size={18} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={form.password} 
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                  required 
                />
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="auth-error">
                  {error}
                </motion.div>
              )}

              <button type="submit" disabled={loading} className="btn-primary auth-submit-btn shadow-glow">
                {loading ? <Loader2 className="spinner" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="auth-switch">
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button className="auth-switch-btn" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-3"></div>
    </div>
  );
}
