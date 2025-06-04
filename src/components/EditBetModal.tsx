// --- file: frontend/src/components/EditBetModal.tsx ---
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Edit3, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';

/* ── local types ───────────────────────────────────── */
interface Bet {
  id: string;
  player:   { id: string; summoner: string };
  category: string;
  amount:   number;
  odds:     number;
}
interface Player {
  id: string;
  summoner: string;
}
interface Props {
  bet:            Bet;                                   // bet to edit
  sessionStarted: boolean;                               // disable edits after start
  players:        Player[];                              // for dropdown
  stats:          Record<string, { history: any[]; averages: any }>; // ← NEW
  onBetUpdated:   () => void;                            // refresh upstream
  onClose:        () => void;
}

/* categories list */
const categories = [
  { value: 'mostKills',    label: 'Most Kills'    },
  { value: 'fewestDeaths', label: 'Fewest Deaths' },
  { value: 'mostAssists',  label: 'Most Assists'  },
  { value: 'mostDamage',   label: 'Most Damage'   },
  // extra betting categories
  { value: 'mostDeaths',   label: 'Most Deaths'   },
  { value: 'fewestKills',  label: 'Fewest Kills'  },
];

/* ── component ─────────────────────────────────────── */
export default function EditBetModal({
  bet, sessionStarted, players, stats, onBetUpdated, onClose
}: Props) {

  /* local state initialised from existing bet */
  const [category, setCategory] = useState(bet.category);
  const [playerId, setPlayerId] = useState(bet.player.id);
  const [amount,   setAmount]   = useState(bet.amount);

  /* (optional) you can read stats here */
  // const playerStats = stats[playerId];

  /* submit handler */
  const handleSubmit = async () => {
    if (sessionStarted) { toast.error('Cannot edit after session started'); return; }
    if (amount <= 0)    { toast.error('Enter a valid amount');             return; }

    try {
      await api.put(`/bets/${bet.id}`, { playerId, category, amount });
      toast.success('Bet updated');
      onBetUpdated();
      onClose();
    } catch (err: any) {
      toast.error(`Update failed: ${err.response?.data?.error ?? err.message}`);
    }
  };

  /* ── UI ──────────────────────────────────────────── */
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: .8, opacity: 0 }}
        animate={{ scale: 1,  opacity: 1 }}
        exit   ={{ scale: .8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 glass-border"
      >
        {/* close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-300 hover:text-slate-100"
        >
          <X />
        </button>

        <h3 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
          <Edit3 className="mr-2" /> Edit Bet
        </h3>

        <div className="space-y-4">
          {/* category */}
          <div>
            <label className="block text-slate-200 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              disabled={sessionStarted}
              className="w-full bg-black/30 text-slate-100 p-2 rounded"
            >
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* player */}
          <div>
            <label className="block text-slate-200 mb-1">Player</label>
            <select
              value={playerId}
              onChange={e => setPlayerId(e.target.value)}
              disabled={sessionStarted}
              className="w-full bg-black/30 text-slate-100 p-2 rounded"
            >
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.summoner}</option>
              ))}
            </select>
          </div>

          {/* amount */}
          <div>
            <label className="block text-slate-200 mb-1">Amount (Victor Bucks)</label>
            <div className="flex items-center bg-black/30 rounded">
              <DollarSign className="m-2 w-5 h-5 text-yellow-300" />
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(parseInt(e.target.value) || 0)}
                disabled={sessionStarted}
                className="w-full bg-transparent p-2 text-slate-100 focus:outline-none"
                min={1} step={1}
              />
            </div>
          </div>

          {/* submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={sessionStarted}
            className="w-full py-2 bg-neon-purple text-black font-semibold rounded-md hover:bg-neon-purple/90 transition disabled:opacity-50"
          >
            Update Bet
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
