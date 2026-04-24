import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QrReader } from 'react-qr-reader';

const QRScanPage = () => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleScan = async (result, scanError) => {
    if (!!result && !loading) {
      setLoading(true);
      const qrText = result?.text;
      
      try {
        console.log('📸 Scanned:', qrText);
        const parts = qrText.split('-');
        const tableIndex = parts.indexOf('table');

        if (tableIndex === -1) throw new Error('Geçersiz QR Formatı');

        const cafeId = parts.slice(1, tableIndex).join('-');
        const tableNumber = parseInt(parts[tableIndex + 1]);

        if (!cafeId || isNaN(tableNumber)) throw new Error('Masa bilgisi okunamadı');

        await login(cafeId, tableNumber, null);
        navigate('/profile-setup');
      } catch (err) {
        console.error('Scan error:', err);
        setError(err.message || 'Giriş yapılamadı');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md">
        <header className="text-center mb-10">
          <h1 className="text-6xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            helMisa
          </h1>
          <p className="text-purple-200/70 text-lg">Masaya Katılmak için QR Okut</p>
        </header>

        <main className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          {!scanning ? (
            <div className="flex flex-col items-center py-6">
              <div className="w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mb-8 border border-white/10 animate-pulse">
                <svg className="w-16 h-16 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              
              <button
                onClick={() => setScanning(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-xl shadow-purple-500/20 active:scale-95"
              >
                KAMERAYI AÇ
              </button>
              
              <p className="mt-6 text-sm text-white/40">Sadece masadaki kullanıcılarla etkileşebilirsiniz</p>
            </div>
          ) : (
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border-2 border-purple-500/50 bg-black aspect-square">
                <QrReader
                  constraints={{ facingMode: { ideal: 'environment' } }}
                  onResult={handleScan}
                  className="w-full h-full"
                  containerStyle={{ width: '100%' }}
                  videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {loading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex flex-col gap-3">
                 <p className="text-center text-purple-200 animate-pulse text-sm">QR kodu kare içine ortalayın</p>
                 <button
                  onClick={() => {
                    setScanning(false);
                    setError(null);
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-all"
                >
                  İptal
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-center">
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default QRScanPage;