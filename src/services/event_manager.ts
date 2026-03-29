/**
 * event_manager.ts
 * 
 * Implements the Dynamic Crisis Director.
 * Randomized but state-dependent event generator.
 */

import { GameEvent, GameState } from '../types';

const CRISES: GameEvent[] = [
  {
    id: "crisis_001",
    title: "Global Pandemic",
    description: "A new respiratory virus has emerged, disrupting global trade and local stability.",
    impact: { gdp: -0.05, stability: -15, inflation: 0.02 },
    type: 'CRISIS',
    duration: 6,
    reliefSector: 'Social Welfare'
  },
  {
    id: "crisis_002",
    title: "Stock Market Crash",
    description: "A sudden collapse in the global stock market has wiped out billions in wealth.",
    impact: { gdp: -0.08, stability: -10, inflation: -0.01 },
    type: 'CRISIS',
    duration: 4,
    reliefSector: 'Taxation'
  },
  {
    id: "crisis_003",
    title: "Severe Drought",
    description: "A prolonged lack of rainfall has devastated the agricultural sector and coastal livelihoods.",
    impact: { gdp: -0.03, stability: -5, environmentalHealth: -15 },
    type: 'CRISIS',
    duration: 8,
    reliefSector: 'Environment'
  },
  {
    id: "crisis_004",
    title: "Leaked Panama Papers",
    description: "A massive leak of offshore financial documents has exposed high-level corruption.",
    impact: { stability: -20, freedom: 10 },
    type: 'CRISIS',
    duration: 3,
    reliefSector: 'Infrastructure' // (Representing anti-corruption/transparency measures)
  },
  {
    id: "crisis_005",
    title: "Coastal Flooding",
    description: "Rising sea levels and extreme weather have caused catastrophic flooding in coastal regions.",
    impact: { gdp: -0.04, stability: -12, environmentalHealth: -10 },
    type: 'CRISIS',
    duration: 5,
    reliefSector: 'Infrastructure'
  }
];

/**
 * rollForEvent
 * @param currentTurn The current turn number
 * @param gameState The current state of the game
 */
export function rollForEvent(currentTurn: number, gameState: GameState): GameEvent | null {
  const { nation } = gameState;
  
  // 1. Base Probability (P)
  // P = 0.1 (10% chance per turn)
  let baseProbability = 0.1;

  // 2. State-Dependent Weights
  // If environmental health is low, the chance of drought or flooding increases.
  if (nation.environmentalHealth < 40) {
    baseProbability += 0.15; // +15% chance
  }

  // If stability is low, the chance of a crisis increases.
  if (nation.stability < 40) {
    baseProbability += 0.1; // +10% chance
  }

  // 3. Roll
  if (Math.random() < baseProbability) {
    // 4. Weighted Selection
    // Filter crises that are relevant to the current state.
    let candidates = [...CRISES];
    
    // If environmental health is low, prioritize environmental crises.
    if (nation.environmentalHealth < 40) {
      candidates = candidates.filter(c => c.reliefSector === 'Environment' || c.reliefSector === 'Infrastructure');
    }

    // Pick a random crisis from the candidates.
    const crisis = candidates[Math.floor(Math.random() * candidates.length)];
    return { ...crisis };
  }

  return null;
}

/**
 * applyCrisisModifiers
 * @param gameState The current state of the game
 */
export function applyCrisisModifiers(gameState: GameState) {
  const { nation, activeCrises } = gameState;

  activeCrises.forEach(crisis => {
    if (crisis.impact.gdp) nation.gdp *= (1 + crisis.impact.gdp);
    if (crisis.impact.stability) nation.stability = Math.max(0, Math.min(100, nation.stability + crisis.impact.stability));
    if (crisis.impact.inflation) nation.inflation += crisis.impact.inflation;
    if (crisis.impact.environmentalHealth) nation.environmentalHealth = Math.max(0, Math.min(100, nation.environmentalHealth + crisis.impact.environmentalHealth));
    if (crisis.impact.freedom) nation.freedom = Math.max(0, Math.min(100, nation.freedom + crisis.impact.freedom));
    
    // Decrease duration
    if (crisis.duration !== undefined) {
      crisis.duration -= 1;
    }
  });

  // Remove expired crises
  gameState.activeCrises = activeCrises.filter(c => c.duration === undefined || c.duration > 0);
}
