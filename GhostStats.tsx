
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StatsData } from '../types';

interface GhostStatsProps {
  data: StatsData[];
}

const GhostStats: React.FC<GhostStatsProps> = ({ data }) => {
  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur-sm">
      <h3 className="mb-6 mono text-xs uppercase tracking-[0.2em] text-stone-500">Burial Distribution</h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="category" 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
              contentStyle={{ backgroundColor: '#1c1c21', border: '1px solid #3f3f46', borderRadius: '8px' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-center text-[10px] italic text-stone-600">Total Unfulfilled Dreams: {data.reduce((a, b) => a + b.count, 0)}</p>
    </div>
  );
};

export default GhostStats;
