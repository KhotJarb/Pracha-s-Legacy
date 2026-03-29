/**
 * crisis_manager.ts
 * 
 * Implements the Coup D'état Engine. 
 * This module calculates the probability of a military takeover based on 
 * street unrest, stability, and military satisfaction.
 */

export interface CoupProbabilityResult {
  probability: number;
  factors: {
    streetProtest: number;
    stability: number;
    militaryBudget: number;
    generalSatisfaction: number;
  };
  isTriggered: boolean;
}

export function calculateCoupProbability(gameState: any): CoupProbabilityResult {
  const { nation, demographics } = gameState;
  const military = demographics.find((d: any) => d.name === "Military");
  
  // 1. Street Protest Intensity (Mass Demonstrations)
  // High intensity protests provide the "pretext" for a coup to "restore order".
  const streetProtestFactor = (nation.streetProtestIntensity / 100) * 0.4;

  // 2. Government Stability
  // If stability drops below 30%, the "failed state" narrative takes hold.
  let stabilityFactor = 0;
  if (nation.stability < 30) {
    stabilityFactor = (30 - nation.stability) / 30 * 0.3;
  }

  // 3. Military Satisfaction
  // Passing laws that reduce the military budget or satisfaction increases the risk.
  // Base military budget is assumed to be 8.2 Billion USD.
  const baseBudget = 8.2;
  const budgetFactor = Math.max(0, (baseBudget - nation.militaryBudget) / baseBudget) * 0.5;
  
  const militarySatisfactionFactor = military ? (100 - military.satisfaction) / 100 * 0.3 : 0.1;

  // 4. Combined Probability (P)
  // P = sum(factors)
  const totalProbability = Math.min(1.0, 
    streetProtestFactor + 
    stabilityFactor + 
    budgetFactor + 
    militarySatisfactionFactor
  );

  // 5. Trigger Threshold
  // If probability hits 0.85 (85%), the coup is triggered.
  const isTriggered = totalProbability >= 0.85;

  return {
    probability: totalProbability * 100,
    factors: {
      streetProtest: streetProtestFactor * 100,
      stability: stabilityFactor * 100,
      militaryBudget: budgetFactor * 100,
      generalSatisfaction: militarySatisfactionFactor * 100
    },
    isTriggered
  };
}
