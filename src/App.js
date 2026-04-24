import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import EntryPage from './pages/EntryPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import LobbyPage from './pages/LobbyPage';
import ChatPage from './pages/ChatPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Yükleniyor...</div>;
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const ProfileRoute = ({ children }) => {
  const { hasProfile, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Yükleniyor...</div>;
  return hasProfile ? children : <Navigate to="/profile-setup" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EntryPage />} />
      
      <Route path="/profile-setup" element={
        <ProtectedRoute>
          <ProfileSetupPage />
        </ProtectedRoute>
      } />
      
      <Route path="/lobby" element={
        <ProtectedRoute>
          <ProfileRoute>
            <LobbyPage />
          </ProfileRoute>
        </ProtectedRoute>
      } />

      <Route path="/chat/:chatId" element={
        <ProtectedRoute>
          <ProfileRoute>
            <ChatPage />
          </ProfileRoute>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;