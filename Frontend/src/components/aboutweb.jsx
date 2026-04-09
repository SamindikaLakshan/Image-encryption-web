import React from 'react';

function AboutWeb({ onClose }) {
  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: 'clamp(1.1rem, 3.8vw, 1.6rem)' }}>About this website</h2>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid #334155',
            backgroundColor: 'transparent',
            color: '#e2e8f0',
            fontWeight: 700,
            cursor: 'pointer',
            width: 'min(100%, 120px)',
          }}
        >
          Close
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#0b1220',
          padding: '16px',
          borderRadius: '12px',
          marginTop: '14px',
          borderLeft: '4px solid #38bdf8',
        }}
      >
        <h3 style={{ color: '#38bdf8', fontSize: 'clamp(1rem, 3.2vw, 1.1rem)', marginTop: 0 }}>
          Protect Your Privacy
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 'clamp(0.92rem, 2.9vw, 0.98rem)', lineHeight: '1.6', margin: 0 }}>
          Secure Vision is a privacy-focused platform designed to give you total control over your digital images.
          It transforms your photos into high-entropy “Snow Images” that are unreadable without your unique
          8-character master key.
        </p>
      </div>

      <div style={{ marginTop: '14px', color: '#94a3b8', fontSize: 'clamp(0.92rem, 2.9vw, 0.98rem)', lineHeight: '1.6' }}>
        <div style={{ fontWeight: 800, color: '#e2e8f0', marginBottom: '6px' }}>How to use</div>
        <ul style={{ marginTop: 0, paddingLeft: '20px' }}>
          <li>Encrypt: upload any image → download the scrambled PNG or jpeg file.</li>
          <li>Decrypt: upload the scrambled PNG → download/view your original image.</li>
          <li>Use the same 8-character key for both steps.</li>
        </ul>
      </div>

      <div style={{ marginTop: '14px', color: '#94a3b8', fontSize: 'clamp(0.92rem, 2.9vw, 0.98rem)', lineHeight: '1.6' }}>
        <div style={{ fontWeight: 800, color: '#e2e8f0', marginBottom: '6px' }}>Why use secure vision</div>
        <ul style={{ marginTop: 0, paddingLeft: '20px' }}>
          <li>Privacy Protection: Scramble personal photos before uploading to cloud 
            storage (Google Drive, iCloud) to prevent provider access.</li>
          <li>Secure Sharing: Safely send sensitive IDs, passwords, or documents over 
            "unsecured" chat apps like WhatsApp or Telegram.</li>
          <li>Hidden Storage: Store images "in plain sight" on USB drives or public 
            folders; they look like meaningless system noise or corrupted files.</li>
        </ul>
      </div>
    </div>
  );
}

export default AboutWeb;