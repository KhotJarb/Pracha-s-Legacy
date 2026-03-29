import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Landmark, PieChart } from 'lucide-react';
import { GameState, EconomyStats } from '../types';

interface EconomyTabProps {
  gameState: GameState;
  onUpdateEconomy: (economy: EconomyStats) => void;
}

const MOCK_HISTORY = Array.from({ length: 12 }).map((_, i) => ({
  month: `M${i + 1}`,
  gdp: 500 + i * 5 + Math.random() * 10,
  inflation: 2 + Math.random() * 2,
  debt: 120 + i * 2 + Math.random() * 5
}));

export const EconomyTab: React.FC<EconomyTabProps> = ({ gameState, onUpdateEconomy }) => {
  const { economy, nation } = gameState;

  const handleTaxChange = (bracket: keyof EconomyStats['taxBrackets'], value: number) => {
    onUpdateEconomy({
      ...economy,
      taxBrackets: { ...economy.taxBrackets, [bracket]: value }
    });
  };

  const handleBudgetChange = (ministryId: string, value: number) => {
    onUpdateEconomy({
      ...economy,
      budgetAllocation: { ...economy.budgetAllocation, [ministryId]: value }
    });
  };

  return (
    <div className="grid grid-cols-12 gap-8 h-full overflow-y-auto pr-4 custom-scrollbar">
      {/* Macro Stats */}
      <div className="col-span-8 space-y-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif italic text-white">National Economy</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono uppercase">
              <TrendingUp className="w-3 h-3" /> GDP: ${nation.gdp.toFixed(1)}B
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-mono uppercase">
              <TrendingDown className="w-3 h-3" /> Debt: ${economy.nationalDebt.toFixed(1)}B
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-slate-500">GDP Growth (12M)</h3>
              <DollarSign className="text-emerald-500 w-4 h-4" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_HISTORY}>
                  <defs>
                    <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="gdp" stroke="#10b981" fillOpacity={1} fill="url(#colorGdp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-slate-500">Inflation Rate (%)</h3>
              <Percent className="text-orange-500 w-4 h-4" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_HISTORY}>
                  <Line type="monotone" dataKey="inflation" stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Budget Allocation */}
        <div className="glass-panel p-8 rounded-[2rem] border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif italic text-white">National Budget Allocation</h3>
            <PieChart className="text-slate-500 w-5 h-5" />
          </div>
          <div className="space-y-6">
            {Object.entries(economy.budgetAllocation).map(([id, value]) => (
              <div key={id} className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono uppercase text-slate-500">
                  <span>{id}</span>
                  <span className="text-white font-bold">{value}%</span>
                </div>
                <input 
                  type="range" min="0" max="40" value={value} 
                  onChange={(e) => handleBudgetChange(id, Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-full accent-orange-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tax Brackets & Debt */}
      <div className="col-span-4 space-y-8">
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-8">
          <div className="flex items-center gap-3">
            <Landmark className="text-orange-500" />
            <h3 className="text-lg font-serif italic text-white">Taxation Policy</h3>
          </div>
          
          <div className="space-y-8">
            {[
              { id: 'low', label: 'Low Income (<$30k)', color: 'bg-emerald-500' },
              { id: 'mid', label: 'Middle Income ($30k-$100k)', color: 'bg-blue-500' },
              { id: 'high', label: 'High Income (>$100k)', color: 'bg-red-500' }
            ].map((bracket) => (
              <div key={bracket.id} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="text-[10px] font-mono uppercase text-slate-500">{bracket.label}</div>
                  <div className="text-xl font-bold text-white">{economy.taxBrackets[bracket.id as keyof EconomyStats['taxBrackets']]}%</div>
                </div>
                <input 
                  type="range" min="0" max="60" 
                  value={economy.taxBrackets[bracket.id as keyof EconomyStats['taxBrackets']]} 
                  onChange={(e) => handleTaxChange(bracket.id as any, Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-full accent-white cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 space-y-4">
            <div className="text-[10px] font-mono uppercase text-slate-500">Treasury Reserve</div>
            <div className="text-3xl font-bold text-white">${nation.treasury.toFixed(1)}B</div>
            <div className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">
              Projected Surplus: +$1.2B / Turn
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
