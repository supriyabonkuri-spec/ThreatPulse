import React, { useState } from 'react';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) {
      alert('Please fill in all required fields');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <h1 className="page-title">Contact Us</h1>
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ color: '#22c55e', marginBottom: '8px' }}>Message Sent!</h2>
          <p style={{ color: '#9ca3af' }}>Thank you for reaching out. We'll get back to you soon.</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: '20px' }}
            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">📬 Contact Us</h1>
      <p className="page-subtitle">Have questions or feedback? Reach out to us!</p>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ color: '#60a5fa', marginBottom: '20px' }}>Send a Message</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
              Name *
            </label>
            <input
              className="input-field"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
              Email *
            </label>
            <input
              className="input-field"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
              Subject
            </label>
            <input
              className="input-field"
              name="subject"
              placeholder="What is this about?"
              value={form.subject}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
              Message *
            </label>
            <textarea
              className="input-field"
              name="message"
              placeholder="Your message..."
              rows={5}
              value={form.message}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button className="btn btn-primary" onClick={handleSubmit} style={{ width: '100%' }}>
            📬 Send Message
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { icon: '🎓', title: 'Institution', value: 'KITS Warangal' },
            { icon: '🏢', title: 'Internship', value: 'SITER Academy, Norge' },
            { icon: '🛡️', title: 'Domain', value: 'Cybersecurity' },
            { icon: '📧', title: 'Student ID', value: 'B23CN117' },
          ].map(item => (
            <div key={item.title} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '28px' }}>{item.icon}</span>
              <div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>{item.title}</div>
                <div style={{ color: '#e0e6f0', fontWeight: '600' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contact;