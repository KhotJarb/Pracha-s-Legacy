import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Briefcase, Shield, Landmark, Palette, Info } from 'lucide-react';
import { Player, Faction } from '../types';
import { STARTING_FACTIONS } from '../data/initial_data';

interface OnboardingProps {
  onComplete: (player: Player, customFaction?: Faction) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [background, setBackground] = useState<'Lawyer' | 'General' | 'Businessman'>('Lawyer');
  const [selectedPartyId, setSelectedPartyId] = useState<string>('future_forward');
  const [isCustomParty, setIsCustomParty] = useState(false);
  const [customPartyName, setCustomPartyName] = useState('');
  const [customPartyColor, setCustomPartyColor] = useState('#FF6321');

  const handleStart = () => {
    const player: Player = {
      name,
      background,
      partyId: isCustomParty ? 'custom_party' : selectedPartyId,
      stats: {
        charisma: background === 'Lawyer' ? 80 : (background === 'General' ? 40 : 60),
        intelligence: background === 'Lawyer' ? 70 : (background === 'General' ? 50 : 80),
        wealth: background === 'Lawyer' ? 30 : (background === 'General' ? 10 : 90),
      }
    };

    let customFaction: Faction | undefined;
    if (isCustomParty) {
      customFaction = {
        id: 'custom_party',
        name: customPartyName,
        leaderId: 0, // Player ID
        whipStrength: 0.8,
        ideologyFocus: { "Populism": 0.5, "Infrastructure": 0.5 },
        coalitionLoyalty: 0,
        isCoalitionMember: false,
        cabinetSeats: [],
        traits: { ambition: 100, greed: 50, charisma: 80 },
        color: customPartyColor
      };
    }

    onComplete(player, customFaction);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950 flex items-center justify-center p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-12 rounded-[3rem] max-w-4xl w-full space-y-12 border border-white/10 shadow-2xl"
      >
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-serif italic text-white tracking-tight">Machiavelli's Legacy</h1>
          <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">The Thai Political Simulator</p>
        </div>

        {step === 1 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-widest">Identity</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Enter your name..." 
                  className="w-full bg-slate-900/50 border border-white/10 p-5 pl-12 rounded-2xl text-white outline-none focus:border-orange-500 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-widest">Background</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'Lawyer', icon: Landmark, desc: '+Charisma, +Intelligence' },
                  { id: 'General', icon: Shield, desc: '+Military Support, +Stability' },
                  { id: 'Businessman', icon: Briefcase, desc: '+Wealth, +GDP Growth' }
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setBackground(bg.id as any)}
                    className={`p-6 rounded-2xl border transition-all text-left space-y-3 ${
                      background === bg.id ? 'bg-orange-600/20 border-orange-500' : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <bg.icon className={background === bg.id ? 'text-orange-500' : 'text-slate-500'} />
                    <div>
                      <div className="text-sm font-bold text-white">{bg.id}</div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase">{bg.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={!name}
              onClick={() => setStep(2)}
              className="w-full py-5 rounded-2xl bg-white text-slate-950 font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
            >
              Continue to Party Selection
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-widest">Choose Your Allegiance</label>
              <div className="grid grid-cols-2 gap-4">
                {STARTING_FACTIONS.map((faction) => (
                  <button
                    key={faction.id}
                    onClick={() => { setSelectedPartyId(faction.id); setIsCustomParty(false); }}
                    className={`p-6 rounded-2xl border transition-all text-left space-y-3 ${
                      selectedPartyId === faction.id && !isCustomParty ? 'border-white' : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                    }`}
                    style={{ borderColor: selectedPartyId === faction.id && !isCustomParty ? faction.color : undefined }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-white">{faction.name}</div>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: faction.color }}></div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase">
                      {Object.entries(faction.ideologyFocus).map(([k, v]) => `${k}: ${v > 0 ? '+' : ''}${v}`).join(' | ')}
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => setIsCustomParty(true)}
                  className={`p-6 rounded-2xl border transition-all text-left space-y-3 ${
                    isCustomParty ? 'border-orange-500 bg-orange-600/10' : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Palette className={isCustomParty ? 'text-orange-500' : 'text-slate-500'} />
                    <div className="text-sm font-bold text-white">Create Custom Party</div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Define your own ideology</div>
                </button>
              </div>
            </div>

            {isCustomParty && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 p-6 bg-slate-900/50 rounded-2xl border border-white/10"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-slate-500">Party Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-white/10 p-3 rounded-xl text-white outline-none"
                      value={customPartyName}
                      onChange={(e) => setCustomPartyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-slate-500">Party Color</label>
                    <input 
                      type="color" 
                      className="w-full h-12 bg-slate-950 border border-white/10 p-1 rounded-xl cursor-pointer"
                      value={customPartyColor}
                      onChange={(e) => setCustomPartyColor(e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 py-5 rounded-2xl border border-white/10 text-slate-400 font-bold uppercase tracking-widest hover:bg-white/5"
              >
                Back
              </button>
              <button 
                onClick={handleStart}
                className="flex-1 py-5 rounded-2xl bg-orange-600 text-white font-bold uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20"
              >
                Begin Legacy
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
