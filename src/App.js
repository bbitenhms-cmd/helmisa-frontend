import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QrScanner from 'qr-scanner';

// --- AUTH LOGIC ---
const BACKEND_URL = 'https://helmisa-backend-production.up.railway.app';

const LoginPage = () => {
  const [selectedTable, setSelectedTable] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async (tableNum) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/qr-login`, {
        cafe_id: 'demo-cafe-001',
        table_number: tableNum,
        location: null
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('session', JSON.stringify(response.data.session));
      
      window.location.href = '/profile-setup';
    } catch (err) {
      setError('Bağlantı hatası. Lütfen internetinizi kontrol edin.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isScanning && videoRef.current) {
      scannerRef.current = new QrScanner(videoRef.current, (result) => {
        const qrText = result?.data;
        if (qrText && qrText.includes('table')) {
          const tableNum = parseInt(qrText.split('table-')[1]);
          if (!isNaN(tableNum)) handleLogin(tableNum);
        }
      }, { preferredCamera: 'environment' });
      scannerRef.current.start().catch(() => setError('Kamera açılamadı.'));
      return () => { scannerRef.current?.destroy(); };
    }
  }, [isScanning]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-black italic tracking-tighter">helMisa</h1>
          <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mt-2">Version 5.0 Final</p>
        </div>

        {/* QR SECTION */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
          {isScanning ? (
            <div className="relative aspect-video bg-black">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              <button onClick={() => setIsScanning(false)} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 px-6 py-2 rounded-full text-[10px] font-black">İPTAL</button>
            </div>
          ) : (
            <button onClick={() => setIsScanning(true)} className="w-full py-12 flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                📷
              </div>
              <span className="font-bold text-xs tracking-widest text-purple-400">KAREKOD OKUT</span>
            </button>
          )}
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
          <h2 className="text-center text-xs font-bold text-white/30 uppercase tracking-widest mb-6">Veya Masa Seçin</h2>
          <select 
            value={selectedTable} 
            onChange={(e) => setSelectedTable(parseInt(e.target.value))} 
            className="w-full bg-transparent text-white text-6xl font-black py-4 text-center focus:outline-none appearance-none"
          >
            {[...Array(50)].map((_, i) => (<option key={i+1} value={i+1} className="bg-black">{i+1}</option>))}
          </select>
          <button 
            onClick={() => handleLogin(selectedTable)} 
            disabled={loading}
            className="w-full bg-white text-black font-black py-6 rounded-2xl mt-8 active:scale-95 transition-all"
          >
            {loading ? '...' : 'MASAYA OTUR ✨'}
          </button>
        </div>
        {error && <p className="text-red-500 text-center text-xs">{error}</p>}
      </div>
    </div>
  );
};

// --- APP COMPONENT ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<div className="text-white p-20">Yükleniyor...</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;