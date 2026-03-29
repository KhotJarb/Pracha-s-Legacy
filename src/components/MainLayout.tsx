import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  ShieldAlert, 
  Users, 
  DollarSign, 
  Landmark, 
  Skull, 
  Radio,
  ChevronRight,
  AlertTriangle,
  Gavel,
  Map,
  LayoutDashboard,
  Briefcase,
  PieChart,
  FileText,
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { GameState } from '../types';

interface MainLayoutProps {
  gameState: GameState;
  onNextTurn: () => void;
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  gameState, 
  onNextTurn, 
  children, 
  activeView, 
  setActiveView 
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'parliament', icon: <Landmark size={20} />, label: 'Parliament' },
    { id: 'map', icon: <Map size={20} />, label: 'World Map' },
    { id: 'cabinet', icon: <Briefcase size={20} />, label: 'Cabinet' },
    { id: 'economy', icon: <PieChart size={20} />, label: 'Economy' },
    { id: 'laws', icon: <FileText size={20} />, label: 'Laws' },
    { id: 'intelligence', icon: <Search size={20} />, label: 'Intelligence' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        className="h-full border-r border-white/5 bg-slate-900/50 backdrop-blur-xl flex flex-col z-50"
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          {!isSidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-orange-900/20">P</div>
              <h1 className="font-serif italic text-lg tracking-tight">Pracha's Legacy</h1>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
          >
            {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${
                activeView === item.id 
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-900/40" 
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              <div className={activeView === item.id ? "text-white" : "text-slate-500 group-hover:text-orange-500 transition-colors"}>
                {item.icon}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-sm font-medium tracking-tight">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-100 transition-all">
            <Settings size={20} />
            {!isSidebarCollapsed && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut size={20} />
            {!isSidebarCollapsed && <span className="text-sm font-medium">Exit Game</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar (Status HUD) */}
        <header className="h-16 border-b border-white/5 bg-slate-900/30 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-40">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-orange-600 p-0.5 overflow-hidden bg-slate-800">
                <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-slate-500">
                  <User size={20} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-widest">Prime Minister</span>
                <span className="text-xs font-bold text-slate-100">Pracha S.</span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/5"></div>

            <div className="flex items-center gap-6">
              <HUDStat 
                icon={<DollarSign size={14} className="text-green-400" />} 
                label="Treasury" 
                value={`$${gameState.nation.treasury.toFixed(1)}B`} 
              />
              <HUDStat 
                icon={<TrendingUp size={14} className="text-blue-400" />} 
                label="GDP" 
                value={`$${gameState.nation.gdp.toFixed(1)}B`} 
              />
              <HUDStat 
                icon={<Users size={14} className="text-orange-400" />} 
                label="Approval" 
                value={`${(100 - gameState.nation.streetProtestIntensity).toFixed(0)}%`} 
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-widest">Current Turn</span>
              <span className="text-xs font-bold text-slate-100">Month {gameState.nation.turn}, Year 2026</span>
            </div>
            <button 
              onClick={onNextTurn}
              className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-orange-900/40 transition-all active:scale-95 flex items-center gap-2"
            >
              Next Turn <ChevronRight size={14} />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="grid grid-cols-12 gap-4 h-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="w-full h-full border border-white"></div>
              ))}
            </div>
          </div>

          <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function HUDStat({ icon, label, value }: any) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-slate-500 tracking-wider">
        {icon} {label}
      </div>
      <div className="text-xs font-bold text-slate-100">{value}</div>
    </div>
  );
}
