import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QrScanner from 'qr-scanner';

const EntryPage = () => {
  const [selectedTable, setSelectedTable] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (tableNum) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await login('demo-cafe-001', tableNum, null);
      navigate('/profile-setup');
    } catch (err) {
      console.error('Entry error:', err);
      setError('Giriş yapılamadı. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isScanning && videoRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          const qrText = result?.data;
          if (qrText && qrText.includes('table')) {
            const parts = qrText.split('-');
            const tableIndex = parts.indexOf('table');
            const tableNum = parseInt(parts[tableIndex + 1]);
            if (!isNaN(tableNum)) {
              setIsScanning(false);
              handleLogin(tableNum);
            }
          }
        },
        {
          onDecodeError: (err) => {},
          highlightScanRegion: true,
          preferredCamera: 'environment'
        }
      );

      scannerRef.current.start().catch((err) => {
        console.error('Camera error:', err);
        setError('Kamera açılamadı. Tarayıcınızın kamera iznini kontrol edin.');
        setIsScanning(false);
      });

      return () => {
        if (scannerRef.current) {
          scannerRef.current.destroy();
          scannerRef.current = null;
        }
      };
    }
  }, [isScanning]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-md">
        <header className="text-center mb-10">
          <h1 className="text-7xl font-black tracking-tighter mb-2 italic bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40">
            helMisa
          </h1>
          <div className="h-1 w-20 bg-purple-600 mx-auto rounded-full"></div>
        </header>

        <main className="space-y-4">
          {/* QR SECTION */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
            {isScanning ? (
              <div className="relative aspect-square bg-black">
                <video ref={videoRef} className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none"></div>
                <button 
                  onClick={() => setIsScanning(false)}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-xs font-bold"
                >
                  İptal Et
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsScanning(true)}
                className="w-full py-12 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all group"
              >
                <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="font-bold text-sm tracking-widest text-purple-300">KAREKOD OKUT</span>
              </button>
            )}
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <h2 className="text-center text-xs font-bold text-white/40 uppercase tracking-[0.3em] mb-8">Veya Masa Seçin</h2>
            
            <div className="space-y-6">
              <select 
                value={selectedTable}
                onChange={(e) => setSelectedTable(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-white/10 text-white text-4xl font-black py-6 rounded-2xl focus:outline-none focus:border-purple-500 transition-all text-center appearance-none"
              >
                {[...Array(50)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>MASA {i + 1}</option>
                ))}
              </select>

              <button
                onClick={() => handleLogin(selectedTable)}
                disabled={loading}
                className="w-full bg-white text-black font-black py-6 rounded-2xl transition-all active:scale-95 disabled:opacity-50 text-xl shadow-2xl"
              >
                {loading ? 'GİRİŞ YAPILIYOR...' : 'MASAYA OTUR ✨'}
              </button>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-center">
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </main>

        <footer className="mt-12 text-center opacity-20">
           <p className="text-[10px] tracking-[0.5em] font-bold">helMisa V2.0 Stable Build</p>
        </footer>
      </div>
    </div>
  );
};

export default EntryPage;