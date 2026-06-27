import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/cve', label: 'CVE Explorer' },
    { path: '/url-analyzer', label: 'URL Analyzer' },
    { path: '/ip-checker', label: 'IP Checker' },
    { path: '/history', label: 'History' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav style={{
      background: '#111827',
      borderBottom: '1px solid #1f2937',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#60a5fa' }}>
            🛡️ ThreatPulse
          </span>
        </Link>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '8px' }} className="desktop-menu">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                color: location.pathname === link.path ? '#60a5fa' : '#9ca3af',
                background: location.pathname === link.path ? '#1e3a5f' : 'transparent',
                fontWeight: location.pathname === link.path ? '600' : '400'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#e0e6f0',
            fontSize: '24px',
            cursor: 'pointer'
          }}
          className="hamburger"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: '#111827',
          padding: '12px 0',
          borderTop: '1px solid #1f2937'
        }}>
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '10px 20px',
                textDecoration: 'none',
                color: location.pathname === link.path ? '#60a5fa' : '#9ca3af',
                fontSize: '14px'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;