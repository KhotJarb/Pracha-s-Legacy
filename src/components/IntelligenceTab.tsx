import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Shield, Search, User, Zap, AlertTriangle, Info, Skull } from 'lucide-react';
import { GameState, IntelligenceOp, MP } from '../types';

interface IntelligenceTabProps {
  gameState: GameState;
  onLaunchOp: (op: Omit<IntelligenceOp, 'id' | 'status'>) => void;
}

const OP_TYPES = [
  { id: 'WIRETAP', icon: Radio, cost: 5, risk: 15, desc: "Monitor communications to gain leverage." },
  { id: 'SMEAR', icon: Zap, cost: 10, risk: 30, desc: "Run a media campaign to lower popularity." },
  { id: 'REVEAL_CORRUPTION', icon: Search, cost: 20, risk: 50, desc: "Expose illegal activities to trigger a scandal." }
];

export const IntelligenceTab: React.FC<IntelligenceTabProps> = ({ gameState, onLaunchOp }) => {
  const [selectedOpType, setSelectedOpType] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
  const selectedTarget = gameState.mps.find(mp => mp.id === selectedTargetId);
  const selectedOp = OP_TYPES.find(o => o.id === selectedOpType);

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      {/* Target List */}
      <div className="col-span-7 space-y-4 overflow-y-auto pr-4 custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif italic text-white">Covert Operations</h2>
          <div className="text-[10px] font-mono uppercase text-slate-500">The Dark Web of Politics</div>
        </div>

        <div className="space-y-3">
          {gameState.mps.filter(mp => mp.factionId !== gameState.player?.partyId).slice(0, 20).map((mp) => (
            <motion.button
              key={mp.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedTargetId(mp.id)}
              className={`w-full p-5 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                selectedTargetId === mp.id ? 'bg-white/10 border-white' : 'glass-panel border-white/5'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mp.name}`} alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{mp.name}</div>
                <div className="text-[10px] font-mono uppercase text-slate-500">
                  {gameState.factions.find(f => f.id === mp.factionId)?.name} • {mp.role}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-white">{mp.popularity}%</div>
                <div className="text-[8px] font-mono uppercase text-slate-500">Popularity</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Op Detail */}
      <div className="col-span-5 glass-panel rounded-[2.5rem] p-8 border border-white/5 flex flex-col">
        <AnimatePresence mode="wait">
          {selectedTarget ? (
            <motion.div 
              key={selectedTarget.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 flex flex-col h-full"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[8px] font-mono uppercase tracking-widest">
                    Target Profile
                  </div>
                  <Skull className="text-slate-600 w-4 h-4" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTarget.name}`} alt="" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif italic text-white leading-tight">{selectedTarget.name}</h3>
                    <p className="text-xs text-slate-500 font-mono uppercase">{selectedTarget.role}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <div className="text-[10px] font-mono uppercase text-slate-500 tracking-widest border-b border-white/5 pb-2">Select Operation Type</div>
                
                <div className="space-y-3">
                  {OP_TYPES.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setSelectedOpType(op.id)}
                      className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                        selectedOpType === op.id ? 'bg-orange-600/20 border-orange-500' : 'bg-white/5 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <op.icon className={selectedOpType === op.id ? 'text-orange-500' : 'text-slate-500'} />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">{op.id.replace('_', ' ')}</div>
                        <div className="text-[10px] text-slate-500">{op.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-white">${op.cost}M</div>
                        <div className="text-[8px] font-mono uppercase text-slate-500">Cost</div>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedOp && (
                  <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-red-500">
                      <AlertTriangle className="w-3 h-3" /> Risk Assessment
                    </div>
                    <div className="text-xs text-slate-400">
                      Exposure Risk: <span className="text-red-500 font-bold">{selectedOp.risk}%</span>
                    </div>
                    <div className="text-[8px] text-slate-600 uppercase font-mono">
                      If exposed, national corruption will increase by 5% and freedom will decrease.
                    </div>
                  </div>
                )}
              </div>

              <button
                disabled={!selectedOpType}
                onClick={() => selectedOp && onLaunchOp({ type: selectedOp.id as any, targetId: selectedTarget.id, cost: selectedOp.cost, risk: selectedOp.risk })}
                className="w-full py-5 rounded-2xl bg-orange-600 text-white font-bold uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50"
              >
                Execute Operation
              </button>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div className="space-y-4">
                <Shield className="w-12 h-12 text-slate-800 mx-auto" />
                <p className="text-xs font-mono uppercase text-slate-600 tracking-widest leading-relaxed">
                  Select a target from the opposition to begin surveillance.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
