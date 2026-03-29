import { GameState, IntelligenceOp, MP } from "../types";

export const resolveIntelligenceOp = (op: IntelligenceOp, gameState: GameState) => {
  const { nation, mps } = gameState;
  const target = mps.find(mp => mp.id === op.targetId);
  
  if (!target) return { ...op, status: 'FAILED' as const };

  // Intelligence Budget (Assume 5% of National Budget)
  const intelBudget = (nation.militaryBudget / 10); // Simplified
  const successChance = (intelBudget / 100) * (1 - target.integrity / 200);
  const riskChance = (op.cost / 200) * (1 - intelBudget / 100);

  let status: 'SUCCESS' | 'FAILED' | 'EXPOSED' = 'FAILED';

  if (Math.random() < successChance) {
    status = 'SUCCESS';
    if (op.type === 'WIRETAP') {
      target.politicalCapital = Math.max(0, target.politicalCapital - 10);
    } else if (op.type === 'SMEAR') {
      target.popularity = Math.max(0, target.popularity - 15);
    } else if (op.type === 'REVEAL_CORRUPTION') {
      if (target.corruptionLevel > 50) {
        target.status = [...(target.status || []), "SCANDAL"];
        target.popularity -= 30;
      } else {
        status = 'FAILED';
      }
    }
  } else if (Math.random() < riskChance) {
    status = 'EXPOSED';
    nation.corruption += 5;
    nation.freedom -= 2;
  }

  return { ...op, status };
};
