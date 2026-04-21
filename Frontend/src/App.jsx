import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Lock, Unlock, Shield, RefreshCw } from 'lucide-react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import AboutWeb from './components/aboutweb';

function App() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [key, setKey] = useState("");
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("encrypt");
  const [showAbout, setShowAbout] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // keep in sync with backend
  const ALLOWED_ENCRYPT_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
  const ALLOWED_DECRYPT_TYPES = new Set(["image/png"]);
  const KEY_ALLOWED_RE = /^[A-Za-z0-9 !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{0,8}$/;

  const resetInputs = (nextMode) => {
    setMode(nextMode);
    setFile(null);
    setKey("");
    setLoading(false);
    setErrorMsg("");
    if (resultData) {
      window.URL.revokeObjectURL(resultData);
    }
    setResultData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Styles defined inside for stability
  const btnStyle = { padding: '10px 20px', borderRadius: '20px', border: '1px solid #475569', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
  const activeBtnStyle = { ...btnStyle, backgroundColor: '#38bdf8', color: '#0f172a', borderColor: '#38bdf8' };

  const handleFileChange = (e) => {
    setErrorMsg("");
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setFile(null);
      return;
    }

    const allowed = mode === "encrypt" ? ALLOWED_ENCRYPT_TYPES : ALLOWED_DECRYPT_TYPES;
    if (!allowed.has((f.type || "").toLowerCase())) {
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setErrorMsg(mode === "encrypt" ? "Please upload a PNG/JPG/WebP image." : "Please upload the encrypted PNG file.");
      return;
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setErrorMsg(`File is too large. Max allowed is ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB.`);
      return;
    }

    setFile(f);
    // Clear previous results when a new file is chosen
    if (resultData) {
      window.URL.revokeObjectURL(resultData);
      setResultData(null);
    }
  };

  const processImage = async () => {
    setErrorMsg("");
    const cleanKey = (key ?? "").trim();
    if (!file) {
      setErrorMsg("Please upload a file.");
      return;
    }
    if (cleanKey.length !== 8) {
      setErrorMsg("Key must be exactly 8 characters.");
      return;
    }
    if (!KEY_ALLOWED_RE.test(cleanKey)) {
      setErrorMsg("Key contains unsupported characters.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", cleanKey);

    try {
      const endpoint = mode === "encrypt" ? "encrypt" : "decrypt";

      const response = await axios.post(`https://shiftblock-backend-axamhwfxfkcffubf.eastasia-01.azurewebsites.net/${endpoint}`, formData, {
        responseType: 'blob', 
      });

      // Crucial Fix: Create the URL from the blob
      const blob = new Blob([response.data], { type: 'image/png' });
      const imageUrl = window.URL.createObjectURL(blob);

      // Force state update
      setResultData(imageUrl);

      if (mode === "encrypt") {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.setAttribute('download', 'scrambled_noise.png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    } catch (error) {
      console.error("Error processing:", error);
      const detail = error?.response?.data?.detail;
      setErrorMsg(typeof detail === "string" ? detail : "Request failed. Please check inputs and try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <Navbar
        mode={mode}
        onNavigate={(dest) => {
          if (dest === 'encrypt') {
            resetInputs('encrypt');
          } else if (dest === 'decrypt') {
            resetInputs('decrypt');
          } else if (dest === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (dest === 'about') {
            setShowAbout(true);
          }
        }}
      />

      {showAbout && (
        <div
          role="dialog"
          aria-modal="true"
          onMouseDown={() => setShowAbout(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(2, 6, 23, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(12px, 3vw, 20px)',
          }}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '720px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: 'clamp(14px, 2.5vw, 18px)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.55)',
              maxHeight: 'min(78vh, 720px)',
              overflowY: 'auto',
            }}
          >
            <AboutWeb onClose={() => setShowAbout(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <Shield size={48} color="#38bdf8" style={{ marginBottom: '10px', marginLeft: 'auto', marginRight: 'auto' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>ShiftBlock-8 <span style={{ color: '#38bdf8' }}>Cryptor</span></h1>
          <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Secure your images using custom SPN logic.</p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            <button onClick={() => resetInputs("encrypt")} style={mode === "encrypt" ? activeBtnStyle : btnStyle}><Lock size={16} /> Encrypt</button>
            <button onClick={() => resetInputs("decrypt")} style={mode === "decrypt" ? activeBtnStyle : btnStyle}><Unlock size={16} /> Decrypt</button>
          </div>

          <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', textAlign: 'left' }}>Upload The Image:</label>
              <input
                ref={fileInputRef}
                type="file"
                accept={mode === "encrypt" ? "image/png,image/jpeg,image/webp" : "image/png"}
                onChange={handleFileChange}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#334155', border: 'none', color: 'white' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', textAlign: 'left' }}>8-Character Master Key:</label>
              <input
                type="text"
                maxLength={8}
                value={key}
                onChange={(e) => {
                  const next = e.target.value ?? "";
                  if (KEY_ALLOWED_RE.test(next)) {
                    setKey(next);
                    setErrorMsg("");
                  }
                }}
                placeholder="e.g. mysecret"
                style={{ width: '96%', padding: '12px', borderRadius: '5px', backgroundColor: '#334155', border: '1px solid #475569', color: '#38bdf8', fontSize: '1.1rem', letterSpacing: '2px' }}
              />
            </div>

            {errorMsg && (
              <div style={{ marginBottom: '14px', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#190b0b', border: '1px solid #7f1d1d', color: '#fecaca', textAlign: 'left' }}>
                {errorMsg}
              </div>
            )}

            <button
              onClick={processImage}
              disabled={loading || !file || (key ?? "").trim().length !== 8}
              style={{ width: '100%', padding: '15px', borderRadius: '8px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', fontSize: '1rem', cursor: (loading || !file || (key ?? "").trim().length !== 8) ? 'not-allowed' : 'pointer', border: 'none', opacity: (loading || !file || (key ?? "").trim().length !== 8) ? 0.65 : 1 }}
            >
              {loading ? "Processing..." : mode === "encrypt" ? "ENCRYPT & DOWNLOAD" : "DECRYPT & VIEW"}
            </button>
          </div>

          {/* Image Result */}
          {resultData && typeof resultData === 'string' && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#1e293b', borderRadius: '15px' }}>
              <h3 style={{ marginBottom: '15px' }}>Result:</h3>
              <img
                src={resultData}
                alt="Result"
                style={{ maxWidth: '100%', borderRadius: '10px', border: '2px solid #38bdf8' }}
                onError={() => console.error("Image failed to load from Blob URL")}
              />
              {mode === "decrypt" && (
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
                  <a
                    href={resultData}
                    download="decrypted_image.png"
                    style={{
                      width: '100%',
                      maxWidth: '420px',
                      textAlign: 'center',
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      backgroundColor: '#38bdf8',
                      color: '#0f172a',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                    }}
                  >
                    Download Decrypted Image
                  </a>
                </div>
              )}
              <p style={{ marginTop: '10px', color: '#94a3b8' }}>
                {mode === "encrypt" ? "Encrypted Snow Image (Downloaded)" : "Decrypted Original Image"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;