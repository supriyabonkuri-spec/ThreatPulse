import React, { useState } from 'react';

function URLAnalyzer() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scanURL = async () => {
    if (!url.trim()) { setError('Please enter a URL'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/scan/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.success) setResult(data);
      else setError(data.error || 'Scan failed');
    } catch (err) {
      setError('Cannot connect to server. Make sure Flask is running.');
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (overall) => {
    if (overall === 'Malicious') return '#ef4444';
    if (overall === 'Suspicious') return '#eab308';
    return '#22c55e';
  };

  return (
    <div>
      <h1 className="page-title">🔍 URL Threat Analyzer</h1>
      <p className="page-subtitle">Check any URL for malware, phishing, and other threats using VirusTotal</p>

      <div className="card">
        <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px', display: 'block' }}>
          Enter URL to scan:
        </label>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            className="input-field"
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && scanURL()}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <button
            className="btn btn-primary"
            onClick={scanURL}
            disabled={loading}
          >
            {loading ? '⏳ Scanning...' : '🔍 Scan URL'}
          </button>
        </div>
        {error && <div className="error" style={{ marginTop: '12px' }}>{error}</div>}
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
          <p style={{ color: '#9ca3af' }}>Scanning URL with 70+ security engines...</p>
          <p style={{ color: '#4b5563', fontSize: '12px', marginTop: '8px' }}>This may take 10-15 seconds</p>
        </div>
      )}

      {result && (
        <div className="card">
          <h3 style={{ color: getResultColor(result.overall), fontSize: '22px', marginBottom: '16px' }}>
            {result.overall === 'Safe' ? '✅' : result.overall === 'Suspicious' ? '⚠️' : '🚨'} {result.overall}
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px', wordBreak: 'break-all' }}>
            URL: {result.url}
          </p>
          <div className="grid-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="stat-card">
              <div className="stat-number" style={{ color: '#ef4444' }}>{result.malicious}</div>
              <div className="stat-label">🔴 Malicious</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: '#eab308' }}>{result.suspicious}</div>
              <div className="stat-label">🟡 Suspicious</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: '#22c55e' }}>{result.harmless}</div>
              <div className="stat-label">🟢 Harmless</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default URLAnalyzer;