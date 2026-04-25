import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QrScanner from 'qr-scanner';

const Landing = () => {
  const [selectedTable, setSelectedTable] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = React.useRef(null);
  const scannerRef = React.useRef(null);
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
      setError('Giriş hatası. Lütfen bağlantıyı kontrol edin.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center">
           <h1 className="text-5xl font-black italic tracking-tighter mb-4">helMisa</h1>
           <div className="h-1 w-12 bg-purple-600 mx-auto"></div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl space-y-10">
            <div className="space-y-4">
                <h2 className="text-center text-xs font-bold text-white/30 uppercase tracking-[0.3em]">Hızlı Giriş</h2>
                <button 
                    onClick={() => setIsScanning(true)}
                    className="w-full aspect-video bg-white/5 border border-dashed border-white/20 rounded-3xl flex items-center justify-center text-xs font-black tracking-widest text-purple-400 uppercase"
                >
                    Karekod Okut
                </button>
            </div>

            <div className="space-y-6">
                <h2 className="text-center text-xs font-bold text-white/30 uppercase tracking-[0.3em]">Veya Masa Seçin</h2>
                <select 
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(parseInt(e.target.value))}
                  className="w-full bg-transparent border-b-2 border-white/10 text-white text-6xl font-black py-4 focus:outline-none focus:border-purple-600 transition-all text-center appearance-none"
                >
                  {[...Array(50)].map((_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-black text-lg">{i + 1}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => handleLogin(selectedTable)}
                  disabled={loading}
                  className="w-full bg-white text-black font-black py-6 rounded-3xl transition-all active:scale-95 disabled:opacity-50 text-xl"
                >
                  {loading ? '...' : 'MASAYA OTUR'}
                </button>
            </div>
        </div>

        <p className="text-center text-[10px] font-bold text-white/10 tracking-[0.5em] uppercase">Version 4.0 - Rebuild Force</p>
      </div>
    </div>
  );
};

export default Landing;