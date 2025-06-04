import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Trophy, Target, Skull, Shield, Droplet, Flame, Eye } from 'lucide-react';

interface MatchStats {
  playerId: string;
  matchId: string;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  timestamp: string;
}

interface Bet {
  id: string;
  bettorId: string;
  playerId: string;
  category: string;
  amount: number;
  odds: number;
  resolved: boolean;
  won: boolean;
  matchId: string | null;
}

interface Player {
  id: string;
  name: string;
  balance: number;
  puuid: string;
}

interface MatchStatsPanelProps {
  matchStats: MatchStats[];
  bets: Bet[];
  players: Player[];
  onRefresh: () => void;
  loading: boolean;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'most_kills':
      return <Trophy className="w-4 h-4" />;
    case 'most_damage':
      return <Target className="w-4 h-4" />;
    case 'most_assists':
      return <Shield className="w-4 h-4" />;
    case 'fewest_deaths':
      return <Skull className="w-4 h-4" />;
    case 'most_deaths':
      return <Skull className="w-4 h-4" />;
    case 'fewest_kills':
      return <Target className="w-4 h-4" />;
    case 'first_blood':
      return <Droplet className="w-4 h-4" />;
    case 'most_damage_taken':
      return <Flame className="w-4 h-4" />;
    case 'highest_vision':
      return <Eye className="w-4 h-4" />;
    default:
      return null;
  }
};

export default function MatchStatsPanel({ matchStats, bets, players, onRefresh, loading }: MatchStatsPanelProps) {
  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown Player';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="h-full w-full max-w-md bg-white/5 backdrop-blur-lg rounded-lg p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-100">Match Statistics</h2>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-white/10 rounded-full transition"
          disabled={loading}
        >
          <RefreshCw className={`w-5 h-5 text-slate-200 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Latest Match Stats */}
      {matchStats.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Latest Match</h3>
          <div className="grid grid-cols-2 gap-4">
            {matchStats.map((stat) => (
              <motion.div
                key={`${stat.playerId}-${stat.matchId}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 rounded-lg p-3"
              >
                <p className="text-sm font-medium text-slate-200 mb-2">{getPlayerName(stat.playerId)}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-300">Kills: {stat.kills}</div>
                  <div className="text-slate-300">Deaths: {stat.deaths}</div>
                  <div className="text-slate-300">Assists: {stat.assists}</div>
                  <div className="text-slate-300">Damage: {stat.damage}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Betting Results */}
      {bets.filter(bet => bet.resolved).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Betting Results</h3>
          <div className="space-y-3">
            {bets.filter(bet => bet.resolved).map((bet) => (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg ${bet.won ? 'bg-green-500/20' : 'bg-red-500/20'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getCategoryIcon(bet.category)}
                  <span className="text-sm font-medium text-slate-200">
                    {getPlayerName(bet.bettorId)} bet on {getPlayerName(bet.playerId)}
                  </span>
                </div>
                <div className="text-sm text-slate-300">
                  <p>Category: {bet.category.replace('_', ' ')}</p>
                  <p>Amount: {bet.amount} • Odds: {bet.odds}x</p>
                  <p className={bet.won ? 'text-green-300' : 'text-red-300'}>
                    {bet.won ? `Won ${bet.amount * bet.odds}` : 'Lost'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {matchStats.length === 0 && bets.length === 0 && (
        <div className="text-center text-slate-400 mt-8">
          No match data available yet.
          <br />
          Play a game or click refresh to update.
        </div>
      )}
    </div>
  );
} 