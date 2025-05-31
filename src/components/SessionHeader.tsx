// --- file: frontend/src/components/SessionHeader.tsx ---
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-hot-toast';

interface Props {
  sessionId: string;
  sessionName: string;
  isCreator: boolean;
  paused: boolean;
  sessionStarted: boolean;
  activeGame: boolean;
  onPauseToggle: () => void;
}

export default function SessionHeader({ 
  sessionId, 
  sessionName, 
  isCreator, 
  paused, 
  sessionStarted, 
  activeGame,
  onPauseToggle 
}: Props) {
  const navigate = useNavigate();

  const copyInvite = () => {
    navigator.clipboard.writeText(sessionName);
    toast.success(`Invite code copied: ${sessionName}`);
  };

  const startSession = async () => {
    try {
      await api.post(`/sessions/${sessionId}/start`);
      toast.success('Session started!');
    } catch (err: any) {
      const msg = err.response?.data?.error ?? err.message;
      toast.error(`Error starting session: ${msg}`);
    }
  };

  const refreshNow = async () => {
    try {
      await api.post(`/sessions/${sessionId}/refresh`);
      toast.success('Refreshed!');
    } catch (err: any) {
      const msg = err.response?.data?.error ?? err.message;
      toast.error(`Error refreshing: ${msg}`);
    }
  };

  const endSession = async () => {
    try {
      await api.delete(`/sessions/${sessionId}`);
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.error ?? err.message;
      toast.error(`Error ending session: ${msg}`);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-glass-strong backdrop-blur-glass border border-neon-blue/20 rounded-lg">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-2xl font-bold text-neon-silver">
          {sessionName}
        </h1>
        <button 
          onClick={copyInvite} 
          className="btn btn-sm btn-outline btn-glow"
        >
          📋 Copy Code
        </button>
      </div>

      <div className="flex gap-4">
        {!activeGame && (
          <button 
            onClick={startSession} 
            className="btn btn-sm btn-glow border-2 border-neon-green text-neon-green hover:bg-neon-green/20 hover:shadow-lg hover:shadow-neon-green/50"
          >
            🚀 Start Session
          </button>
        )}

        {isCreator && (
          <button 
            onClick={endSession} 
            className="btn btn-sm btn-glow border-2 border-red-500 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:shadow-lg hover:shadow-red-500/50"
          >
            🗑️ End Session
          </button>
        )}

        <button 
          onClick={refreshNow} 
          className="btn btn-sm btn-blue btn-glow"
        >
          🔄 Refresh
        </button>

        <button 
          onClick={onPauseToggle} 
          className={`btn btn-sm btn-glow ${
            paused 
              ? 'border-2 border-neon-green text-neon-green hover:bg-neon-green/20 hover:shadow-lg hover:shadow-neon-green/50' 
              : 'border-2 border-neon-purple text-neon-purple hover:bg-neon-purple/20 hover:shadow-lg hover:shadow-neon-purple/50'
          }`}
        >
          <span>{paused ? '▶️' : '⏸️'}</span>
          <span>{paused ? 'Resume' : 'Pause'}</span>
        </button>
      </div>
    </div>
  );
}
