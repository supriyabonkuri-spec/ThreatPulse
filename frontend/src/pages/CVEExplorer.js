import React, { useState, useEffect } from 'react';

function CVEExplorer() {
  const [cves, setCVEs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCVEs(filter);
  }, [filter]);

  const fetchCVEs = async (severity) => {
    setLoading(true);
    try {
      const url = severity
        ? `http://127.0.0.1:5000/api/cves?severity=${severity}`
        : 'http://127.0.0.1:5000/api/cves';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setCVEs(data.cves);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (severity) => {
    const s = severity?.toLowerCase();
    if (s === 'critical') return 'badge badge-critical';
    if (s === 'high') return 'badge badge-high';
    if (s === 'medium') return 'badge badge-medium';
    if (s === 'low') return 'badge badge-low';
    return 'badge badge-unknown';
  };

  const filtered = cves.filter(cve =>
    cve.id.toLowerCase().includes(search.toLowerCase()) ||
    cve.description.toLowerCase().includes(search.toLowerCase())
  );

  const filters = ['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const filterLabels = ['All', 'Critical', 'High', 'Medium', 'Low'];

  return (
    <div>
      <h1 className="page-title">🔎 CVE Explorer</h1>
      <p className="page-subtitle">Browse and search the latest vulnerabilities from NVD</p>

      {/* Search */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <input
          className="input-field"
          placeholder="Search CVE ID or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {filters.map((f, i) => (
          <button
            key={f}
            className="btn"
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? '#3b82f6' : '#1f2937',
              color: filter === f ? 'white' : '#9ca3af',
              padding: '8px 16px'
            }}
          >
            {filterLabels[i]}
          </button>
        ))}
      </div>

      {/* CVE List */}
      {loading ? (
        <div className="loading">⏳ Loading CVEs from NVD...</div>
      ) : (
        filtered.map(cve => (
          <div key={cve.id} className="card" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ color: '#60a5fa', fontWeight: '700', fontSize: '15px' }}>{cve.id}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>Score: {cve.score}</span>
                <span className={getBadgeClass(cve.severity)}>{cve.severity}</span>
                <span style={{ color: '#4b5563', fontSize: '12px' }}>{cve.published}</span>
              </div>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.5' }}>{cve.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default CVEExplorer;