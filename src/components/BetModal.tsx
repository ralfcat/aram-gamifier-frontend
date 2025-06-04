// --- file: frontend/src/components/BetModal.tsx ---
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';

/*─────────────────── local types ───────────────────*/
interface Player {
  id: string;
  summoner: string;
}
interface Props {
  sessionId:   string;
  bettorId:    string;
  players:     Player[];
  odds:        Record<string, Record<string, number>>;
  onBetPlaced: () => void;
  onClose:     () => void;
}

/* betting categories */
const categories = [
  { value: 'mostKills',    label: 'Most Kills'   },
  { value: 'fewestDeaths', label: 'Fewest Deaths'},
  { value: 'mostAssists',  label: 'Most Assists' },
  { value: 'mostDamage',   label: 'Most Damage'  },
];

/*───────────────── component ───────────────────────*/
export default function BetModal({
  sessionId, bettorId, players, odds, onBetPlaced, onClose
}: Props) {

  const [category, setCategory] = useState(categories[0].value);
  const [playerId, setPlayerId] = useState(players[0]?.id ?? '');
  const [amount,   setAmount]   = useState(0);

  /* helper: real odds or fallback */
  const lookupOdds = (cat: string, pid: string) => {
    if (!odds || !odds[cat]) {
      console.warn('No odds data for category:', cat);
      return players.length;
    }
    const playerOdds = odds[cat][pid];
    if (playerOdds === undefined) {
      console.warn('No odds for player:', pid, 'in category:', cat);
      return players.length;
    }
    return playerOdds;
  };

  const displayedOdds = lookupOdds(category, playerId);

  /*──────────── submit ───────────*/
  const submitBet = async () => {
    if (amount <= 0) { toast.error('Enter a valid amount'); return; }

    try {
      await api.post('/bets', {
        sessionId, bettorId, playerId, category, amount, odds: displayedOdds
      });
      toast.success(
        `Bet placed: ${amount} on “${categories.find(c => c.value===category)?.label}”`
      );
      onBetPlaced();
      onClose();
    } catch (err: any) {
      toast.error(`Bet failed: ${err.response?.data?.error ?? err.message}`);
    }
  };

  /*──────────── UI ───────────*/
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

        <h3 className="text-xl font-semibold text-slate-100 mb-4">Place a Bet</h3>

        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-slate-200 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-black/30 text-slate-100 p-2 rounded"
            >
              {categories.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label} (
                  {lookupOdds(c.value, playerId).toFixed(2)}×)
                </option>
              ))}
            </select>
          </div>

          {/* Player */}
          <div>
            <label className="block text-slate-200 mb-1">Player</label>
            <select
              value={playerId}
              onChange={e => setPlayerId(e.target.value)}
              className="w-full bg-black/30 text-slate-100 p-2 rounded"
            >
              {players.map(p => (
                <option key={p.id} value={p.id}>
                  {p.summoner} (
                  {lookupOdds(category, p.id).toFixed(2)}×)
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-slate-200 mb-1">
              Amount (Victor&nbsp;Bucks)
            </label>
            <div className="flex items-center bg-black/30 rounded">
              <DollarSign className="m-2 w-5 h-5 text-yellow-300" />
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-transparent p-2 text-slate-100 focus:outline-none"
                placeholder="0" min={1} step={1}
              />
            </div>
          </div>

          {/* Current odds */}
          <div className="text-slate-200">
            Odds:&nbsp;
            <span className="text-neon-purple">{displayedOdds.toFixed(2)}×</span>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={submitBet}
            className="w-full py-2 bg-neon-purple text-black font-semibold rounded-md hover:bg-neon-purple/90 transition"
          >
            Place Bet
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

