// --- file: frontend/src/components/PlayerAnalytics.tsx ---
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, AreaChart, Area
} from 'recharts';

interface RecentStats {
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
}

interface Props {
  playerId: string;
  /** provided by Session as oddsData.stats[playerId] */
  stats: {
    history: RecentStats[];
    averages: RecentStats;
  } | undefined;
}

// Neon color palette
const colors = {
  kills: '#43a6ff',    // neon blue
  deaths: '#a066ff',   // neon purple
  assists: '#50fa7b',  // neon green
  damage: '#d4d7dd',   // neon silver
  kda: '#43a6ff',      // neon blue
  average: '#a066ff'   // neon purple
};

export default function PlayerAnalytics({ playerId, stats }: Props) {
  if (!stats) {
    return (
      <div className="text-center text-gray-400">
        No statistics available for this player.
      </div>
    );
  }

  const { history, averages } = stats;

  // Calculate KDA ratio for each game
  const historyWithKDA = useMemo(() => {
    return history.map((game, index) => ({
      ...game,
      gameIndex: index + 1,
      kda: ((game.kills + game.assists) / Math.max(1, game.deaths)).toFixed(2),
      // Normalize damage for radar chart
      normalizedDamage: game.damage / 10000
    }));
  }, [history]);

  // Prepare data for radar chart
  const radarData = useMemo(() => [{
    kills: averages.kills,
    deaths: averages.deaths,
    assists: averages.assists,
    damage: averages.damage / 10000, // Normalize damage for better visualization
    kda: (averages.kills + averages.assists) / Math.max(1, averages.deaths)
  }], [averages]);

  // Normalize values to 0-10 scale
  const normalizeValue = (value: number, type: string) => {
    // Baseline values for ARAM (what would be considered "average" performance)
    const baselines = {
      kills: { avg: 8, max: 15 },     // avg 8 kills, exceptional at 15
      deaths: { avg: 6, max: 12 },    // avg 6 deaths, bad at 12+
      assists: { avg: 15, max: 30 },  // avg 15 assists, exceptional at 30
      damage: { avg: 30000, max: 60000 }, // avg 30k, exceptional at 60k
      kda: { avg: 2.5, max: 5 }      // avg 2.5 KDA, exceptional at 5
    };

    switch (type) {
      case 'deaths':
        // For deaths, lower is better, so invert the scale
        const deathScore = Math.max(0, 10 - (value / baselines.deaths.avg) * 5);
        return Math.min(10, deathScore);
      case 'damage':
        return Math.min(10, (value / baselines.damage.avg) * 5);
      case 'kda':
        return Math.min(10, (value / baselines.kda.avg) * 5);
      case 'kills':
        return Math.min(10, (value / baselines.kills.avg) * 5);
      case 'assists':
        return Math.min(10, (value / baselines.assists.avg) * 5);
      default:
        return value;
    }
  };

  // Format data for radar chart display
  const radarDisplayData = [
    { 
      name: 'Kills', 
      value: normalizeValue(averages.kills, 'kills'),
      actual: averages.kills.toFixed(1)
    },
    { 
      name: 'Deaths', 
      value: normalizeValue(averages.deaths, 'deaths'),
      actual: averages.deaths.toFixed(1)
    },
    { 
      name: 'Assists', 
      value: normalizeValue(averages.assists, 'assists'),
      actual: averages.assists.toFixed(1)
    },
    { 
      name: 'Damage', 
      value: normalizeValue(averages.damage, 'damage'),
      actual: Math.round(averages.damage).toLocaleString()
    },
    { 
      name: 'KDA', 
      value: normalizeValue((averages.kills + averages.assists) / Math.max(1, averages.deaths), 'kda'),
      actual: ((averages.kills + averages.assists) / Math.max(1, averages.deaths)).toFixed(2)
    }
  ];

  return (
    <div className="h-full grid grid-cols-4 gap-4 p-4">
      {/* Performance Summary Card - Top Row */}
      <div className="col-span-4 bg-glass-strong backdrop-blur-glass border border-neon-blue/20 rounded-lg p-4">
        <h4 className="font-display text-xl font-bold mb-3 text-neon-silver">Performance Summary</h4>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-neon-blue">{averages.kills.toFixed(1)}</div>
            <div className="text-sm text-neon-silver/80">Avg Kills</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-neon-purple">{averages.deaths.toFixed(1)}</div>
            <div className="text-sm text-neon-silver/80">Avg Deaths</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-neon-green">{averages.assists.toFixed(1)}</div>
            <div className="text-sm text-neon-silver/80">Avg Assists</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-neon-blue">
              {((averages.kills + averages.assists) / Math.max(1, averages.deaths)).toFixed(2)}
            </div>
            <div className="text-sm text-neon-silver/80">KDA Ratio</div>
          </div>
        </div>
      </div>

      {/* Performance Radar Chart - Left */}
      <div className="col-span-2 bg-glass-strong backdrop-blur-glass border border-neon-purple/20 rounded-lg p-4">
        <h4 className="font-display text-lg font-semibold mb-2 text-neon-silver">Performance Overview</h4>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart 
            data={radarDisplayData} 
            margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
          >
            <PolarGrid gridType="circle" stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis 
              dataKey="name" 
              stroke="#d4d7dd"
              tick={{ fill: '#d4d7dd', fontSize: 11, fontFamily: 'Chakra Petch' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} axisLine={false} stroke="rgba(255,255,255,0)" />
            <Radar
              name="Performance"
              dataKey="value"
              stroke={colors.average}
              fill={colors.average}
              fillOpacity={0.3}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: '1px solid rgba(160, 102, 255, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                fontFamily: 'Chakra Petch'
              }}
              labelStyle={{ color: '#d4d7dd', fontWeight: 'bold', marginBottom: '4px' }}
              formatter={(value: any, name: any, props: any) => {
                const actual = props.payload.actual;
                return [`${actual} (Score: ${Number(value).toFixed(1)}/10)`, props.payload.name];
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* KDA Trend Chart - Right */}
      <div className="col-span-2 bg-glass-strong backdrop-blur-glass border border-neon-green/20 rounded-lg p-4">
        <h4 className="font-display text-lg font-semibold mb-2 text-neon-silver">KDA Trend</h4>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={historyWithKDA}
            margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
          >
            <defs>
              <linearGradient id="kdaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.kda} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors.kda} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="gameIndex"
              stroke="#d4d7dd"
              tick={{ fill: '#d4d7dd', fontSize: 11, fontFamily: 'Chakra Petch' }}
            />
            <YAxis 
              stroke="#d4d7dd"
              tick={{ fill: '#d4d7dd', fontSize: 11, fontFamily: 'Chakra Petch' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: '1px solid rgba(67, 166, 255, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                fontFamily: 'Chakra Petch'
              }}
              labelStyle={{ color: '#d4d7dd' }}
            />
            <Area 
              type="monotone" 
              dataKey="kda" 
              stroke={colors.kda} 
              fill="url(#kdaGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Match History Chart - Bottom Left */}
      <div className="col-span-2 bg-glass-strong backdrop-blur-glass border border-neon-blue/20 rounded-lg p-4">
        <h4 className="font-display text-lg font-semibold mb-2 text-neon-silver">Match History</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart 
            data={historyWithKDA}
            margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
          >
            <XAxis 
              dataKey="gameIndex" 
              stroke="#d4d7dd"
              tick={{ fill: '#d4d7dd', fontSize: 11, fontFamily: 'Chakra Petch' }}
            />
            <YAxis 
              stroke="#d4d7dd"
              tick={{ fill: '#d4d7dd', fontSize: 11, fontFamily: 'Chakra Petch' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: '1px solid rgba(67, 166, 255, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                fontFamily: 'Chakra Petch'
              }}
              labelStyle={{ color: '#d4d7dd' }}
            />
            <Bar dataKey="kills" fill={colors.kills} name="Kills" />
            <Bar dataKey="deaths" fill={colors.deaths} name="Deaths" />
            <Bar dataKey="assists" fill={colors.assists} name="Assists" />
            <Legend 
              iconType="circle"
              wrapperStyle={{
                fontFamily: 'Chakra Petch',
                fontSize: '11px',
                color: '#d4d7dd'
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Damage Output Chart - Bottom Right */}
      <div className="col-span-2 bg-glass-strong backdrop-blur-glass border border-neon-silver/20 rounded-lg p-4">
        <h4 className="font-display text-lg font-semibold mb-2 text-neon-silver">Damage Output</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart 
            data={historyWithKDA}
            margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
          >
            <XAxis 
              dataKey="gameIndex" 
              stroke="#d4d7dd"
              tick={{ fill: '#d4d7dd', fontSize: 11, fontFamily: 'Chakra Petch' }}
            />
            <YAxis 
              stroke="#d4d7dd"
              tick={{ fill: '#d4d7dd', fontSize: 11, fontFamily: 'Chakra Petch' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: '1px solid rgba(212, 215, 221, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                fontFamily: 'Chakra Petch'
              }}
              labelStyle={{ color: '#d4d7dd' }}
              formatter={(value: any) => [`${Number(value).toLocaleString()} damage`]}
            />
            <Line 
              type="monotone" 
              dataKey="damage" 
              stroke={colors.damage} 
              strokeWidth={2}
              dot={{ fill: colors.damage, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

