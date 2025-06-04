import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign } from 'lucide-react';
import api from '../api';
import { toast } from 'react-hot-toast';

interface Player {
  id: string;
  summoner: string;
}

interface Props {
  sessionId: string;
  players: Player[];
  onClose: () => void;
  onUpdated: () => void;
}

export default function BalanceAdminModal({ sessionId, players, onClose, onUpdated }: Props) {
  const [playerId, setPlayerId] = useState(players[0]?.id ?? '');
  const [amount, setAmount] = useState(0);

  const adjust = async (delta: number) => {
    if (!playerId || amount <= 0) return;
    try {
      await api.post(`/admin/sessions/${sessionId}/currency`, { playerId, amount: delta });
      toast.success('Balance updated');
      onUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update balance');
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="relative w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 glass-border">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-100">
          <X />
        </button>
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Adjust Balance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-slate-200 mb-1">Player</label>
            <select value={playerId} onChange={e => setPlayerId(e.target.value)} className="w-full bg-black/30 text-slate-100 p-2 rounded">
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.summoner}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-200 mb-1">Amount (Victor Bucks)</label>
            <div className="flex items-center bg-black/30 rounded">
              <DollarSign className="m-2 w-5 h-5 text-yellow-300" />
              <input type="number" value={amount} onChange={e => setAmount(parseInt(e.target.value) || 0)} className="w-full bg-transparent p-2 text-slate-100 focus:outline-none" min={1} step={1} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => adjust(amount)} className="flex-1 py-2 bg-green-500/30 hover:bg-green-500/50 text-green-200 rounded-md">Add</button>
            <button onClick={() => adjust(-amount)} className="flex-1 py-2 bg-red-500/30 hover:bg-red-500/50 text-red-200 rounded-md">Remove</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
