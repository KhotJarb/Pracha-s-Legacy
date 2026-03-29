import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, AlertTriangle, Vote, MessageSquare, Landmark } from 'lucide-react';
import { TimelineEvent } from '../types';

interface TimelineProps {
  events: TimelineEvent[];
  currentTurn: number;
}

const EVENT_ICONS = {
  ELECTION: Vote,
  DEBATE: MessageSquare,
  COURT_RULING: Landmark,
  CRISIS: AlertTriangle
};

export const Timeline: React.FC<TimelineProps> = ({ events, currentTurn }) => {
  const futureEvents = events.filter(e => e.turn >= currentTurn).sort((a, b) => a.turn - b.turn);

  return (
    <div className="glass-panel rounded-full p-4 border border-white/5 flex items-center gap-6 overflow-hidden">
      <div className="flex items-center gap-3 pl-4 border-r border-white/10 pr-6">
        <Calendar className="text-orange-500 w-5 h-5" />
        <div>
          <div className="text-[10px] font-mono uppercase text-slate-500">Current Turn</div>
          <div className="text-sm font-bold text-white">Month {currentTurn}</div>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-8 overflow-x-auto no-scrollbar pr-8">
        {futureEvents.map((event, index) => {
          const Icon = EVENT_ICONS[event.type] || Calendar;
          const turnsAway = event.turn - currentTurn;
          
          return (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 group shrink-0"
            >
              <div className={`p-2 rounded-xl border transition-all ${
                turnsAway <= 3 ? 'bg-orange-600/20 border-orange-500 text-orange-500' : 'bg-slate-900 border-white/10 text-slate-500'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-white group-hover:text-orange-500 transition-all">{event.title}</div>
                <div className="text-[8px] font-mono uppercase text-slate-500">
                  {turnsAway === 0 ? "Today" : `In ${turnsAway} Months`}
                </div>
              </div>
              {index < futureEvents.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-800 ml-4" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
