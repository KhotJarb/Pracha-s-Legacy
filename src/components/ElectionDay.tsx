import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vote, TrendingUp, Users, Landmark, PieChart, ChevronRight, AlertTriangle } from 'lucide-react';
import { GameState, ElectionResult } from '../types';
import { Faction } from '../types';

interface ElectionDayProps {
  gameState: GameState;
  results: ElectionResult[];
  onComplete: (finalResults: Record<string, number>) => void;
}

export const ElectionDay: React.FC<ElectionDayProps> = ({ gameState, results, onComplete }) => {
  const [currentDistrictIndex, setCurrentDistrictIndex] = useState(0);
  const [liveResults, setLiveResults] = useState<Record<string, number>>({});
  const [isCounting, setIsCounting] = useState(true);
  const [exitPolls, setExitPolls] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initial exit polls (slightly randomized from actual results)
    const polls: Record<string, number> = {};
    results.forEach(r => {
      polls[r.winnerPartyId] = (polls[r.winnerPartyId] || 0) + 1;
    });
    setExitPolls(polls);

    // Counting simulation
    const interval = setInterval(() => {
      if (currentDistrictIndex < results.length) {
        const result = results[currentDistrictIndex];
        setLiveResults(prev => ({
          ...prev,
          [result.winnerPartyId]: (prev[result.winnerPartyId] || 0) + 1
        }));
        setCurrentDistrictIndex(prev => prev + 1);
      } else {
        setIsCounting(false);
        clearInterval(interval);
      }
    }, 50); // Fast count for 400 districts

    return () => clearInterval(interval);
  }, [currentDistrictIndex, results]);

  const totalSeats = results.length;
  const progress = (currentDistrictIndex / totalSeats) * 100;

  return (
    <div className="fixed inset-0 z-[400] bg-slate-950 flex flex-col p-8 space-y-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-orange-600/20 border border-orange-500 text-orange-500">
            <Vote className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-serif italic text-white tracking-tight">Election Night 2026</h1>
            <p className="text-xs font-mono uppercase text-slate-500 tracking-widest mt-1">
              Live Results • {isCounting ? "Counting in Progress" : "Final Projections"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono uppercase text-slate-500 mb-1">Total Seats Counted</div>
          <div className="text-4xl font-bold text-white tabular-nums">{currentDistrictIndex} / {totalSeats}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-orange-500 shadow-lg shadow-orange-900/50"
        />
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Live Seat Count */}
        <div className="col-span-4 glass-panel rounded-[3rem] p-8 border border-white/5 flex flex-col space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif italic text-white">Live Seat Count</h2>
            <PieChart className="text-slate-500 w-5 h-5" />
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {gameState.factions.map((faction) => {
              const seats = liveResults[faction.id] || 0;
              const percentage = (seats / totalSeats) * 100;
              const exitPoll = exitPolls[faction.id] || 0;
              
              return (
                <div key={faction.id} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm font-bold text-white">{faction.name}</div>
                      <div className="text-[10px] font-mono uppercase text-slate-500">
                        Exit Poll: {exitPoll} Seats
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white tabular-nums" style={{ color: faction.color }}>{seats}</div>
                      <div className="text-[8px] font-mono uppercase text-slate-500">Seats Won</div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full"
                      style={{ backgroundColor: faction.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {!isCounting && (
            <button 
              onClick={() => onComplete(liveResults)}
              className="w-full py-5 rounded-2xl bg-white text-slate-950 font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-lg"
            >
              Finalize Results
            </button>
          )}
        </div>

        {/* Live Map / District Feed */}
        <div className="col-span-8 glass-panel rounded-[3rem] p-8 border border-white/5 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif italic text-white">District Feed</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-slate-500">
                <Users className="w-3 h-3" /> Turnout: 78.4%
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-slate-500">
                <TrendingUp className="w-3 h-3" /> Swing: +4.2% Orange
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-10 grid-rows-10 gap-2 p-4 bg-slate-950/50 rounded-[2rem] border border-white/5 overflow-hidden">
            {results.slice(0, 100).map((result, i) => {
              const isCounted = i < currentDistrictIndex;
              const faction = gameState.factions.find(f => f.id === result.winnerPartyId);
              
              return (
                <motion.div 
                  key={result.districtId}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`rounded-md border transition-all ${
                    isCounted ? 'border-white/10' : 'bg-slate-900 border-white/5 opacity-20'
                  }`}
                  style={{ backgroundColor: isCounted ? faction?.color : undefined }}
                />
              );
            })}
          </div>

          <div className="p-6 bg-orange-600/5 border border-orange-500/10 rounded-2xl flex items-center gap-4">
            <AlertTriangle className="text-orange-500 w-6 h-6" />
            <div className="flex-1">
              <div className="text-xs font-bold text-white">Breaking: Major upset in District 42</div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">Future Forward candidate defeats incumbent General Prayut Shinawatra.</div>
            </div>
            <ChevronRight className="text-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
};
