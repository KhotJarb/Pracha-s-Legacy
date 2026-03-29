import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  Radio
} from 'lucide-react';
import { GameState, BillDraft } from './types';
import { MainLayout } from './components/MainLayout';
import { DashboardView } from './components/DashboardView';
import { ParliamentView } from './components/ParliamentView';
import { BillDrafterUI } from './components/BillDrafterUI';
import { CrisisModal } from './components/CrisisModal';
import { Onboarding } from './components/Onboarding';
import { CabinetTab } from './components/CabinetTab';
import { EconomyTab } from './components/EconomyTab';
import { LawsTab } from './components/LawsTab';
import { IntelligenceTab } from './components/IntelligenceTab';
import { Timeline } from './components/Timeline';
import { ElectionDay } from './components/ElectionDay';

const INITIAL_STATE: GameState = {
  nation: {
    name: "Thailand",
    gdp: 505.2,
    inflation: 2.1,
    stability: 65,
    corruption: 42,
    freedom: 38,
    treasury: 45.5,
    coupMeter: 12,
    turn: 1,
    establishmentApproval: 75,
    environmentalHealth: 80,
    militaryBudget: 8.2,
    streetProtestIntensity: 15,
  },
  parliament: {
    house: { total: 500, coalition: 260, opposition: 240 },
    senate: { total: 250, establishmentLoyalty: 0.95, militaryAlignment: 0.9 },
  },
  factions: [
    { 
      id: "blue_tide", 
      name: "The Blue Tide", 
      color: "#3b82f6",
      leaderId: 1, 
      whipStrength: 0.85, 
      ideologyFocus: { "Environment": 0.9, "Infrastructure": -0.4 },
      coalitionLoyalty: 80,
      isCoalitionMember: true,
      cabinetSeats: ["Ministry of Environment"],
      traits: { ambition: 40, greed: 30, charisma: 75 }
    },
    { 
      id: "iron_wheel", 
      name: "The Iron Wheel", 
      color: "#ef4444",
      leaderId: 2, 
      whipStrength: 0.92, 
      ideologyFocus: { "Infrastructure": 0.9, "Environment": -0.8 },
      coalitionLoyalty: 60,
      isCoalitionMember: true,
      cabinetSeats: ["Ministry of Transport"],
      traits: { ambition: 70, greed: 80, charisma: 60 }
    },
    { 
      id: "future_forward", 
      name: "Future Forward", 
      color: "#f97316",
      leaderId: 3, 
      whipStrength: 0.70, 
      ideologyFocus: { "Social Welfare": 0.9, "Taxation": 0.6 },
      coalitionLoyalty: 0,
      isCoalitionMember: false,
      cabinetSeats: [],
      traits: { ambition: 90, greed: 20, charisma: 85 }
    },
  ],
  mps: [],
  demographics: [
    { name: "Military", satisfaction: 85, power: 1.5 },
    { name: "Working Class", satisfaction: 40, power: 0.8 },
    { name: "Elites", satisfaction: 90, power: 2.0 },
    { name: "Middle Class", satisfaction: 55, power: 1.0 },
  ],
  activeCrises: [],
  cabinet: {
    "Ministry of Environment": 1,
    "Ministry of Transport": 2,
    "Ministry of Finance": null,
    "Ministry of Defense": null,
    "Ministry of Public Health": null,
    "Ministry of Education": null
  },
  player: null,
  economy: {
    nationalDebt: 120.5,
    taxBrackets: { low: 10, mid: 20, high: 35 },
    budgetAllocation: {
      "Ministry of Finance": 15,
      "Ministry of Defense": 20,
      "Ministry of Transport": 10,
      "Ministry of Environment": 5,
      "Ministry of Education": 15,
      "Ministry of Public Health": 10
    }
  },
  laws: [],
  intelligenceOps: [],
  timeline: [],
  election: {
    isElectionDay: false,
    phase: 'NOMINATION',
    districts: [],
    results: []
  }
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [event, setEvent] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>(["Game Started: Year 2026, Month 1"]);
  const [npcLogs, setNpcLogs] = useState<string[]>([]);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isPropagandaOpen, setIsPropagandaOpen] = useState(false);
  const [targetMpId, setTargetMpId] = useState<number | null>(null);
  const [smearBudget, setSmearBudget] = useState(10);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    fetch('/api/game/state').then(res => res.json()).then(data => setGameState(data));
  }, []);

  const nextTurn = async () => {
    try {
      const res = await fetch('/api/game/next-turn', { method: 'POST' });
      const data = await res.json();
      setGameState(data.gameState);
      
      if (data.event) {
        setEvent(data.event);
        setLogs(prev => [`EVENT: ${data.event.title}`, ...prev]);
      }
      
      if (data.npcActions) {
        data.npcActions.forEach((item: any) => {
          setNpcLogs(prev => [`${item.factionId}: ${item.action.type}`, ...prev]);
        });
      }

      if (data.loyaltyReports) {
        data.loyaltyReports.forEach((report: any) => {
          if (report.change !== 0) {
            setLogs(prev => [`LOYALTY: ${report.factionId} ${report.change > 0 ? '+' : ''}${report.change} (${report.reason})`, ...prev]);
          }
        });
      }

      if (data.noConfidenceTriggered) {
        setLogs(prev => [`CRISIS: VOTE OF NO CONFIDENCE! The government has collapsed.`, ...prev]);
      }

      setLogs(prev => [`Turn ${data.gameState.nation.turn} completed.`, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const launchSmear = async () => {
    if (targetMpId === null) return;
    try {
      const res = await fetch('/api/game/smear-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initiatorId: 0, targetId: targetMpId, budget: smearBudget })
      });
      const data = await res.json();
      setGameState(data.gameState);
      setIsPropagandaOpen(false);
      setLogs(prev => [`SMEAR CAMPAIGN: ${data.result.success ? 'SUCCESS' : 'FAILED'}`, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const submitDraftedBill = async (bill: BillDraft) => {
    setIsDrafting(false);
    try {
      const res = await fetch('/api/game/resolve-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bill })
      });
      const data = await res.json();
      setGameState(data.gameState);
      setLogs(prev => [`VOTE: ${bill.title} ${data.result.passed ? 'PASSED' : 'REJECTED'}`, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const renderView = () => {
    if (!gameState.player) {
      return (
        <Onboarding 
          onComplete={(player, customFaction) => {
            fetch('/api/game/start', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ player, customFaction })
            }).then(res => res.json()).then(data => setGameState(data));
          }} 
        />
      );
    }

    if (gameState.election.isElectionDay) {
      return (
        <ElectionDay 
          gameState={gameState} 
          results={gameState.election.results}
          onComplete={() => {
            fetch('/api/game/state').then(res => res.json()).then(data => setGameState(data));
          }} 
        />
      );
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView 
            gameState={gameState} 
            setIsDrafting={setIsDrafting} 
            setIsPropagandaOpen={setIsPropagandaOpen}
            logs={logs}
            npcLogs={npcLogs}
          />
        );
      case 'parliament':
        return <ParliamentView mps={gameState.mps} factions={gameState.factions} />;
      case 'cabinet':
        return (
          <CabinetTab 
            gameState={gameState} 
            onAssign={(ministry, politicianId) => {
              fetch('/api/game/assign-cabinet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ministry, politicianId })
              }).then(res => res.json()).then(data => setGameState(data));
            }} 
          />
        );
      case 'economy':
        return (
          <EconomyTab 
            gameState={gameState} 
            onUpdateEconomy={(economy) => {
              fetch('/api/game/update-economy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ economy })
              }).then(res => res.json()).then(data => setGameState(data));
            }} 
          />
        );
      case 'laws':
        return (
          <LawsTab 
            gameState={gameState} 
            onToggleLaw={(lawId) => {
              fetch('/api/game/toggle-law', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lawId })
              }).then(res => res.json()).then(data => setGameState(data));
            }} 
          />
        );
      case 'intelligence':
        return (
          <IntelligenceTab 
            gameState={gameState} 
            onLaunchOp={(op) => {
              fetch('/api/game/launch-op', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ op })
              }).then(res => res.json()).then(data => setGameState(data));
            }} 
          />
        );
      case 'timeline':
        return <Timeline events={gameState.timeline} currentTurn={gameState.nation.turn} />;
      default:
        return (
          <div className="flex items-center justify-center h-[600px] glass-panel rounded-[2rem]">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif italic text-slate-500">Under Construction</h2>
              <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">Bureaucratic delays in progress...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <MainLayout 
      gameState={gameState} 
      onNextTurn={nextTurn} 
      activeView={activeView} 
      setActiveView={setActiveView}
    >
      {renderView()}

      <AnimatePresence>
        {isDrafting && (
          <BillDrafterUI 
            factions={gameState.factions} 
            onSubmit={submitDraftedBill} 
            onCancel={() => setIsDrafting(false)} 
          />
        )}

        {isPropagandaOpen && (
          <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
            <div className="glass-panel p-12 rounded-[2rem] max-w-lg w-full space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <Radio className="text-orange-500" />
                <h2 className="text-2xl font-serif italic">Media Manipulation</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 mb-2">Target MP</label>
                  <select 
                    className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-orange-500"
                    onChange={(e) => setTargetMpId(Number(e.target.value))}
                    value={targetMpId || ""}
                  >
                    <option value="" disabled>Select a target...</option>
                    {gameState.mps.filter(mp => mp.factionId === "future_forward").slice(0, 10).map(mp => (
                      <option key={mp.id} value={mp.id}>{mp.name} ({mp.factionId})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 mb-2">Budget (${smearBudget}M)</label>
                  <input 
                    type="range" min="1" max="50" value={smearBudget} 
                    onChange={(e) => setSmearBudget(Number(e.target.value))}
                    className="w-full accent-orange-600"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsPropagandaOpen(false)} className="flex-1 py-4 rounded-xl border border-white/10 text-xs uppercase font-bold tracking-widest">Cancel</button>
                  <button onClick={launchSmear} className="flex-1 py-4 rounded-xl bg-orange-600 text-white text-xs uppercase font-bold tracking-widest shadow-lg shadow-orange-900/20">Launch</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {event && (
          <CrisisModal event={event} onClose={() => setEvent(null)} />
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
