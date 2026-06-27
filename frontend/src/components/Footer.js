import React from 'react';

function Footer() {
  return (
    <footer style={{
      background: '#111827',
      borderTop: '1px solid #1f2937',
      padding: '20px',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <p style={{ color: '#6b7280', fontSize: '13px' }}>
        🛡️ ThreatPulse — Cybersecurity Threat Monitoring & Analysis Portal
      </p>
      <p style={{ color: '#4b5563', fontSize: '12px', marginTop: '4px' }}>
        Built by Bonkuri Supriya (B23CN117) | SITER Academy Summer Internship 2026
      </p>
    </footer>
  );
}

export default Footer;