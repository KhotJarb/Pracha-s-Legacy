import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, CheckCircle, XCircle, ChevronRight, Info, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { GameState, Law } from '../types';

interface LawsTabProps {
  gameState: GameState;
  onToggleLaw: (lawId: string) => void;
}

export const LawsTab: React.FC<LawsTabProps> = ({ gameState, onToggleLaw }) => {
  const [selectedLawId, setSelectedLawId] = useState<string | null>(null);
  const selectedLaw = gameState.laws.find(l => l.id === selectedLawId);

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      {/* Law List */}
      <div className="col-span-7 space-y-4 overflow-y-auto pr-4 custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif italic text-white">The Constitution & Active Laws</h2>
          <div className="text-[10px] font-mono uppercase text-slate-500">Current Legal Framework</div>
        </div>

        <div className="space-y-3">
          {gameState.laws.map((law) => (
            <motion.button
              key={law.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedLawId(law.id)}
              className={`w-full p-5 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                selectedLawId === law.id ? 'bg-white/10 border-white' : 'glass-panel border-white/5'
              }`}
            >
              <div className={`p-3 rounded-xl ${law.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{law.title}</div>
                <div className="text-[10px] font-mono uppercase text-slate-500">
                  {law.isActive ? "Active" : "Suspended"}
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-all ${selectedLawId === law.id ? 'text-white' : 'text-slate-600'}`} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Law Detail */}
      <div className="col-span-5 glass-panel rounded-[2.5rem] p-8 border border-white/5 flex flex-col">
        <AnimatePresence mode="wait">
          {selectedLaw ? (
            <motion.div 
              key={selectedLaw.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 flex flex-col h-full"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full text-[8px] font-mono uppercase tracking-widest ${
                    selectedLaw.isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {selectedLaw.isActive ? "Active Statute" : "Suspended Statute"}
                  </div>
                  <Info className="text-slate-600 w-4 h-4" />
                </div>
                <h3 className="text-2xl font-serif italic text-white leading-tight">{selectedLaw.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-serif italic">
                  "{selectedLaw.description}"
                </p>
              </div>

              <div className="space-y-6 flex-1">
                <div className="text-[10px] font-mono uppercase text-slate-500 tracking-widest border-b border-white/5 pb-2">Mathematical Effects</div>
                
                <div className="grid grid-cols-2 gap-4">
                  {selectedLaw.effects.gdp && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <div className="flex items-center gap-2 text-[8px] font-mono uppercase text-slate-500">
                        <TrendingUp className="w-3 h-3 text-emerald-500" /> GDP Impact
                      </div>
                      <div className="text-lg font-bold text-white">+{selectedLaw.effects.gdp}%</div>
                    </div>
                  )}
                  {selectedLaw.effects.stability && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <div className="flex items-center gap-2 text-[8px] font-mono uppercase text-slate-500">
                        <CheckCircle className="w-3 h-3 text-blue-500" /> Stability
                      </div>
                      <div className="text-lg font-bold text-white">+{selectedLaw.effects.stability}%</div>
                    </div>
                  )}
                </div>

                {selectedLaw.effects.satisfaction && (
                  <div className="space-y-3">
                    <div className="text-[10px] font-mono uppercase text-slate-500 tracking-widest">Demographic Impact</div>
                    <div className="space-y-2">
                      {Object.entries(selectedLaw.effects.satisfaction).map(([demo, impact]) => (
                        <div key={demo} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-2 text-xs text-slate-300">
                            <Users className="w-3 h-3 text-slate-500" /> {demo}
                          </div>
                          <div className={`text-xs font-bold ${impact > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {impact > 0 ? '+' : ''}{impact}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => onToggleLaw(selectedLaw.id)}
                className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg ${
                  selectedLaw.isActive 
                    ? 'bg-red-600 text-white hover:bg-red-500 shadow-red-900/20' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/20'
                }`}
              >
                {selectedLaw.isActive ? "Suspend Law" : "Enact Law"}
              </button>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div className="space-y-4">
                <FileText className="w-12 h-12 text-slate-800 mx-auto" />
                <p className="text-xs font-mono uppercase text-slate-600 tracking-widest leading-relaxed">
                  Select a statute from the archives to review its constitutional impact.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
