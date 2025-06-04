import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchStat {
  id: string;
  matchId: string;
  timestamp: string;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  player: {
    id: string;
    summoner: string;
  };
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
  matchId?: string;
}

interface Props {
  matches: Record<string, MatchStat[]>; // Grouped by matchId
  bets: Bet[];
}

export default function MatchHistory({ matches, bets }: Props) {
  // Sort matches by timestamp (newest first)
  const sortedMatchIds = Object.keys(matches).sort((a, b) => {
    const timestampA = new Date(matches[a][0].timestamp).getTime();
    const timestampB = new Date(matches[b][0].timestamp).getTime();
    return timestampB - timestampA;
  });
  const [openMatch, setOpenMatch] = useState<string | null>(null);

  return (
    <div className="w-full space-y-6">
      <h3 className="text-xl font-display font-semibold text-neon-silver">Match History</h3>
      
      <div className="space-y-4">
        {sortedMatchIds.map(matchId => {
          const matchStats = matches[matchId];
          const matchBets = bets.filter(b => b.matchId === matchId);
          const timestamp = new Date(matchStats[0].timestamp).toLocaleString();
          
          // Calculate total winnings/losses for this match
          const totalPayout = matchBets.reduce((sum, bet) => {
            if (bet.won) {
              return sum + (bet.amount * bet.odds);
            } else {
              return sum - bet.amount;
            }
          }, 0);

          return (
            <motion.div
              key={matchId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-glass-strong backdrop-blur-glass border border-neon-purple/20 rounded-lg"
            >
              {/* Match Header */}
              <button
                onClick={() => setOpenMatch(m => (m === matchId ? null : matchId))}
                className="w-full flex justify-between items-center p-4"
              >
                <div>
                  <h4 className="text-lg font-display text-neon-blue">Match {matchId.slice(-8)}</h4>
                  <p className="text-sm text-slate-400">{timestamp}</p>
                </div>
                <div className={`text-lg font-mono font-bold ${totalPayout >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                  {totalPayout >= 0 ? '+' : ''}{totalPayout} VB
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openMatch === matchId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {matchStats.map(stat => (
                        <div key={stat.id} className="bg-black/30 rounded-lg p-3">
                          <div className="text-neon-silver font-display mb-1">{stat.player.summoner}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-slate-300">K/D/A:</div>
                            <div className="text-neon-green font-mono">{stat.kills}/{stat.deaths}/{stat.assists}</div>
                            <div className="text-slate-300">Damage:</div>
                            <div className="text-neon-purple font-mono">{stat.damage.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {matchBets.length > 0 && (
                      <div>
                        <h5 className="text-sm font-display text-slate-300 mb-2">Bets</h5>
                        <div className="space-y-2">
                          {matchBets.map(bet => (
                            <div
                              key={bet.id}
                              className={`flex justify-between items-center p-2 rounded ${
                                bet.won
                                  ? 'bg-neon-green/10 text-neon-green'
                                  : 'bg-red-500/10 text-red-400'
                              }`}
                            >
                              <div>
                                <span className="font-display">{bet.bettor.summoner}</span>
                                <span className="text-slate-400 mx-1">→</span>
                                <span className="font-mono">{bet.amount}</span>
                                <span className="text-slate-400 mx-1">on</span>
                                <span className="font-display">{bet.player.summoner}</span>
                                <span className="text-slate-400 mx-1">for</span>
                                <span>{bet.category}</span>
                              </div>
                              <div className="font-mono">
                                {bet.won
                                  ? `+${(bet.amount * bet.odds).toFixed(0)}`
                                  : `-${bet.amount}`
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

