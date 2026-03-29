import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { 
  X, 
  FileText, 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  Gavel, 
  ChevronRight,
  Landmark,
  DollarSign
} from 'lucide-react';
import { Faction, BillDraft } from '../types';

interface BillDrafterUIProps {
  factions: Faction[];
  onSubmit: (bill: BillDraft) => void;
  onCancel: () => void;
}

export const BillDrafterUI: React.FC<BillDrafterUIProps> = ({ factions, onSubmit, onCancel }) => {
  const [title, setTitle] = useState("New Constitutional Amendment");
  const [sector, setSector] = useState("Infrastructure");
  const [budget, setBudget] = useState(50);
  const [severity, setSeverity] = useState(50);
  const [bribeTotal, setBribeTotal] = useState(0);

  // Mock projection data for the radar chart
  const projectionData = [
    { subject: 'Military', A: 120, B: 110, fullMark: 150 },
    { subject: 'Working Class', A: 98, B: 130, fullMark: 150 },
    { subject: 'Elites', A: 86, B: 130, fullMark: 150 },
    { subject: 'Middle Class', A: 99, B: 100, fullMark: 150 },
    { subject: 'Stability', A: 85, B: 90, fullMark: 150 },
    { subject: 'Corruption', A: 65, B: 85, fullMark: 150 },
  ];

  const handleSubmit = () => {
    onSubmit({
      title,
      sector,
      budget,
      severity,
      bribeTotal
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/50">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-orange-600/20 rounded-lg text-orange-500">
            <Gavel size={20} />
          </div>
          <h1 className="text-xl font-serif italic text-slate-100">Legislative Drafting Office</h1>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"
        >
          <X size={24} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Document View */}
        <div className="flex-1 overflow-y-auto p-12 flex justify-center bg-slate-900/40">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="document-view max-w-2xl w-full h-fit min-h-[800px] relative shadow-2xl"
          >
            {/* Seal */}
            <div className="absolute top-12 right-12 w-24 h-24 border-4 border-slate-900/10 rounded-full flex items-center justify-center opacity-20 rotate-12">
              <div className="text-[10px] font-bold text-center uppercase">National<br/>Assembly<br/>Seal</div>
            </div>

            <div className="text-center mb-16">
              <div className="text-[12px] font-mono uppercase tracking-[0.4em] text-slate-500 mb-4">Draft Legislation</div>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-4xl font-serif italic text-center bg-transparent border-b border-transparent hover:border-slate-200 focus:border-slate-900 outline-none w-full pb-2 transition-all"
              />
            </div>

            <div className="space-y-8 text-slate-800">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-400">Section I: Preamble</h3>
                <p>
                  In accordance with the sovereign will of the people and the mandate of the National Assembly, 
                  this act seeks to address critical issues within the <span className="font-bold underline decoration-orange-500/50">{sector}</span> sector. 
                  The following provisions are proposed to ensure national prosperity and stability.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-400">Section II: Appropriations</h3>
                <p>
                  A total budget of <span className="font-bold underline decoration-green-500/50">${budget} Billion USD</span> shall be allocated 
                  for the implementation of this legislation. These funds are to be sourced from the national treasury 
                  and managed by the respective ministries.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-400">Section III: Regulatory Scope</h3>
                <p>
                  The severity of regulatory changes proposed in this act is rated at <span className="font-bold">{severity}%</span>. 
                  This includes structural reforms, oversight mechanisms, and enforcement protocols designed to 
                  achieve the objectives outlined in the preamble.
                </p>
              </section>

              <div className="pt-24 border-t border-slate-200 mt-24">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="w-48 h-px bg-slate-900/20"></div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">Signature of Proponent</div>
                  </div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Dated: Year 2026, Month 3</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Controls & Projections */}
        <div className="w-[450px] border-l border-white/5 bg-slate-900/80 p-8 flex flex-col gap-8 overflow-y-auto">
          <div className="space-y-6">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Bill Parameters</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[11px] font-mono uppercase text-slate-400">
                <Landmark size={14} /> Policy Sector
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Infrastructure", "Environment", "Military", "Social Welfare", "Taxation"].map(s => (
                  <button 
                    key={s}
                    onClick={() => setSector(s)}
                    className={`p-2 text-[10px] font-mono uppercase rounded border transition-all ${
                      sector === s 
                        ? "bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20" 
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-[11px] font-mono uppercase text-slate-400">
                  <DollarSign size={14} /> Budget Allocation
                </label>
                <span className="text-xs font-mono text-green-400">${budget}B</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-orange-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-[11px] font-mono uppercase text-slate-400">
                  <ShieldAlert size={14} /> Reform Severity
                </label>
                <span className="text-xs font-mono text-orange-400">{severity}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={severity} 
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full accent-orange-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-[11px] font-mono uppercase text-slate-400">
                  <TrendingUp size={14} /> Lobbying Budget
                </label>
                <span className="text-xs font-mono text-blue-400">${bribeTotal}M</span>
              </div>
              <input 
                type="range" 
                min="0" max="500" step="10"
                value={bribeTotal} 
                onChange={(e) => setBribeTotal(Number(e.target.value))}
                className="w-full accent-orange-600"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Impact Projections</h2>
            <div className="h-[250px] w-full bg-slate-950/50 rounded-xl border border-white/5 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={projectionData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 8 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar
                    name="Current"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Projected"
                    dataKey="B"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-[9px] font-mono uppercase">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-slate-500">Current Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-slate-500">Projected Impact</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            className="mt-auto w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl uppercase tracking-[0.2em] shadow-2xl shadow-orange-900/40 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Submit to Parliament <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
