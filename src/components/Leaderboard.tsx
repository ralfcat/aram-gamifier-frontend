import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerCard from './PlayerCard';

interface Player {
  id: string;
  summoner: string;
  points: number;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
}
interface Props {
  players: Player[];
}

const listContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Leaderboard({ players }: Props) {
  const sorted = [...players].sort((a, b) => b.points - a.points);
  const maxPoints = sorted[0]?.points || 0;
  const currentUser = localStorage.getItem('summoner');

  return (
    <motion.div
      layout
      variants={listContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md space-y-2"
    >
      <AnimatePresence>
        {sorted.map((p, i) => (
          <PlayerCard
            key={p.id}
            player={p}
            rank={i + 1}
            maxPoints={maxPoints}
            isCurrentUser={p.summoner === currentUser}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}