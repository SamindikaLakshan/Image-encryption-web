import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

function Navbar({ mode, onNavigate }) {
  const NAV_HEIGHT = 80;
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const apply = () => setIsMobile(mq.matches);
    apply();

    // Safari < 14 fallback
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else mq.addListener(apply);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', apply);
      else mq.removeListener(apply);
    };
  }, []);

  const navigate = (dest) => {
    onNavigate?.(dest);
    setDrawerOpen(false);
  };

  const navBtnStyle = (active) => ({
    padding: '8px 12px',
    borderRadius: '999px',
    border: `1px solid ${active ? '#38bdf8' : '#334155'}`,
    backgroundColor: active ? '#38bdf8' : 'transparent',
    color: active ? '#0f172a' : '#e2e8f0',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.9rem',
  });

  const drawerItemStyle = (active) => ({
    width: '100%',
    textAlign: 'left',
    padding: '12px 12px',
    borderRadius: '12px',
    border: `1px solid ${active ? '#38bdf8' : '#334155'}`,
    backgroundColor: active ? '#38bdf8' : '#0b1220',
    color: active ? '#0f172a' : '#e2e8f0',
    fontWeight: 800,
    cursor: 'pointer',
  });

  return (
    <div>
      {/* Spacer so content doesn't hide under fixed navbar */}
      <div style={{ height: NAV_HEIGHT }} />

      {/* Navbar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            height: NAV_HEIGHT,
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={22} color="#38bdf8" />
            <div style={{ fontWeight: 800, letterSpacing: '0.3px' }}>ShiftBlock-8 Cryptor</div>
            
          </div>

          {!isMobile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button type="button" onClick={() => navigate('home')} style={navBtnStyle(false)}>
                Home
              </button>
              <button type="button" onClick={() => navigate('encrypt')} style={navBtnStyle(mode === 'encrypt')}>
                Encrypt
              </button>
              <button type="button" onClick={() => navigate('decrypt')} style={navBtnStyle(mode === 'decrypt')}>
                Decrypt
              </button>
              <button type="button" onClick={() => navigate('about')} style={navBtnStyle(false)}>
                About Website
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                border: '1px solid #334155',
                backgroundColor: '#0b1220',
                color: '#e2e8f0',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <div style={{ display: 'grid', gap: 5 }}>
                <span style={{ display: 'block', width: 18, height: 2, backgroundColor: '#e2e8f0' }} />
                <span style={{ display: 'block', width: 18, height: 2, backgroundColor: '#e2e8f0' }} />
                <span style={{ display: 'block', width: 18, height: 2, backgroundColor: '#e2e8f0' }} />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobile && drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onMouseDown={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(2, 6, 23, 0.6)',
          }}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100%',
              width: 'min(86vw, 320px)',
              backgroundColor: '#0f172a',
              borderLeft: '1px solid #1e293b',
              padding: '14px',
              boxShadow: '-20px 0 40px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ fontWeight: 900, color: '#e2e8f0' }}>ShiftBlock-8 Cryptor</div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: '1px solid #334155',
                  backgroundColor: '#0b1220',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  fontWeight: 900,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 12, color: '#94a3b8', fontSize: '0.9rem' }}>
              Mode: <span style={{ color: '#38bdf8', fontWeight: 800 }}>{mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</span>
            </div>

            <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
              <button type="button" onClick={() => navigate('home')} style={drawerItemStyle(false)}>
                Home
              </button>
              <button type="button" onClick={() => navigate('encrypt')} style={drawerItemStyle(mode === 'encrypt')}>
                Encrypt
              </button>
              <button type="button" onClick={() => navigate('decrypt')} style={drawerItemStyle(mode === 'decrypt')}>
                Decrypt
              </button>
              <button type="button" onClick={() => navigate('about')} style={drawerItemStyle(false)}>
                About Website
              </button>
            </div>

            <div style={{ marginTop: 16, color: '#94a3b8', fontSize: '0.9rem' }}>
              Built your privacy with ShiftBlock-8 Cryptor
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
