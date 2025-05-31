import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateJoinModal from '../components/CreateJoinModal';

export default function Home() {
  const [mode, setMode] = useState<'create' | 'join' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink mb-4">
          ARAM Gamifier
        </h1>
        <p className="text-slate-400 text-lg">
          Create or join a session to start betting on ARAM matches
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={() => setMode('create')}
          className="px-6 py-3 bg-neon-purple text-black font-semibold rounded-md hover:bg-neon-purple/90 transition"
        >
          Create Session
        </button>
        <button
          onClick={() => setMode('join')}
          className="px-6 py-3 bg-white/10 text-white font-semibold rounded-md hover:bg-white/20 transition"
        >
          Join Session
        </button>
      </motion.div>

      <AnimatePresence>
        {mode && (
          <CreateJoinModal mode={mode} onClose={() => setMode(null)} />
        )}
      </AnimatePresence>
    </div>
  );
} 