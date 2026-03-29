/**
 * judiciary_system.ts
 * 
 * Implements the Constitutional Court "Party Dissolution" Mechanic. 
 * In the Thai context, the judiciary often acts as a "check" on popular 
 * movements and parties that threaten the establishment.
 */

export interface DissolutionResult {
  isDissolved: boolean;
  successRate: number;
  reason: string;
}

export function resolvePartyDissolution(establishmentApproval: number): DissolutionResult {
  // 1. Base Dissolution Chance (D)
  // D = (100 - EstablishmentApproval) / 100
  // If the player has low establishment approval, the court is more likely to find 
  // a "legal reason" to dissolve the party.
  const baseDissolutionChance = (100 - establishmentApproval) / 100;
  
  // 2. Weighted RNG
  // The success rate is NOT based on legal facts, but on the RNG weighted by approval.
  const successRate = baseDissolutionChance * 0.8; // Max 80% chance
  
  const isDissolved = Math.random() < successRate;

  // 3. Reasons for Dissolution (Simplified for Demo)
  const reasons = [
    "Violation of Section 92 of the Organic Act on Political Parties.",
    "Attempting to overthrow the constitutional monarchy.",
    "Illegal funding from foreign entities.",
    "Conflict of interest in legislative drafting."
  ];
  const reason = reasons[Math.floor(Math.random() * reasons.length)];

  return {
    isDissolved,
    successRate: successRate * 100,
    reason
  };
}
