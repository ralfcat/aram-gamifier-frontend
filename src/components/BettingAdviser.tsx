import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

interface Props {
  players: Player[];
  oddsData: {
    stats: Record<string, { 
      history: Array<{
        kills: number;
        deaths: number;
        assists: number;
        damage: number;
      }>;
      averages: {
        kills: number;
        deaths: number;
        assists: number;
        damage: number;
      };
    }>;
  } | null;
}

export default function BettingAdviser({ players, oddsData }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateSuggestions = async () => {
      if (!oddsData?.stats) return;
      setLoading(true);

      try {
        // For each player, analyze their performance trends
        const newSuggestions: string[] = [];
        
        players.forEach(player => {
          const stats = oddsData.stats[player.id];
          if (!stats) return;

          const { history, averages } = stats;
          
          // Calculate trends
          const recentKills = history.slice(-3).reduce((sum, match) => sum + match.kills, 0) / 3;
          const recentDeaths = history.slice(-3).reduce((sum, match) => sum + match.deaths, 0) / 3;
          const recentAssists = history.slice(-3).reduce((sum, match) => sum + match.assists, 0) / 3;
          const recentDamage = history.slice(-3).reduce((sum, match) => sum + match.damage, 0) / 3;

          // Compare recent performance to averages
          const playerSuggestions: string[] = [];

          if (recentKills > averages.kills * 1.1) {
            playerSuggestions.push(`${player.summoner} has been performing exceptionally well in kills lately, averaging ${recentKills.toFixed(1)} kills in their last 3 games (vs ${averages.kills.toFixed(1)} overall average). They could be a strong bet for most kills.`);
          }

          if (recentDeaths < averages.deaths * 0.9) {
            playerSuggestions.push(`${player.summoner} has shown improved survivability, with only ${recentDeaths.toFixed(1)} deaths on average in recent games (vs ${averages.deaths.toFixed(1)} overall). Consider betting on them for fewest deaths.`);
          }

          if (recentAssists > averages.assists * 1.1) {
            playerSuggestions.push(`${player.summoner} has been more team-oriented lately with ${recentAssists.toFixed(1)} assists per game (vs ${averages.assists.toFixed(1)} average). They might be a good pick for most assists.`);
          }

          if (recentDamage > averages.damage * 1.1) {
            playerSuggestions.push(`${player.summoner}'s damage output has increased to ${Math.round(recentDamage)} (vs ${Math.round(averages.damage)} average). They could be worth betting on for most damage.`);
          }

          if (playerSuggestions.length > 0) {
            newSuggestions.push(playerSuggestions[Math.floor(Math.random() * playerSuggestions.length)]);
          }
        });

        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error generating suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    generateSuggestions();
  }, [players, oddsData]);

  if (!oddsData?.stats || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-glass-strong backdrop-blur-glass border border-neon-purple/20 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-neon-silver mb-4 flex items-center gap-2">
        🤖 AI Betting Suggestions
      </h3>
      <div className="space-y-3">
        {loading ? (
          <div className="text-slate-400 animate-pulse">Analyzing player performance...</div>
        ) : (
          suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/30 p-3 rounded-lg text-slate-300"
            >
              {suggestion}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 