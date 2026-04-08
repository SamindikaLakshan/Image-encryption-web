import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Unlock, Shield, Download, RefreshCw } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState("");
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("encrypt"); // 'encrypt' or 'decrypt'

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResultData(null);
  };

  const processImage = async () => {
    if (!file || key.length !== 8) {
      alert("Please upload a file and enter an 8-character key.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    
    try {
      if (mode === "encrypt") {
        formData.append("file", file);
        formData.append("key", key);
        const response = await axios.post("http://127.0.0.1:8000/encrypt", formData);
        setResultData(response.data.encrypted_data);
      } else {
        // For decryption, we send the text result back
        formData.append("encrypted_data", resultData);
        formData.append("key", key);
        const response = await axios.post("http://127.0.0.1:8000/decrypt", formData, {
          responseType: 'blob' // Important for receiving image files
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setResultData(url);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Processing failed. Ensure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <Shield size={48} color="#38bdf8" style={{ marginBottom: '10px' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>ShiftBlock-8 <span style={{ color: '#38bdf8' }}>Cryptor</span></h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Secure your images using custom SPN logic.</p>

        {/* Mode Switcher */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
          <button onClick={() => {setMode("encrypt"); setResultData(null);}} style={mode === "encrypt" ? activeBtnStyle : btnStyle}><Lock size={16}/> Encrypt</button>
          <button onClick={() => {setMode("decrypt");}} style={mode === "decrypt" ? activeBtnStyle : btnStyle}><Unlock size={16}/> Decrypt</button>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
          {/* File Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', textAlign: 'left' }}>Upload Image:</label>
            <input type="file" onChange={handleFileChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#334155', border: 'none', color: 'white' }} />
          </div>

          {/* Key Input */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', textAlign: 'left' }}>8-Character Master Key:</label>
            <input 
              type="text" 
              maxLength={8} 
              value={key} 
              onChange={(e) => setKey(e.target.value)} 
              placeholder="e.g. mysecret"
              style={{ width: '96%', padding: '12px', borderRadius: '5px', backgroundColor: '#334155', border: '1px solid #475569', color: '#38bdf8', fontSize: '1.1rem', letterSpacing: '2px' }} 
            />
          </div>

          <button 
            onClick={processImage} 
            disabled={loading}
            style={{ width: '100%', padding: '15px', borderRadius: '8px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', border: 'none' }}
          >
            {loading ? <RefreshCw className="spin" /> : mode === "encrypt" ? "ENCRYPT NOW" : "DECRYPT NOW"}
          </button>
        </div>

        {/* Results Area */}
        {resultData && (
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#1e293b', borderRadius: '15px' }}>
            <h3 style={{ marginBottom: '15px' }}>Result:</h3>
            {mode === "encrypt" ? (
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Ciphertext (Base64 Scrambled):</p>
                <textarea readOnly value={resultData} style={{ width: '100%', height: '100px', backgroundColor: '#0f172a', color: '#10b981', border: 'none', borderRadius: '5px', padding: '10px', fontSize: '0.7rem' }} />
              </div>
            ) : (
              <img src={resultData} alt="Decrypted" style={{ maxWidth: '100%', borderRadius: '10px', border: '2px solid #38bdf8' }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Simple Styles
const btnStyle = { padding: '10px 20px', borderRadius: '20px', border: '1px solid #475569', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const activeBtnStyle = { ...btnStyle, backgroundColor: '#38bdf8', color: '#0f172a', borderColor: '#38bdf8' };

export default App;