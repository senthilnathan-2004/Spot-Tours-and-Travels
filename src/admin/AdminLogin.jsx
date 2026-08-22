import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdArrowBack, MdShield } from 'react-icons/md';
import { api } from './utils/api.js';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if session is already active
  useEffect(() => {
    api.me()
      .then(() => navigate('/admin/dashboard'))
      .catch(() => {});
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.login(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adm-login-page">
      {/* Dynamic Background */}
      <div className="adm-login-backdrop">
        <div className="adm-login-overlay" />
        <div className="adm-login-glow-primary" />
        <div className="adm-login-glow-secondary" />
      </div>

      <div className="adm-login-wrapper">
        <div className="adm-login-box">
          {/* Header & Branding */}
          <div className="adm-login-header">
            <div className="adm-login-badge-tag">
              <MdShield /> ADMIN PORTAL
            </div>
            
            <div className="adm-login-brand">
              <div className="adm-brand-logo-frame">
                <img 
                  src="/logo.jpg" 
                  alt="Spot Tours and Travels" 
                  className="adm-brand-logo-img" 
                />
              </div>
              <div className="adm-brand-titles">
                <h1 className="adm-brand-name-text">
                  SPOT <span>TOURS</span> &amp; TRAVELS
                </h1>
                <p className="adm-brand-tagline-text">THE SPOT FOR NEED'S</p>
              </div>
            </div>

            <p className="adm-login-desc">
              Sign in to manage tour packages, customer bookings, live enquiries, and site content.
            </p>
          </div>

          {/* Form */}
          <form className="adm-login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="adm-login-alert">
                <span>⚠️</span>
                <div>{error}</div>
              </div>
            )}

            <div className="adm-login-input-group">
              <label htmlFor="adm-email">Admin Email</label>
              <div className="adm-input-icon-wrap">
                <MdEmail className="adm-input-icon" />
                <input
                  id="adm-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="adm-login-input-group">
              <label htmlFor="adm-password">Password</label>
              <div className="adm-input-icon-wrap">
                <MdLock className="adm-input-icon" />
                <input
                  id="adm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  className="adm-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            <button type="submit" className="adm-login-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="adm-submit-spinner" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>SECURE SIGN IN</span>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="adm-login-footer">
            <a href="/" className="adm-back-website-link">
              <MdArrowBack /> Return to Public Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
