import React from 'react';

function About() {
  const techStack = [
    { name: 'React.js', desc: 'Frontend UI framework', icon: '⚛️' },
    { name: 'Python Flask', desc: 'Backend REST API', icon: '🐍' },
    { name: 'NVD API', desc: 'CVE vulnerability data', icon: '🛡️' },
    { name: 'VirusTotal API', desc: 'URL threat analysis', icon: '🔍' },
    { name: 'AbuseIPDB API', desc: 'IP reputation data', icon: '🌐' },
    { name: 'SQLite', desc: 'Scan history database', icon: '🗄️' },
    { name: 'Chart.js', desc: 'Data visualizations', icon: '📊' },
    { name: 'GitHub', desc: 'Version control', icon: '💻' },
  ];

  return (
    <div>
      <h1 className="page-title">About ThreatPulse</h1>
      <p className="page-subtitle">Cybersecurity Threat Monitoring & Analysis Portal</p>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#60a5fa', marginBottom: '12px' }}>🎯 What is ThreatPulse?</h2>
        <p style={{ color: '#9ca3af', lineHeight: '1.8' }}>
          ThreatPulse is a real-time cybersecurity threat intelligence portal that aggregates
          data from globally trusted security APIs and presents it through an interactive dashboard.
          Users can monitor the latest CVE vulnerabilities, analyze URLs for malware and phishing,
          and check IP addresses for abuse reports — all in one place.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#60a5fa', marginBottom: '12px' }}>⚡ Key Features</h2>
        {[
          '🔴 Real-time CVE monitoring from the National Vulnerability Database (NVD)',
          '🔍 URL threat analysis powered by 70+ VirusTotal security engines',
          '🌐 IP reputation checking via AbuseIPDB with abuse confidence scoring',
          '📊 Interactive charts showing threat severity distribution',
          '📋 Scan history tracking with SQLite database',
          '📱 Fully responsive mobile-first design',
        ].map(f => (
          <div key={f} style={{
            padding: '10px 0',
            borderBottom: '1px solid #1f2937',
            color: '#e0e6f0',
            fontSize: '14px'
          }}>
            {f}
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#60a5fa', marginBottom: '16px' }}>🛠️ Technology Stack</h2>
        <div className="grid-2">
          {techStack.map(tech => (
            <div key={tech.name} style={{
              background: '#1f2937',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>{tech.icon}</span>
              <div>
                <div style={{ color: '#e0e6f0', fontWeight: '600', fontSize: '14px' }}>{tech.name}</div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>{tech.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 style={{ color: '#60a5fa', marginBottom: '12px' }}>👩‍💻 Developer</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            ['Name', 'Bonkuri Supriya'],
            ['Student ID', 'B23CN117'],
            ['College', 'KITS Warangal'],
            ['Degree', 'B.Tech CSE (Networks)'],
            ['Internship', 'SITER Academy Summer Internship 2026'],
            ['Domain', 'Cybersecurity'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', gap: '16px' }}>
              <span style={{ color: '#6b7280', fontSize: '13px', minWidth: '100px' }}>{label}:</span>
              <span style={{ color: '#e0e6f0', fontSize: '13px' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;