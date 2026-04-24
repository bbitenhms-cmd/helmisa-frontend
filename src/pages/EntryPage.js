import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EntryPage = () => {
  const [selectedTable, setSelectedTable] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleJoin = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using the guaranteed demo cafe ID
      await login('demo-cafe-001', selectedTable, null);
      navigate('/profile-setup');
    } catch (err) {
      console.error('Entry error:', err);
      setError('Giriş yapılamadı. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md">
        <header className="text-center mb-10">
          <h1 className="text-6xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            helMisa
          </h1>
          <p className="text-purple-200/70 text-lg tracking-widest font-light">Masaya Katıl</p>
        </header>

        <main className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl border border-white/10">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mb-8 border border-white/10">
               <span className="text-4xl">🪑</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Masa Numaranızı Seçin</h2>

            <div className="w-full mb-8">
              <select 
                value={selectedTable}
                onChange={(e) => setSelectedTable(parseInt(e.target.value))}
                className="w-full bg-white/10 border border-white/20 text-white text-3xl font-bold py-5 px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none transition-all cursor-pointer text-center"
              >
                {[...Array(50)].map((_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-gray-900 text-xl">Masa {i + 1}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 px-8 rounded-2xl transition-all shadow-xl shadow-purple-500/20 active:scale-95 disabled:opacity-50 text-xl"
            >
              {loading ? 'YÜKLENİYOR...' : 'MASAYA OTUR ✨'}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-center">
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}
        </main>

        <footer className="mt-10 text-center">
          <p className="text-white/20 text-[10px] tracking-widest uppercase">helMisa V1.3.2 Stable</p>
        </footer>
      </div>
    </div>
  );
};

export default EntryPage;