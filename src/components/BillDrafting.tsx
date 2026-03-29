import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gavel, DollarSign, Users, ShieldAlert, TrendingUp, Landmark } from 'lucide-react';

interface BillDraft {
  title: string;
  sector: 'Maritime' | 'Automotive' | 'Agriculture' | 'Tech';
  budget: number;
  taxRate: number;
}

export const BillDrafting: React.FC<{ onSumbit: (bill: BillDraft) => void }> = ({ onSumbit }) => {
  const [bill, setBill] = useState<BillDraft>({
    title: '',
    sector: 'Maritime',
    budget: 10,
    taxRate: 5,
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#151619] border border-[#2a2b2f] p-6 rounded-xl text-white shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <Gavel className="text-orange-500" />
        <h2 className="text-xl font-bold uppercase tracking-widest font-mono">Legislative Draft: Article 112-B</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs uppercase text-gray-500 mb-2 font-mono">Bill Title</label>
          <input 
            type="text" 
            value={bill.title}
            onChange={(e) => setBill({...bill, title: e.target.value})}
            placeholder="e.g., Strategic Maritime Logistics Act"
            className="w-full bg-black border border-gray-800 p-3 rounded font-mono text-sm focus:border-orange-500 outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-2 font-mono">Target Sector</label>
            <select 
              value={bill.sector}
              onChange={(e) => setBill({...bill, sector: e.target.value as any})}
              className="w-full bg-black border border-gray-800 p-3 rounded font-mono text-sm outline-none"
            >
              <option>Maritime</option>
              <option>Automotive</option>
              <option>Agriculture</option>
              <option>Tech</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-2 font-mono">Budget Allocation (Billion ฿)</label>
            <input 
              type="number" 
              value={bill.budget}
              onChange={(e) => setBill({...bill, budget: Number(e.target.value)})}
              className="w-full bg-black border border-gray-800 p-3 rounded font-mono text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase text-gray-500 mb-2 font-mono">Proposed Sector Tax (%)</label>
          <input 
            type="range" 
            min="0" 
            max="40" 
            value={bill.taxRate}
            onChange={(e) => setBill({...bill, taxRate: Number(e.target.value)})}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-[10px] font-mono mt-1 text-gray-400">
            <span>0% (Lobbyist Dream)</span>
            <span>{bill.taxRate}%</span>
            <span>40% (Populist Rage)</span>
          </div>
        </div>

        <button 
          onClick={() => onSumbit(bill)}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded uppercase tracking-tighter transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Landmark size={18} />
          Submit to Parliament
        </button>
      </div>
    </motion.div>
  );
};
