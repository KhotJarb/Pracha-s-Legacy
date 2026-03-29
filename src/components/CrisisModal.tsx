import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ShieldAlert, Skull, Radio, X, ChevronRight } from 'lucide-react';

interface CrisisModalProps {
  event: any;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  const getIcon = () => {
    switch (event.type) {
      case 'CRITICAL_GAME_OVER': return <Skull size={48} className="text-red-500" />;
      case 'CRISIS': return <AlertTriangle size={48} className="text-orange-500" />;
      case 'PARTY_DISSOLUTION': return <ShieldAlert size={48} className="text-blue-500" />;
      default: return <Radio size={48} className="text-slate-400" />;
    }
  };

  const getOverlayColor = () => {
    switch (event.type) {
      case 'CRITICAL_GAME_OVER': return 'bg-red-950/80';
      case 'CRISIS': return 'bg-orange-950/80';
      default: return 'bg-slate-950/80';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[300] ${getOverlayColor()} backdrop-blur-xl flex items-center justify-center p-6`}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="max-w-2xl w-full glass-panel rounded-[2rem] overflow-hidden flex flex-col"
      >
        {/* Header Image/Pattern */}
        <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-950 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="grid grid-cols-12 gap-2 h-full">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="w-full h-full border border-white/10"></div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="relative z-10 p-6 bg-slate-900/50 rounded-full border border-white/10 backdrop-blur-md"
          >
            {getIcon()}
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-12 space-y-8">
          <div className="text-center space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-500">Urgent National Intelligence</div>
            <h2 className="text-4xl font-serif italic text-slate-100">{event.title}</h2>
          </div>

          <p className="text-slate-400 text-center leading-relaxed font-sans">
            {event.description}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(event.impact || {}).map(([key, val]: [string, any]) => (
              <div key={key} className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 flex flex-col items-center">
                <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">{key}</div>
                <div className={`text-xl font-bold ${typeof val === 'number' && val < 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {typeof val === 'number' && val > 0 ? '+' : ''}{val}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 bg-white text-slate-950 font-bold py-4 rounded-2xl uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Acknowledge Directive <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
