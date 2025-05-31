// --- file: frontend/src/pages/Landing.tsx ---
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import CreateJoinModal from '../components/CreateJoinModal';
import AdminPanel from '../components/AdminPanel';

export default function Landing() {
  const [open, setOpen] = useState<'create' | 'join' | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminKeyCombo, setAdminKeyCombo] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Update the key combo
      setAdminKeyCombo(prev => {
        const newCombo = (prev + e.key).slice(-5);
        // Check if the combo is 'admin'
        if (newCombo === 'admin') {
          setShowAdmin(true);
          return '';
        }
        return newCombo;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [adminKeyCombo]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center select-none">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
        className="font-display text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green bg-clip-text text-transparent"
      >
        ARAM Gamifier
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3 }} 
        className="mb-8 max-w-xl text-lg text-slate-300"
      >
        Track your ARAM matches in real time. Compete with friends for glory and shiny points.
      </motion.p>
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => setOpen('create')} 
          className="btn btn-lg btn-blue btn-glow"
        >
          🎮 Create Session
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => setOpen('join')} 
          className="btn btn-lg btn-purple btn-glow"
        >
          🤝 Join Session
        </motion.button>
      </div>
      {open && <CreateJoinModal mode={open} onClose={() => setOpen(null)} />}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}