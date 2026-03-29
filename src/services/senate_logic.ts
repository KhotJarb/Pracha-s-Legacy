/**
 * senate_logic.ts
 * 
 * Implements the 250-seat appointed Senate system. 
 * In the Thai context, the Senate acts as a "protective shield" for the establishment.
 * Their voting logic is decoupled from public opinion and tied to elite alignment.
 */

export interface SenateVoteResult {
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  passed: boolean;
  blocUnity: number; // 0 to 1, representing how unified the vote was
}

export function resolveSenateVote(
  bill: any, 
  establishmentLoyalty: number, 
  militaryAlignment: number
): SenateVoteResult {
  const TOTAL_SEATS = 250;
  
  // 1. Base Alignment Score (A)
  // A = (Loyalty * 0.7) + (Military * 0.3)
  const baseAlignment = (establishmentLoyalty * 0.7) + (militaryAlignment * 0.3);
  
  // 2. Type Multipliers
  // Constitutional amendments are almost always blocked unless they favor the elite.
  let resistanceMultiplier = 1.0;
  if (bill.type === 'CONSTITUTIONAL_AMENDMENT') {
    resistanceMultiplier = 2.5; // Massive resistance to change
  } else if (bill.type === 'PM_CANDIDATE') {
    // If the candidate is "anti-establishment", resistance is maxed.
    resistanceMultiplier = bill.isAntiEstablishment ? 3.0 : 0.5;
  }

  // 3. Individual Senator Simulation (Simplified for Performance)
  // We simulate the "Bloc" behavior using a normal distribution around the alignment.
  let votesFor = 0;
  let votesAgainst = 0;
  let abstentions = 0;

  for (let i = 0; i < TOTAL_SEATS; i++) {
    // Each senator has a small variance but high pressure to follow the bloc.
    const individualVariance = (Math.random() - 0.5) * 0.2;
    const finalScore = baseAlignment + individualVariance - (resistanceMultiplier * 0.2);

    if (finalScore > 0.6) {
      votesFor++;
    } else if (finalScore < 0.3) {
      votesAgainst++;
    } else {
      abstentions++;
    }
  }

  // 4. Bloc Unity Calculation
  const blocUnity = Math.max(votesFor, votesAgainst) / TOTAL_SEATS;

  return {
    votesFor,
    votesAgainst,
    abstentions,
    passed: votesFor > (TOTAL_SEATS / 2),
    blocUnity
  };
}
