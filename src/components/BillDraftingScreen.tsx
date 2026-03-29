import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Gavel, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  ShieldCheck,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BillDraft, Faction } from '../types';

interface Props {
  factions: Faction[];
  onSubmit: (bill: BillDraft) => void;
  onCancel: () => void;
}

export const BillDraftingScreen: React.FC<Props> = ({ factions, onSubmit, onCancel }) => {
  const [bill, setBill] = useState<BillDraft>({
    title: '',
    sector: 'Infrastructure',
    budget: 20,
    severity: 50,
    bribeTotal: 0,
  });

  const sectors = ['Infrastructure', 'Environment', 'Taxation', 'Social Welfare', 'Military'];

  // Real-time prediction logic
  const predictions = useMemo(() => {
    return factions.map(faction => {
      // Formula: (Sector Focus * Severity) + (Budget Impact)
      const focus = faction.ideologyFocus[bill.sector] || 0;
      const severityImpact = focus * (bill.severity / 50);
      const budgetBonus = bill.budget > 50 ? 0.1 : -0.05;
      
      const score = (severityImpact + budgetBonus) * 100;
      return {
        name: faction.name,
        approval: Math.max(-100, Math.min(100, score)),
      };
    });
  }, [bill, factions]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0b]/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#151619] border border-white/10 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden grid grid-cols-12"
      >
        {/* Left: Drafting Controls */}
        <div className="col-span-12 lg:col-span-7 p-8 border-r border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                <Gavel size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight uppercase italic">Legislative Drafter</h2>
            </div>
            <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
              Cancel
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-500 mb-2 tracking-widest">Bill Nomenclature</label>
              <input 
                type="text" 
                value={bill.title}
                onChange={(e) => setBill({...bill, title: e.target.value})}
                placeholder="e.g., National Logistics & Port Expansion Act"
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl font-mono text-sm focus:border-orange-500/50 outline-none transition-all"
              />
            </div>

            {/* Sector Selection */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-500 mb-3 tracking-widest">Target Sector</label>
              <div className="flex flex-wrap gap-2">
                {sectors.map(s => (
                  <button
                    key={s}
                    onClick={() => setBill({...bill, sector: s})}
                    className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${
                      bill.sector === s 
                        ? 'bg-white text-black border-white' 
                        : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest flex items-center gap-2">
                    <DollarSign size={12} /> Budget Allocation
                  </label>
                  <span className="text-xs font-bold text-orange-500">{bill.budget}B ฿</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={bill.budget}
                  onChange={(e) => setBill({...bill, budget: Number(e.target.value)})}
                  className="w-full accent-orange-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest flex items-center gap-2">
                    <TrendingUp size={12} /> Severity / Impact
                  </label>
                  <span className="text-xs font-bold text-blue-500">{bill.severity}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="100" 
                  value={bill.severity}
                  onChange={(e) => setBill({...bill, severity: Number(e.target.value)})}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            {/* Lobbying / Bribes */}
            <div className="p-6 bg-black/30 border border-white/5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                  <ShieldCheck size={14} /> "Lobbying" Fund (Bribes)
                </div>
                <span className="text-xs font-mono text-gray-400">Available: ฿850M</span>
              </div>
              <input 
                type="range" 
                min="0" max="500" 
                value={bill.bribeTotal}
                onChange={(e) => setBill({...bill, bribeTotal: Number(e.target.value)})}
                className="w-full accent-red-500"
              />
              <p className="text-[10px] text-gray-500 italic">
                Spending money increases the chance of "Cobra" defectors but raises corruption risk.
              </p>
            </div>
          </div>

          <button 
            onClick={() => onSubmit(bill)}
            disabled={!bill.title}
            className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-tighter text-lg hover:bg-orange-500 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit to Parliament
          </button>
        </div>

        {/* Right: Real-time Analysis */}
        <div className="col-span-12 lg:col-span-5 bg-black/20 p-8 flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-gray-500 mb-8 tracking-widest">
            <Target size={14} /> Predicted Factional Response
          </div>

          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictions} layout="vertical" margin={{ left: 20, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" domain={[-100, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#151619', border: '1px solid #ffffff10', borderRadius: '8px' }}
                />
                <Bar dataKey="approval" radius={[0, 4, 4, 0]}>
                  {predictions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.approval >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
            <div className="flex gap-3">
              <Info className="text-orange-500 shrink-0" size={16} />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-orange-200">Political Intelligence</h4>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  {bill.severity > 70 
                    ? "High severity bills are likely to trigger mass protests if they target sensitive sectors like Environment." 
                    : "Low impact bills are easier to pass but provide minimal long-term benefits."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
