import React, { useState } from 'react';

function IPChecker() {
  const [ip, setIp] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkIP = async () => {
    if (!ip.trim()) { setError('Please enter an IP address'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('https://threatpulse-api.onrender.com/api/check/ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip })
      });
      const data = await res.json();
      if (data.success) setResult(data);
      else setError(data.error || 'Check failed');
    } catch (err) {
      setError('Cannot connect to server. Make sure Flask is running.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 75) return '#ef4444';
    if (score >= 25) return '#eab308';
    return '#22c55e';
  };

  return (
    <div>
      <h1 className="page-title">🌐 IP Reputation Checker</h1>
      <p className="page-subtitle">Check any IP address for abuse reports using AbuseIPDB</p>

      <div className="card">
        <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px', display: 'block' }}>
          Enter IP address:
        </label>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            className="input-field"
            placeholder="e.g. 8.8.8.8"
            value={ip}
            onChange={e => setIp(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && checkIP()}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <button
            className="btn btn-primary"
            onClick={checkIP}
            disabled={loading}
          >
            {loading ? '⏳ Checking...' : '🔍 Check IP'}
          </button>
        </div>
        {error && <div className="error" style={{ marginTop: '12px' }}>{error}</div>}
      </div>

      {result && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ color: '#60a5fa' }}>Results for {result.ip}</h3>
            <span style={{
              background: getRiskColor(result.abuse_score),
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontWeight: '700'
            }}>
              {result.risk_level}
            </span>
          </div>

          {/* Abuse Score Bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Abuse Confidence Score</span>
              <span style={{ color: getRiskColor(result.abuse_score), fontWeight: '700' }}>
                {result.abuse_score}%
              </span>
            </div>
            <div style={{ background: '#1f2937', borderRadius: '8px', height: '12px' }}>
              <div style={{
                background: getRiskColor(result.abuse_score),
                width: `${result.abuse_score}%`,
                height: '100%',
                borderRadius: '8px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* Details */}
          <div className="grid-2">
            {[
              { label: '📊 Total Reports', value: result.total_reports },
              { label: '🌍 Country', value: result.country },
              { label: '🏢 ISP', value: result.isp },
              { label: '🌐 Domain', value: result.domain },
            ].map(item => (
              <div key={item.label} style={{
                background: '#1f2937',
                borderRadius: '8px',
                padding: '12px 16px'
              }}>
                <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ color: '#e0e6f0', fontWeight: '600' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default IPChecker;