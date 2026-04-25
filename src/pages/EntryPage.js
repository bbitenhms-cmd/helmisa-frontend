import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QrReader } from 'react-qr-reader';

const EntryPage = () => {
  const [selectedTable, setSelectedTable] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (tableNum) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      // Using the reliable demo cafe ID
      await login('demo-cafe-001', tableNum, null);
      navigate('/profile-setup');
    } catch (err) {
      console.error('Entry error:', err);
      setError('Giriş yapılamadı. Lütfen bağlantınızı kontrol edin.');
      setLoading(false);
    }
  };

  const handleQrResult = (result, qrError) => {
    if (!!result) {
      const qrText = result?.text;
      console.log('📸 Scanned:', qrText);
      
      // Format check: helmisa-cafeid-table-number
      const parts = qrText.split('-');
      const tableIndex = parts.indexOf('table');
      if (tableIndex !== -1) {
        const tableNum = parseInt(parts[tableIndex + 1]);
        if (!isNaN(tableNum)) {
            setIsScanning(false);
            handleLogin(tableNum);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            helMisa
          </h1>
          <p className="text-purple-200/60 text-sm uppercase tracking-[0.3em] font-light">Cafe Social</p>
        </header>

        <main className="space-y-6">
          {/* TOP SECTION: QR SCANNER (Visual/Optional) */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-2xl border border-white/10">
            <h2 className="text-center text-sm font-semibold text-purple-300 mb-4 uppercase tracking-wider">Karekod İle Hızlı Giriş</h2>
            <div className="overflow-hidden rounded-2xl border-2 border-dashed border-purple-500/30 bg-black/40 aspect-square relative flex items-center justify-center">
              {isScanning ? (
                <QrReader
                  constraints={{ facingMode: 'environment' }}
                  onResult={handleQrResult}
                  className="w-full h-full"
                  containerStyle={{ width: '100%', height: '100%' }}
                  videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <button 
                    onClick={() => setIsScanning(true)}
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-6 py-2 rounded-full text-sm font-medium transition-all border border-purple-500/30"
                  >
                    Kamerayı Etkinleştir
                  </button>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                  <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          {/* MIDDLE: DIVIDER */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">VEYA</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* BOTTOM SECTION: TABLE SELECTION (Guaranteed Entry) */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-white/10">
            <h2 className="text-center text-xl font-bold text-white mb-6">Masanızı Seçin</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="relative group">
                <select 
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(parseInt(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 text-white text-3xl font-black py-6 px-6 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none transition-all cursor-pointer text-center"
                >
                  {[...Array(50)].map((_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-gray-900 text-xl">Masa {i + 1}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
              </div>

              <button
                onClick={() => handleLogin(selectedTable)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black py-6 px-8 rounded-3xl transition-all shadow-xl shadow-purple-500/20 active:scale-[0.98] disabled:opacity-50 text-xl tracking-wide uppercase"
              >
                {loading ? 'Yükleniyor...' : 'Masaya Otur ✨'}
              </button>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-center">
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </main>

        <footer className="mt-10 text-center">
          <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase">helMisa Build v1.3.5 Stable</p>
        </footer>
      </div>
    </div>
  );
};

export default EntryPage;