import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, RefreshCw, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import api from '../api';
import { toast } from 'react-hot-toast';

interface Session {
  id: string;
  name: string;
  createdAt: string;
  active: boolean;
  createdBy: string;
  _count: {
    players: number;
    bets: number;
  };
}

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [processingSession, setProcessingSession] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/sessions');
      setSessions(res.data);
    } catch (err) {
      toast.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id: string) => {
    try {
      await api.delete(`/admin/sessions/${id}`);
      toast.success('Session deleted');
      fetchSessions();
    } catch (err) {
      toast.error('Failed to delete session');
    }
  };

  const deleteAllSessions = async () => {
    try {
      await api.delete('/admin/sessions');
      toast.success('All sessions deleted');
      fetchSessions();
      setDeleteConfirm(null);
    } catch (err) {
      toast.error('Failed to delete sessions');
    }
  };

  const loadPreviousMatch = async (sessionId: string) => {
    try {
      setProcessingSession(sessionId);
      await api.post(`/admin/sessions/${sessionId}/load-previous-match`);
      toast.success('Previous match loaded successfully');
      fetchSessions();
    } catch (err) {
      toast.error('Failed to load previous match');
    } finally {
      setProcessingSession(null);
    }
  };

  const resolveWithLatest = async (sessionId: string) => {
    try {
      setProcessingSession(sessionId);
      await api.post(`/admin/sessions/${sessionId}/resolve-with-latest`);
      toast.success('Bets resolved with latest match');
      fetchSessions();
    } catch (err) {
      toast.error('Failed to resolve bets');
    } finally {
      setProcessingSession(null);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-full max-w-4xl max-h-[80vh] bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 glass-border overflow-hidden flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-300 hover:text-slate-100 transition"
        >
          <X />
        </button>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Admin Panel</h2>
          <div className="flex gap-2">
            <button
              onClick={fetchSessions}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-200 rounded-md transition flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setDeleteConfirm('all')}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-md transition flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {sessions.map(session => (
            <div
              key={session.id}
              className="p-4 bg-white/5 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">{session.name}</h3>
                  <p className="text-sm text-slate-400">
                    Created by {session.createdBy} • {new Date(session.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-400">
                    {session._count.players} players • {session._count.bets} bets • 
                    {session.active ? (
                      <span className="text-green-400"> Active</span>
                    ) : (
                      <span className="text-red-400"> Inactive</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteConfirm(session.id)}
                  className="p-2 hover:bg-red-500/20 text-red-200 rounded-md transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => loadPreviousMatch(session.id)}
                  disabled={processingSession === session.id}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-md transition flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Load Previous Match
                </button>
                <button
                  onClick={() => resolveWithLatest(session.id)}
                  disabled={processingSession === session.id}
                  className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-md transition flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Resolve with Latest
                </button>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-xl max-w-md w-full mx-4"
              >
                <div className="flex items-center gap-3 text-yellow-300 mb-4">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Confirm Delete</h3>
                </div>
                <p className="text-slate-300 mb-6">
                  {deleteConfirm === 'all'
                    ? 'Are you sure you want to delete all sessions? This action cannot be undone.'
                    : 'Are you sure you want to delete this session? This action cannot be undone.'}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-200 rounded-md transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteConfirm === 'all' ? deleteAllSessions() : deleteSession(deleteConfirm)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-md transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
} 