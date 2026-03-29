import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Faction, MP } from '../types';

interface ParliamentViewProps {
  mps: MP[];
  factions: Faction[];
}

export const ParliamentView: React.FC<ParliamentViewProps> = ({ mps, factions }) => {
  // Hemicycle layout calculation
  const seats = useMemo(() => {
    const totalSeats = mps.length || 500;
    const rows = 12;
    const seatsPerRow = Math.ceil(totalSeats / rows);
    const result = [];

    // Sort MPs by faction to group them in the hemicycle
    const sortedMps = [...mps].sort((a, b) => {
      const factionA = factions.find(f => f.id === a.factionId);
      const factionB = factions.find(f => f.id === b.factionId);
      return (factionA?.id || '').localeCompare(factionB?.id || '');
    });

    let mpIndex = 0;
    for (let r = 0; r < rows; r++) {
      const radius = 150 + r * 25;
      const rowSeatCount = Math.floor(seatsPerRow + r * 4);
      const angleStep = Math.PI / (rowSeatCount - 1);

      for (let s = 0; s < rowSeatCount; s++) {
        if (mpIndex >= totalSeats) break;
        
        const angle = Math.PI + s * angleStep;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        result.push({
          x,
          y,
          mp: sortedMps[mpIndex] || { id: mpIndex, factionId: 'independent', loyalty: 50, name: `MP #${mpIndex}` }
        });
        mpIndex++;
      }
    }
    return result;
  }, [mps, factions]);

  const getFactionColor = (factionId: string) => {
    switch (factionId) {
      case 'blue_tide': return '#3b82f6'; // Blue
      case 'iron_wheel': return '#ef4444'; // Red
      case 'future_forward': return '#f59e0b'; // Orange
      default: return '#64748b'; // Slate
    }
  };

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center bg-slate-900/20 rounded-3xl border border-white/5 overflow-hidden">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <h2 className="text-2xl font-serif italic text-slate-400">The National Assembly</h2>
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600">500 Seats • House of Representatives</div>
      </div>

      <div className="relative mt-24">
        {/* Speaker's Podium */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-24 h-12 bg-slate-800 border border-slate-700 rounded-t-lg flex items-center justify-center shadow-2xl">
          <div className="text-[8px] font-mono text-slate-500 uppercase">Speaker</div>
        </div>

        <svg width="800" height="400" viewBox="-400 -350 800 400" className="drop-shadow-2xl">
          {seats.map((seat, i) => (
            <motion.circle
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.001 }}
              cx={seat.x}
              cy={seat.y}
              r="3.5"
              fill={getFactionColor(seat.mp.factionId)}
              className="cursor-pointer hover:r-6 transition-all duration-200"
              style={{ filter: `drop-shadow(0 0 2px ${getFactionColor(seat.mp.factionId)}44)` }}
            >
              <title>{`${seat.mp.name}\nFaction: ${seat.mp.factionId}\nLoyalty: ${seat.mp.loyalty}%`}</title>
            </motion.circle>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 px-6 py-2 bg-slate-950/50 backdrop-blur-md rounded-full border border-white/5">
        {factions.map(f => (
          <div key={f.id} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getFactionColor(f.id) }}></div>
            <span className="text-[9px] font-mono uppercase text-slate-400">{f.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
