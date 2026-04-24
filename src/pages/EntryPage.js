import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function EntryPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanLoopRef = useRef(null);
  const detectorRef = useRef(null);

  const [isSupported, setIsSupported] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTable, setSelectedTable] = useState(1);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const supported = "BarcodeDetector" in window;
    setIsSupported(supported);

    if (supported) {
      detectorRef.current = new window.BarcodeDetector({
        formats: ["qr_code"],
      });
    }

    return () => {
      stopScanner();
    };
  }, []);

  const handleLogin = async (qrText) => {
    if (loading) return;
    setLoading(true);
    try {
      const parts = qrText.split('-');
      const tableIndex = parts.indexOf('table');
      if (tableIndex === -1) throw new Error('Geçersiz QR Formatı');

      const cafeId = parts.slice(1, tableIndex).join('-');
      const tableNumber = parseInt(parts[tableIndex + 1]);

      await login(cafeId, tableNumber, null);
      navigate('/profile-setup');
    } catch (err) {
      setError("QR Okunamadı: " + err.message);
      setLoading(false);
    }
  };

  async function startScanner() {
    setError("");
    if (!isSupported) {
      setError("Bu tarayıcı native BarcodeDetector API desteklemiyor.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsScanning(true);
      scanFrame();
    } catch (err) {
      setError("Kamera başlatılamadı.");
    }
  }

  function stopScanner() {
    if (scanLoopRef.current) cancelAnimationFrame(scanLoopRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    setIsScanning(false);
  }

  async function scanFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const detector = detectorRef.current;
    if (!video || !canvas || !detector) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const barcodes = await detector.detect(canvas);
        if (barcodes.length > 0) {
          handleLogin(barcodes[0].rawValue);
          stopScanner();
          return;
        }
      } catch (err) {
        setError("Tarama hatası.");
        stopScanner();
        return;
      }
    }
    scanLoopRef.current = requestAnimationFrame(scanFrame);
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <header className="text-center mb-10">
          <h1 className="text-6xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">helMisa</h1>
          <p className="text-purple-200/70 text-lg uppercase tracking-widest font-light">Giriş Yap</p>
        </header>

        <main className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border border-white/10">
          <div className="overflow-hidden rounded-2xl border border-slate-700 bg-black aspect-square relative">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            {!isScanning && !loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button onClick={startScanner} className="bg-emerald-500 text-slate-950 font-bold py-4 px-8 rounded-2xl active:scale-95 transition-all">KAMERAYI AÇ</button>
              </div>
            )}
            {loading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div></div>}
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-4 mb-4"><div className="h-[1px] flex-1 bg-white/10"></div><span className="text-xs text-white/30 uppercase tracking-widest">Veya Manuel Seç</span><div className="h-[1px] flex-1 bg-white/10"></div></div>
            <select value={selectedTable} onChange={(e) => setSelectedTable(parseInt(e.target.value))} className="w-full bg-white/10 border border-white/20 text-white text-xl font-bold py-4 px-6 rounded-2xl mb-4 appearance-none text-center">
              {[...Array(50)].map((_, i) => (<option key={i + 1} value={i + 1} className="bg-gray-900">Masa {i + 1}</option>))}
            </select>
            <button onClick={() => handleLogin(`helmisa-demo-cafe-001-table-${selectedTable}`)} disabled={loading} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-2xl transition-all">MASAYA OTUR ✨</button>
          </div>

          {error && <div className="mt-6 p-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-center text-red-300 text-sm">{error}</div>}
        </main>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
