// --- file: frontend/src/components/BetsList.tsx ---
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2 } from 'lucide-react';

interface Bet {
  id: string;
  bettor: { id: string; summoner: string };
  player: { id: string; summoner: string };
  category: string;
  amount: number;
  odds: number;
  resolved: boolean;
  won?: boolean;
  matchId?: string;
}

interface Props {
  bets: Bet[];
  onEdit: (bet: Bet) => void;
}

export default function BetsList({ bets, onEdit }: Props) {
  if (!bets.length) return null;

  return (
    <div className="w-full max-w-md mt-6 bg-glass-strong backdrop-blur-glass border border-neon-purple/20 rounded-lg p-4">
      <h4 className="text-lg font-display font-semibold text-neon-silver mb-4">Active Bets</h4>
      <AnimatePresence>
        {bets.map(b => (
          <motion.div
            key={b.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`flex justify-between items-center bg-black/40 backdrop-blur-sm border rounded-lg p-3 mb-2 hover:bg-black/50 transition-all duration-300 ${
              b.resolved 
                ? b.won 
                  ? 'border-neon-green/30 shadow-sm shadow-neon-green/20' 
                  : 'border-red-500/30 shadow-sm shadow-red-500/20'
                : 'border-neon-blue/10'
            }`}
          >
            <div className="flex flex-col gap-1">
              <div className="text-slate-200">
                <span className="text-neon-purple font-display">{b.bettor.summoner}</span> 
                <span className="text-slate-400 mx-1">→</span> 
                <span className="font-mono text-neon-green">{b.amount}</span> on 
                <span className="text-neon-blue font-display ml-1">{b.player.summoner}</span> 
              </div>
              <div className="text-sm">
                <span className="text-slate-400">for</span> 
                <span className="font-display text-neon-silver ml-1">{b.category}</span>
                {b.resolved && (
                  <span className={`ml-2 ${b.won ? 'text-neon-green' : 'text-red-400'}`}>
                    {b.won ? '✨ Won!' : '❌ Lost'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-mono text-neon-purple font-bold">{b.odds.toFixed(1)}×</div>
              {!b.resolved && (
                <button
                  onClick={() => onEdit(b)}
                  className="text-neon-silver/70 hover:text-neon-silver transition-colors"
                  type="button"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
