// frontend/src/App.tsx
import React from 'react';
import { Toaster } from 'react-hot-toast';
import BackgroundMusic from './components/BackgroundMusic';
import SnowBackground from './components/SnowBackground';
import Landing from './pages/Landing';
import Session from './pages/Session';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PasswordProtection from './components/PasswordProtection';

export default function App() {
  return (
    <PasswordProtection>
      <BackgroundMusic />
      <SnowBackground />

      {/* Toast container (position top-right by default) */}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          style: {
            background: 'rgba(255,255,255,0.1)',
            color: '#E0E0E0',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '0.75rem',
            padding: '1rem',
            fontFamily: 'Orbitron, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#0f0',
              secondary: '#111',
            },
          },
          error: {
            iconTheme: {
              primary: '#f00',
              secondary: '#111',
            },
          },
        }}
      />

      <div className="relative z-10 min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/session/:id" element={<Session />} />
          </Routes>
        </BrowserRouter>
      </div>
    </PasswordProtection>
  );
}
