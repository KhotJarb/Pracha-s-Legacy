import React, { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { User, Shield, Landmark, Briefcase, Zap, Heart, GraduationCap, Activity } from 'lucide-react';
import { GameState, MP, Politician } from '../types';

interface CabinetTabProps {
  gameState: GameState;
  onAssign: (ministry: string, politicianId: number | null) => void;
}

const MINISTRIES = [
  { id: "Ministry of Finance", icon: Briefcase, color: "text-emerald-500" },
  { id: "Ministry of Defense", icon: Shield, color: "text-slate-500" },
  { id: "Ministry of Transport", icon: Zap, color: "text-blue-500" },
  { id: "Ministry of Environment", icon: Heart, color: "text-green-500" },
  { id: "Ministry of Education", icon: GraduationCap, color: "text-yellow-500" },
  { id: "Ministry of Public Health", icon: Activity, color: "text-red-500" }
];

export const CabinetTab: React.FC<CabinetTabProps> = ({ gameState, onAssign }) => {
  const [selectedMinistry, setSelectedMinistry] = useState<string | null>(null);
  
  // Only show MPs from the player's party or coalition
  const eligiblePoliticians = gameState.mps.filter(mp => 
    mp.factionId === gameState.player?.partyId || 
    gameState.factions.find(f => f.id === mp.factionId)?.isCoalitionMember
  );

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      {/* Ministry List */}
      <div className="col-span-7 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif italic text-white">The Cabinet</h2>
          <div className="text-[10px] font-mono uppercase text-slate-500">Assign Ministers to shape policy</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {MINISTRIES.map((m) => {
            const incumbentId = gameState.cabinet[m.id];
            const incumbent = gameState.mps.find(mp => mp.id === incumbentId);
            
            return (
              <motion.button
                key={m.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMinistry(m.id)}
                className={`p-6 rounded-[2rem] border transition-all text-left space-y-4 ${
                  selectedMinistry === m.id ? 'bg-white/10 border-white' : 'glass-panel border-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <m.icon className={m.color} />
                  {incumbent && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${incumbent.name}`} alt="" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-slate-500">{m.id}</div>
                  <div className="text-lg font-bold text-white truncate">
                    {incumbent ? incumbent.name : "Vacant"}
                  </div>
                </div>
                {incumbent && (
                  <div className="flex gap-2">
                    <div className="px-2 py-1 rounded-md bg-white/5 text-[8px] font-mono text-slate-400">
                      POP: {incumbent.popularity}%
                    </div>
                    <div className="px-2 py-1 rounded-md bg-white/5 text-[8px] font-mono text-slate-400">
                      LOY: {incumbent.partyLoyalty}%
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Politician Selector */}
      <div className="col-span-5 glass-panel rounded-[2.5rem] p-8 border border-white/5 flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-serif italic text-white">
            {selectedMinistry ? `Select Minister for ${selectedMinistry}` : "Select a Ministry"}
          </h3>
          <p className="text-[10px] font-mono uppercase text-slate-500 mt-1">
            Eligible Party & Coalition Members
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {selectedMinistry && (
            <button 
              onClick={() => onAssign(selectedMinistry, null)}
              className="w-full p-4 rounded-2xl border border-dashed border-white/10 text-slate-500 text-xs font-mono uppercase hover:bg-white/5 transition-all"
            >
              Dismiss Current Minister
            </button>
          )}

          {eligiblePoliticians.map((p) => {
            const isAssigned = Object.values(gameState.cabinet).includes(p.id);
            
            return (
              <button
                key={p.id}
                disabled={!selectedMinistry || isAssigned}
                onClick={() => selectedMinistry && onAssign(selectedMinistry, p.id)}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                  isAssigned ? 'opacity-30 grayscale' : 'hover:bg-white/5 border-white/5'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{p.name}</div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <span style={{ color: gameState.factions.find(f => f.id === p.factionId)?.color }}>
                      {gameState.factions.find(f => f.id === p.factionId)?.name}
                    </span>
                    <span>•</span>
                    <span>{p.role}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white">{p.popularity}%</div>
                  <div className="text-[8px] font-mono uppercase text-slate-500">Popularity</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
