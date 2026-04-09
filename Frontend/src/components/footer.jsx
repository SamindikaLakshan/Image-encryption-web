import React from 'react';

function Footer() {
  return (
    <div style={{ borderTop: '1px solid #1e293b', padding: '16px 20px', color: '#94a3b8' }}>
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div>© {new Date().getFullYear()} ShiftBlock-8 Cryptor</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span>Tip: Use the same 8-char key to decrypt.</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;