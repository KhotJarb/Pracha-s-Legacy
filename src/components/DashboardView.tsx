import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShieldAlert, 
  Users, 
  DollarSign, 
  Landmark, 
  Skull, 
  Radio,
  AlertTriangle,
  Gavel
} from 'lucide-react';
import { GameState } from '../types';

interface DashboardViewProps {
  gameState: GameState;
  setIsDrafting: (val: boolean) => void;
  setIsPropagandaOpen: (val: boolean) => void;
  logs: string[];
  npcLogs: string[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  gameState, 
  setIsDrafting, 
  setIsPropagandaOpen, 
  logs, 
  npcLogs 
}) => {
  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left Column: Stats & Crises */}
      <div className="col-span-4 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            icon={<TrendingUp size={16} />} 
            label="GDP Growth" 
            value={`$${gameState.nation.gdp.toFixed(1)}B`} 
            trend="+2.4%"
            color="text-blue-400"
          />
          <StatCard 
            icon={<DollarSign size={16} />} 
            label="Treasury" 
            value={`$${gameState.nation.treasury.toFixed(1)}B`} 
            color="text-green-400"
          />
          <StatCard 
            icon={<ShieldAlert size={16} />} 
            label="Coup Risk" 
            value={`${gameState.nation.coupMeter.toFixed(1)}%`} 
            color={gameState.nation.coupMeter > 50 ? "text-red-500" : "text-orange-500"}
          />
          <StatCard 
            icon={<Users size={16} />} 
            label="Protests" 
            value={`${gameState.nation.streetProtestIntensity}%`} 
            color={gameState.nation.streetProtestIntensity > 50 ? "text-red-500" : "text-slate-400"}
          />
        </div>

        <div className="glass-panel p-8 rounded-[2rem] space-y-6">
          <h3 className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.4em] flex items-center gap-3">
            <AlertTriangle size={14} className="text-orange-500" /> Active Crises
          </h3>
          <div className="space-y-4">
            {gameState.activeCrises.length === 0 ? (
              <div className="text-xs text-slate-600 italic font-serif">The nation is currently stable.</div>
            ) : (
              gameState.activeCrises.map(crisis => (
                <div key={crisis.id} className="p-4 bg-red-950/10 border border-red-500/10 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-red-400 font-serif italic">{crisis.title}</span>
                    <span className="text-[9px] font-mono text-red-500/40 uppercase">{crisis.duration}T Left</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{crisis.description}</p>
                  <div className="flex gap-3 text-[9px] font-mono uppercase text-red-400/40">
                    {Object.entries(crisis.impact).map(([key, val]) => (
                      <span key={key}>{key}: {val}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2rem] space-y-6">
          <h3 className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.4em] flex items-center gap-3">
            <Landmark size={14} className="text-blue-500" /> Coalition Status
          </h3>
          <div className="space-y-6">
            {gameState.factions.filter(f => f.isCoalitionMember).map(f => (
              <div key={f.id} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200">{f.name}</span>
                    <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{f.cabinetSeats.join(", ") || "No Portfolio"}</span>
                  </div>
                  <span className={`text-[10px] font-mono ${f.coalitionLoyalty < 30 ? "text-red-400" : "text-blue-400"}`}>{f.coalitionLoyalty}% Loyalty</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${f.coalitionLoyalty}%` }}
                    className={`h-full ${f.coalitionLoyalty < 30 ? "bg-red-500" : "bg-blue-500"} shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
                  />
                </div>
              </div>
            ))}
            {gameState.factions.filter(f => f.isCoalitionMember).length === 0 && (
              <div className="text-xs text-red-500 italic font-serif text-center py-4">MINORITY GOVERNMENT / COLLAPSED</div>
            )}
          </div>
        </div>
      </div>

      {/* Center Column: Actions & World */}
      <div className="col-span-5 space-y-8">
        <div className="glass-panel p-8 rounded-[2rem] flex gap-6">
          <ActionButton 
            icon={<Radio size={20} />} 
            label="Propaganda" 
            onClick={() => setIsPropagandaOpen(true)}
          />
          <ActionButton icon={<Skull size={20} />} label="Covert Ops" />
          <button 
            onClick={() => setIsDrafting(true)}
            className="flex-1 bg-orange-600 hover:bg-orange-500 border border-orange-500/20 p-6 rounded-2xl flex flex-col items-center gap-3 transition-all group shadow-2xl shadow-orange-900/20"
          >
            <div className="text-white"><Gavel size={20} /></div>
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-white font-bold">Draft Legislation</span>
          </button>
        </div>

        <div className="glass-panel p-8 rounded-[2rem] h-[600px] flex flex-col">
          <h3 className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.4em] mb-6">National Intelligence Feed</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
            {npcLogs.map((log, i) => (
              <div key={i} className="flex gap-4 text-[11px] font-mono p-3 bg-slate-950/30 rounded-xl border border-white/5">
                <span className="text-slate-700">[{npcLogs.length - i}]</span>
                <span className="text-blue-400/80">{log}</span>
              </div>
            ))}
            {npcLogs.length === 0 && (
              <div className="text-slate-700 italic text-xs font-serif text-center py-20">Monitoring faction activities...</div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Logs & Demographics */}
      <div className="col-span-3 space-y-8">
        <div className="glass-panel p-8 rounded-[2rem] space-y-6">
          <h3 className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.4em] flex items-center gap-3">
            <Users size={14} className="text-slate-400" /> Demographics
          </h3>
          <div className="space-y-6">
            {gameState.demographics.map(d => (
              <div key={d.name} className="space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-medium">{d.name}</span>
                  <span className={d.satisfaction < 40 ? "text-red-400" : "text-green-400"}>{d.satisfaction}%</span>
                </div>
                <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${d.satisfaction}%` }}
                    className={`h-full ${d.satisfaction < 40 ? "bg-red-500" : "bg-green-500"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2rem] h-[500px] flex flex-col">
          <h3 className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.4em] mb-6">Operational Logs</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-4 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 text-[10px] font-mono text-slate-500">
                <span className="text-slate-800">[{logs.length - i}]</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function StatCard({ icon, label, value, trend, color = "text-white" }: any) {
  return (
    <div className="glass-panel p-6 rounded-[2rem] flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[9px] font-mono uppercase text-slate-500 tracking-wider">
        {icon} {label}
      </div>
      <div className="flex items-end justify-between">
        <div className={`text-xl font-bold tracking-tight ${color}`}>{value}</div>
        {trend && <div className="text-[9px] text-green-500 font-mono mb-1">{trend}</div>}
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="flex-1 bg-slate-900/50 hover:bg-slate-800 border border-white/5 p-6 rounded-2xl flex flex-col items-center gap-3 transition-all group shadow-xl"
    >
      <div className="text-slate-500 group-hover:text-orange-500 transition-colors">{icon}</div>
      <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-slate-500 group-hover:text-white font-bold">{label}</span>
    </button>
  );
}
