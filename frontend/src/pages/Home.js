import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
  const [stats, setStats] = useState(null);
  const [recentCVEs, setRecentCVEs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentCVEs();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('https://threatpulse-api.onrender.com/api/cves/stats');
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentCVEs = async () => {
    try {
      const res = await fetch('https://threatpulse-api.onrender.com/api/cves');
      const data = await res.json();
      if (data.success) setRecentCVEs(data.cves.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats ? {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      data: [stats.CRITICAL, stats.HIGH, stats.MEDIUM, stats.LOW],
      backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
      borderWidth: 0
    }]
  } : null;

  const getBadgeClass = (severity) => {
    const s = severity?.toLowerCase();
    if (s === 'critical') return 'badge badge-critical';
    if (s === 'high') return 'badge badge-high';
    if (s === 'medium') return 'badge badge-medium';
    if (s === 'low') return 'badge badge-low';
    return 'badge badge-unknown';
  };

  return (
    <div>
      <h1 className="page-title">🛡️ ThreatPulse Dashboard</h1>
      <p className="page-subtitle">Real-time cybersecurity threat monitoring and analysis</p>

      {/* Quick Actions */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
          <h3 style={{ marginBottom: '8px', color: '#60a5fa' }}>Check a URL</h3>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>
            Scan any URL for malware and phishing
          </p>
          <Link to="/url-analyzer">
            <button className="btn btn-primary">Scan URL</button>
          </Link>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌐</div>
          <h3 style={{ marginBottom: '8px', color: '#60a5fa' }}>Check an IP</h3>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>
            Look up any IP address for abuse reports
          </p>
          <Link to="/ip-checker">
            <button className="btn btn-primary">Check IP</button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: '24px' }}>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#ef4444' }}>
              {stats.CRITICAL.toLocaleString()}
            </div>
            <div className="stat-label">🔴 Critical CVEs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#f97316' }}>
              {stats.HIGH.toLocaleString()}
            </div>
            <div className="stat-label">🟠 High CVEs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#eab308' }}>
              {stats.MEDIUM.toLocaleString()}
            </div>
            <div className="stat-label">🟡 Medium CVEs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#22c55e' }}>
              {stats.LOW.toLocaleString()}
            </div>
            <div className="stat-label">🟢 Low CVEs</div>
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Chart */}
        {chartData && (
          <div className="card">
            <h3 style={{ marginBottom: '16px', color: '#60a5fa' }}>
              📊 Severity Distribution
            </h3>
            <div style={{ maxWidth: '280px', margin: '0 auto' }}>
              <Pie data={chartData} options={{ plugins: { legend: { labels: { color: '#e0e6f0' } } } }} />
            </div>
          </div>
        )}

        {/* Recent CVEs */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', color: '#60a5fa' }}>
            🔥 Latest Vulnerabilities
          </h3>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            recentCVEs.map(cve => (
              <div key={cve.id} style={{
                borderBottom: '1px solid #1f2937',
                paddingBottom: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#60a5fa', fontSize: '13px', fontWeight: '600' }}>{cve.id}</span>
                  <span className={getBadgeClass(cve.severity)}>{cve.severity}</span>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                  {cve.description.substring(0, 100)}...
                </p>
              </div>
            ))
          )}
          <Link to="/cve">
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              View All CVEs →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;