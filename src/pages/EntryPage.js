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
      setError('Giriş başarısız. Lütfen bağlantınızı kontrol edin.');
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
        setError('Kamera başlatılamadı. Tarayıcınızın kamera iznini kontrol edin.');
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
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-md">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-black tracking-tighter mb-2 italic bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-purple-500">
            helMisa
          </h1>
          <p className="text-white/40 text-xs tracking-[0.5em] uppercase">Premium Cafe Experience</p>
        </header>

        <main className="space-y-6">
          {/* 1. TOP SECTION: QR SCAN (Visual Block) */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Karekod İle Hızlı Giriş</span>
                <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`}></div>
            </div>

            {isScanning ? (
              <div className="relative aspect-video bg-black">
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
                <div className="absolute inset-0 border-[30px] border-black/60 pointer-events-none"></div>
                <div className="absolute inset-x-0 bottom-6 flex justify-center">
                    <button 
                        onClick={() => setIsScanning(false)}
                        className="bg-red-500/80 backdrop-blur-xl text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all"
                    >
                        İptal
                    </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsScanning(true)}
                className="w-full py-16 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all group"
              >
                <div className="w-20 h-20 bg-purple-600/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all border border-purple-500/20">
                  <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="font-black text-[10px] tracking-[0.3em] text-purple-400 uppercase italic">Kamerayı Aç</span>
              </button>
            )}
          </div>

          {/* 2. BOTTOM SECTION: TABLE SELECTION (Main Action) */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#050505] px-4 py-1 border border-white/10 rounded-full">
                <span className="text-[9px] font-black text-white/60 tracking-[0.2em] uppercase">Masa Seçimi</span>
            </div>

            <div className="space-y-8">
              <div className="relative">
                <select 
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(parseInt(e.target.value))}
                  className="w-full bg-transparent border-none text-white text-7xl font-black py-4 focus:outline-none transition-all text-center appearance-none"
                >
                  {[...Array(50)].map((_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-black text-lg">{i + 1}</option>
                  ))}
                </select>
                <p className="text-center text-[10px] font-medium text-white/20 uppercase tracking-[0.4em] -mt-2">Masa Numarası</p>
              </div>

              <button
                onClick={() => handleLogin(selectedTable)}
                disabled={loading}
                className="w-full bg-white text-black font-black py-6 rounded-3xl transition-all active:scale-95 disabled:opacity-50 text-xl shadow-2xl hover:bg-purple-50"
              >
                {loading ? 'YÜKLENİYOR...' : 'MASAYA OTUR ✨'}
              </button>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider">{error}</p>
              </div>
            )}
          </div>
        </main>

        <footer className="mt-12 text-center">
           <p className="text-[9px] tracking-[0.6em] text-white/10 font-bold uppercase">helMisa V3.0 Final Build</p>
        </footer>
      </div>
    </div>
  );
};

export default EntryPage;