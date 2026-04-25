import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// --- CONFIG ---
const BACKEND_URL = 'https://helmisa-backend-production.up.railway.app';

// --- COMPONENTS ---

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleJoin = async (tableNum) => {
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
      console.error('Login error:', err);
      setError('Sunucu bağlantı hatası. Lütfen biraz sonra tekrar deneyin.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-12">
        <header className="text-center">
          <h1 className="text-7xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-white/30">
            helMisa
          </h1>
          <p className="text-white/20 text-xs tracking-[0.6em] uppercase mt-4">Masa Seçimi ile Giriş</p>
        </header>

        <main className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
          <h2 className="text-center text-xl font-bold mb-10 text-purple-400">Otunduğunuz Masayı Seçin</h2>
          
          <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handleJoin(i + 1)}
                disabled={loading}
                className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black hover:bg-purple-600 hover:border-purple-400 transition-all active:scale-90 disabled:opacity-30"
              >
                {i + 1}
              </button>
            ))}
          </div>

          {loading && (
            <div className="mt-10 text-center animate-pulse">
               <p className="text-sm font-bold tracking-widest text-white/40">MASAYA BAĞLANILIYOR...</p>
            </div>
          )}

          {error && (
            <div className="mt-10 p-6 bg-red-500/10 border border-red-500/30 rounded-3xl text-center">
              <p className="text-red-400 text-sm font-bold">{error}</p>
            </div>
          )}
        </main>

        <footer className="text-center opacity-10">
           <p className="text-[10px] font-bold tracking-[1em]">HEL•MISA V6.0 STABLE</p>
        </footer>
      </div>
    </div>
  );
};

const Placeholder = ({ title }) => (
  <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-white/40 mt-4 px-10 text-center">Bu sayfa yükleniyor... Lütfen masa seçimiyle başlayın.</p>
    <button onClick={() => window.location.href = '/'} className="mt-10 text-purple-400 font-bold">Ana Sayfaya Dön</button>
  </div>
);

// --- APP ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/profile-setup" element={<Placeholder title="Profil Kurulumu" />} />
        <Route path="/lobby" element={<Placeholder title="Lobi" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;