// --- file: frontend/src/pages/Session.tsx ---
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import api from '../api';
import { toast } from 'react-hot-toast';

import SessionHeader     from '../components/SessionHeader';
import PlayerAnalytics   from '../components/PlayerAnalytics';
import BetModal          from '../components/BetModal';
import BetsList          from '../components/BetsList';
import EditBetModal      from '../components/EditBetModal';
import PlayerCard        from '../components/PlayerCard';
import MatchHistory     from '../components/MatchHistory';
import BettingPanel      from '../components/BettingPanel';

/*───────────────────────────────────────────────────────────────────────────*/
/*  Local types                                                             */
/*───────────────────────────────────────────────────────────────────────────*/
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
  bettor:  { id: string; summoner: string };
  player:  { id: string; summoner: string };
  category: string;
  amount:   number;
  odds:     number;
  resolved: boolean;
  won?:     boolean;
}

/*───────────────────────────────────────────────────────────────────────────*/
export default function Session() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* ── Session state ─────────────────────────────────────────────────── */
  const [players,        setPlayers]        = useState<Player[]>([]);
  const [bets,           setBets]           = useState<Bet[]>([]);
  const [sessionName,    setSessionName]    = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [activeGame,     setActiveGame]     = useState(false);
  const [paused,         setPaused]         = useState(false);
  const [isCreator,      setIsCreator]      = useState(false);
  const [loading,        setLoading]        = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [matchHistory,   setMatchHistory]   = useState<{ matches: Record<string, any[]>, bets: Bet[] } | null>(null);

  /* ── UI: modals ─────────────────────────────────────────────────────── */
  const [betOpen,    setBetOpen]    = useState(false);
  const [editingBet, setEditingBet] = useState<Bet | null>(null);
  const [activeTab,  setActiveTab]  = useState<'betting' | 'analytics' | 'history'>('betting');
  const bettorId = localStorage.getItem('playerId')!;

  /* ── Odds & stats cache ─────────────────────────────────────────────── */
  const [oddsData, setOddsData] = useState<{
    odds:  Record<string, Record<string, number>>;
    stats: Record<string, { history: any[]; averages: any }>;
  } | null>(null);

  /* helper to pull match history */
  const fetchMatchHistory = useCallback(async () => {
    if (!id) return;
    try {
      const response = await api.get(`/bets/${id}/history`);
      setMatchHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch match history:', error);
      toast.error('Failed to load match history');
    }
  }, [id]);

  /* helper to pull odds+stats */
  const fetchOddsData = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/odds/${id}`);
      setOddsData(res.data);
    } catch (e) {
      console.error('Failed to load odds+stats:', e);
    }
  }, [id]);

  /* initial odds load */
  useEffect(() => { fetchOddsData(); }, [fetchOddsData]);

  /* ── Join room & live events ────────────────────────────────────────── */
  useEffect(() => {
    if (!id) { navigate('/'); return; }

    /* helper to refresh bets */
    const refreshBets = () =>
      api.get<Bet[]>(`/bets/${id}`).then(r => setBets(r.data));

    /* initial session data */
    (async () => {
      try {
        const s = await api.get(`/sessions/${id}`);
        setSessionName(s.data.name);
        setIsCreator(s.data.createdBy === localStorage.getItem('summoner'));
        setSessionStarted(!!s.data.startedAt);
        setActiveGame(!!s.data.activeGame);
        if (!s.data.startedAt) {
          try {
            await api.post(`/sessions/${id}/start`);
            setSessionStarted(true);
          } catch (e) {
            console.error('Failed to start session automatically:', e);
          }
        }
      } catch {
        toast.error('Session not found'); navigate('/'); return;
      } finally { setLoading(false); }

      const [pl, be] = await Promise.all([
        api.get<Player[]>(`/players/${id}`),
        api.get<Bet[]>(`/bets/${id}`)
      ]);
      setPlayers(pl.data); setBets(be.data);
    })();

    socket.emit('JOIN_ROOM', id);

    socket.on('PLAYER_JOINED', p => {
      setPlayers(ps => [...ps, p]);
      refreshBets();
      fetchOddsData();
    });
    socket.on('LEADERBOARD_UPDATE', l => { if (!paused) setPlayers(l); });
    socket.on('SESSION_DELETED', () => navigate('/'));
    socket.on('SESSION_STARTED', () => { setSessionStarted(true); toast.success('Session has started!'); });
    socket.on('GAME_STARTED', () => { setActiveGame(true); toast.success('Game in progress - betting paused'); });
    socket.on('GAME_ENDED', () => {
      setActiveGame(false);
      toast.success('Game ended - betting resumed');
      fetchMatchHistory();
    });

    socket.on('ODDS_READY', fetchOddsData);
    socket.on('BET_PLACED', refreshBets);

    return () => {
      socket.off('PLAYER_JOINED');
      socket.off('LEADERBOARD_UPDATE');
      socket.off('SESSION_DELETED');
      socket.off('SESSION_STARTED');
      socket.off('GAME_STARTED');
      socket.off('GAME_ENDED');
      socket.off('ODDS_READY');
      socket.off('BET_PLACED');
    };
  }, [id, navigate, paused, fetchOddsData]);

  /* ── open Bet-modal only after odds fetched ─────────────────────────── */
  const openBetModal = () => {
    fetchOddsData().finally(() => {
      if (oddsData?.odds) {  // Only open if we have odds data
        setBetOpen(true);
      } else {
        toast.error('Failed to load betting odds');
      }
    });
  };

  /* ── fetch match history on mount ────────────────────────────────────── */
  useEffect(() => { fetchMatchHistory(); }, [fetchMatchHistory]);

  /* ── Loading screen ─────────────────────────────────────────────────── */
  if (loading) {
    return <div className="h-full flex items-center justify-center text-gray-300">Loading…</div>;
  }

  /* ── UI ─────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex text-white relative">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/snow.gif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full">
        {/* ── Left panel ── */}
        <div className="w-1/3 p-4 flex flex-col bg-glass-strong backdrop-blur-glass border-r border-neon-blue/20">
          {/* Player cards */}
          <div className="space-y-4 mb-4">
            {players.map((p, i) => (
              <PlayerCard
                key={p.id}
                player={p}
                rank={i + 1}
                maxPoints={players[0]?.points || 0}
                onClick={setSelectedPlayer}
              />
            ))}
          </div>

          {/* Active Bets */}
          <div className="flex-1 overflow-y-auto">
          <BetsList
            bets={bets.filter(b => !b.resolved)}
            onEdit={setEditingBet}
              />
            </div>
        </div>

        {/* ── Right panel ── */}
        <div className="w-2/3 p-6 flex flex-col bg-glass-strong backdrop-blur-glass">
          <SessionHeader
            sessionId={id!}
            sessionName={sessionName}
            isCreator={isCreator}
            paused={paused}
            activeGame={activeGame}
            onPauseToggle={() => setPaused(p => !p)}
          />

          <div className="mt-6 flex-1 overflow-y-auto">
            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('betting')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  activeTab === 'betting'
                    ? 'bg-neon-purple/30 text-neon-purple border border-neon-purple/50'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                💰 Betting Overview
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-neon-blue/30 text-neon-blue border border-neon-blue/50'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                📊 Player Analytics
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  activeTab === 'history'
                    ? 'bg-neon-silver/30 text-neon-silver border border-neon-silver/50'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                ⏲ Match History
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'betting' ? (
              <BettingPanel
                players={players}
                bets={bets}
                oddsData={oddsData}
                sessionStarted={activeGame}
                onPlaceBet={() => setBetOpen(true)}
              />
            ) : activeTab === 'analytics' ? (
              selectedPlayer ? (
                <PlayerAnalytics
                  playerId={selectedPlayer}
                  stats={oddsData?.stats[selectedPlayer]}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <p className="text-lg mb-2">👈 Select a player to view their analytics</p>
                  <p className="text-sm opacity-75">Click on any player card from the left panel</p>
                </div>
              )
            ) : (
              matchHistory ? (
                <MatchHistory matches={matchHistory.matches} bets={matchHistory.bets} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <p>No match history yet.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {betOpen && oddsData && (
        <BetModal
          sessionId={id!}
          players={players}
          bettorId={bettorId}
          odds={oddsData.odds}
          onClose={() => setBetOpen(false)}
          onBetPlaced={async () => {
            const [betsRes, playersRes] = await Promise.all([
              api.get<Bet[]>(`/bets/${id}`),
              api.get<Player[]>(`/players/${id}`)
            ]);
            setBets(betsRes.data);
            setPlayers(playersRes.data);
            fetchOddsData();
          }}
        />
      )}

      {editingBet && oddsData && (
        <EditBetModal
          bet={editingBet}
          players={players}
          sessionStarted={sessionStarted}
          stats={oddsData.stats}
          onClose={() => setEditingBet(null)}
          onBetUpdated={() => {
            api.get<Bet[]>(`/bets/${id}`).then(r => setBets(r.data));
            fetchOddsData();
          }}
        />
      )}
    </div>
  );
}

