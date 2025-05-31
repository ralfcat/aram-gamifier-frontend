import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import BettingAdviser from './BettingAdviser';

interface Player {
  id: string;
  summoner: string;
  points: number;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  balance: number;
}

interface Bet {
  id: string;
  bettor: { id: string; summoner: string };
  player: { id: string; summoner: string };
  category: string;
  amount: number;
  odds: number;
  resolved: boolean;
  won?: boolean;
}

interface Props {
  players: Player[];
  bets: Bet[];
  oddsData: {
    odds: Record<string, Record<string, number>>;
    stats: Record<string, { history: any[]; averages: any }>;
  } | null;
  sessionStarted: boolean;
  onPlaceBet: () => void;
}

export default function BettingPanel({ players, bets, oddsData, sessionStarted, onPlaceBet }: Props) {
  // Calculate betting statistics
  const totalBets = bets.length;
  const resolvedBets = bets.filter(b => b.resolved).length;
  const winningBets = bets.filter(b => b.resolved && b.won).length;
  const winRate = resolvedBets > 0 ? (winningBets / resolvedBets * 100).toFixed(1) : '0.0';

  // Group bets by category
  const betsByCategory = bets.reduce((acc, bet) => {
    const category = bet.category.replace('_', ' ').toLowerCase();
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col gap-4">
      {/* Place Bet Button */}
      {!sessionStarted && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlaceBet}
          className="btn btn-lg btn-purple btn-glow w-full"
        >
          💰 Place a Bet
        </motion.button>
      )}

      {/* AI Betting Suggestions */}
      <BettingAdviser players={players} oddsData={oddsData} />

      {/* Betting Overview */}
      <div className="bg-glass-strong backdrop-blur-glass border border-neon-purple/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-neon-silver mb-4">Betting Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-sm text-slate-400">Total Bets</div>
            <div className="text-2xl font-mono text-neon-purple">{totalBets}</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-sm text-slate-400">Win Rate</div>
            <div className="text-2xl font-mono text-neon-green">{winRate}%</div>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-glass-strong backdrop-blur-glass border border-neon-purple/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-neon-silver mb-4">Bet Categories</h3>
        <div className="space-y-2">
          {Object.entries(betsByCategory).map(([category, count]) => (
            <div key={category} className="flex justify-between items-center">
              <span className="text-slate-300 capitalize">{category}</span>
              <span className="font-mono text-neon-blue">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Odds */}
      {oddsData && (
        <div className="bg-glass-strong backdrop-blur-glass border border-neon-purple/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-neon-silver mb-4">Current Odds</h3>
          <div className="space-y-4">
            {players.map(player => (
              <div key={player.id} className="bg-black/30 rounded-lg p-3">
                <div className="text-neon-blue font-display mb-2">{player.summoner}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(oddsData.odds).map(([category, playerOdds]) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-slate-400">{category.replace('_', ' ')}:</span>
                      <span className="text-neon-green font-mono">
                        {playerOdds[player.id]?.toFixed(2)}×
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 