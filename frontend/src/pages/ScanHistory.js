import React, { useState, useEffect } from 'react';

function ScanHistory() {
  const [urlHistory, setUrlHistory] = useState([]);
  const [ipHistory, setIpHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('urls');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const urlRes = await fetch('https://threatpulse-api.onrender.com/api/history/urls');
      const urlData = await urlRes.json();
      if (urlData.success) setUrlHistory(urlData.history);

      const ipRes = await fetch('https://threatpulse-api.onrender.com/api/history/ips');
      const ipData = await ipRes.json();
      if (ipData.success) setIpHistory(ipData.history);
    } catch (err) {
      console.error(err);
    }
  };

  const getResultColor = (result) => {
    if (result === 'Malicious') return '#ef4444';
    if (result === 'Suspicious') return '#eab308';
    return '#22c55e';
  };

  const getRiskColor = (score) => {
    if (score >= 75) return '#ef4444';
    if (score >= 25) return '#eab308';
    return '#22c55e';
  };

  return (
    <div>
      <h1 className="page-title">📋 Scan History</h1>
      <p className="page-subtitle">View all previous URL and IP scans</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          className="btn"
          onClick={() => setActiveTab('urls')}
          style={{
            background: activeTab === 'urls' ? '#3b82f6' : '#1f2937',
            color: activeTab === 'urls' ? 'white' : '#9ca3af'
          }}
        >
          🔍 URL Scans ({urlHistory.length})
        </button>
        <button
          className="btn"
          onClick={() => setActiveTab('ips')}
          style={{
            background: activeTab === 'ips' ? '#3b82f6' : '#1f2937',
            color: activeTab === 'ips' ? 'white' : '#9ca3af'
          }}
        >
          🌐 IP Checks ({ipHistory.length})
        </button>
      </div>

      {/* URL History */}
      {activeTab === 'urls' && (
        <div className="card">
          {urlHistory.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>
              No URL scans yet. Go to URL Analyzer to scan a URL!
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Date</th>
                    <th>Malicious</th>
                    <th>Suspicious</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {urlHistory.map(row => (
                    <tr key={row.id}>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.url}
                      </td>
                      <td style={{ color: '#6b7280', fontSize: '12px' }}>{row.scan_date}</td>
                      <td style={{ color: '#ef4444' }}>{row.malicious}</td>
                      <td style={{ color: '#eab308' }}>{row.suspicious}</td>
                      <td>
                        <span style={{ color: getResultColor(row.overall), fontWeight: '600' }}>
                          {row.overall}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* IP History */}
      {activeTab === 'ips' && (
        <div className="card">
          {ipHistory.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>
              No IP checks yet. Go to IP Checker to check an IP!
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>IP Address</th>
                    <th>Date</th>
                    <th>Abuse Score</th>
                    <th>Country</th>
                    <th>ISP</th>
                  </tr>
                </thead>
                <tbody>
                  {ipHistory.map(row => (
                    <tr key={row.id}>
                      <td style={{ color: '#60a5fa' }}>{row.ip}</td>
                      <td style={{ color: '#6b7280', fontSize: '12px' }}>{row.scan_date}</td>
                      <td style={{ color: getRiskColor(row.abuse_score), fontWeight: '600' }}>
                        {row.abuse_score}%
                      </td>
                      <td>{row.country}</td>
                      <td style={{ color: '#9ca3af' }}>{row.isp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScanHistory;