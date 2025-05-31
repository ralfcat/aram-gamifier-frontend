// --- file: frontend/src/components/PlayerCard.tsx ---
import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface Props {
  player: { id: string; summoner: string; points: number; balance: number };
  rank: number;
  maxPoints: number;
  isCurrentUser?: boolean;
  onClick?: (playerId: string) => void;   // NEW
}

export default function PlayerCard({
  player, rank, maxPoints, isCurrentUser, onClick
}: Props) {
  const pct = maxPoints > 0 ? (player.points / maxPoints) : 0;
  const widthPct = `${Math.round(pct * 100)}%`;

  return (
    <motion.div
      onClick={() => onClick?.(player.id)}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`
        relative p-4 rounded-lg cursor-pointer
        bg-glass-strong backdrop-blur-glass border border-neon-silver/10
        ${onClick ? 'hover:bg-glass-light hover:border-neon-purple/30 transition-all duration-300' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="font-display font-bold text-lg text-neon-purple">{rank}</div>
          <User className="w-6 h-6 text-neon-silver/80" />
          <div className="font-display font-semibold text-neon-silver">{player.summoner}</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-neon-green">💰</span>
          <span className="font-mono font-semibold text-neon-green">{player.balance}</span>
        </div>
      </div>
      <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-neon-blue to-neon-purple h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: widthPct }}
        />
      </div>
    </motion.div>
  );
}
