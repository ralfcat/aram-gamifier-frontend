// --- file: frontend/src/components/AnalyticsPanel.tsx ---
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Player {
  summoner: string;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
}
interface Props { players: Player[]; }

const neonColors = {
  kills: '#FF00FF',       // neon magenta
  deaths: '#00FFFF',      // neon cyan
  assists: '#ADFF2F',     // neon green
  damage: '#FFD700'       // neon gold
};

export default function AnalyticsPanel({ players }: Props) {
  // Prepare data for recharts: an array of objects
  const data = players.map(p => ({
    name: p.summoner,
    Kills: p.kills,
    Deaths: p.deaths,
    Assists: p.assists,
    Damage: p.damage
  }));

  return (
    <div className="glass p-4 mt-6 w-full max-w-2xl">
      <h2 className="text-xl font-semibold text-slate-100 mb-4">Player Stats Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} itemStyle={{ color: '#fff' }} />
          <Legend wrapperStyle={{ color: '#ccc' }} />
          <Bar dataKey="Kills" fill={neonColors.kills} />
          <Bar dataKey="Deaths" fill={neonColors.deaths} />
          <Bar dataKey="Assists" fill={neonColors.assists} />
          <Bar dataKey="Damage" fill={neonColors.damage} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}