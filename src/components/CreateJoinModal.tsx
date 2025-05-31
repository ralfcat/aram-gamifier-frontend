// --- file: frontend/src/components/CreateJoinModal.tsx ---
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, UserCircle2, Link2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-hot-toast';
interface Props { mode: 'create' | 'join'; onClose: () => void }

export default function CreateJoinModal({ mode, onClose }: Props) {
  const [name, setName] = useState('');
  const [summoner, setSummoner] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    if (!name.trim() || !summoner.trim()) return;
    setError('');
    setIsLoading(true);
    try {
      localStorage.setItem('summoner', summoner.trim());
      if (mode === 'create') {
        const res = await api.post('/sessions', { name: name.trim(), summoner: summoner.trim() });
        const me = res.data.players.find((p: any) => p.summoner === summoner);
        localStorage.setItem('playerId', me.id)
        await navigator.clipboard.writeText(res.data.name);
        navigate(`/session/${res.data.id}`);
      } else {
        const res = await api.post(`/sessions/${encodeURIComponent(name.trim())}/join`, { summoner: summoner.trim() });
        localStorage.setItem('playerId', res.data.player.id)
        navigate(`/session/${res.data.sessionId}`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error ?? err.message ?? 'Unknown error';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 glass-border"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-300 hover:text-slate-100 transition"
          disabled={isLoading}
        >
          <X />
        </button>
        <h2 className="text-2xl font-bold text-center text-slate-100 mb-6 capitalize">
          {mode === 'create' ? 'Create Session' : 'Join Session'}
        </h2>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">
              {error}
            </div>
          )}
          <div className="flex items-center bg-white/20 rounded-md overflow-hidden">
            <UserCircle2 className="m-2 w-6 h-6 text-slate-300" />
            <input
              type="text"
              placeholder={mode === 'create' ? 'Session Name' : 'Session Name or ID'}
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-transparent p-2 placeholder-slate-400 text-slate-100 focus:outline-none"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center bg-white/20 rounded-md overflow-hidden">
            <Link2 className="m-2 w-6 h-6 text-slate-300" />
            <input
              type="text"
              placeholder="Riot ID (e.g. PlayerName#TAG)"
              value={summoner}
              onChange={e => setSummoner(e.target.value)}
              className="w-full bg-transparent p-2 placeholder-slate-400 text-slate-100 focus:outline-none"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={submit}
            disabled={isLoading || !name.trim() || !summoner.trim()}
            className="w-full py-3 bg-neon-purple text-black font-semibold rounded-md hover:bg-neon-purple/90 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
            {mode === 'create' ? 'Create & Copy Invite' : 'Join'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
