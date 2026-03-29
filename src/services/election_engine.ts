import { GameState, Politician, District, MP, ElectionResult } from "../types";

export const calculateDistrictResult = (
  district: District,
  mps: MP[],
  factions: any[],
  stability: number
): ElectionResult => {
  const votes: Record<string, number> = {};
  const scores: Record<string, number> = {};
  let totalScore = 0;

  factions.forEach(faction => {
    const candidateId = district.candidateIds[faction.id];
    const candidate = mps.find(mp => mp.id === candidateId);
    
    // Base score from party popularity (simulated as 50 for now)
    let score = 30; 

    if (candidate) {
      // S = (CandidatePopularity * 0.4) + (PartyIdeologyMatch * 0.3) + (DistrictLeaningMatch * 0.3)
      const popularityBonus = candidate.popularity * 0.4;
      
      // Ideology match: -1 to 1. 
      // District leaning: -1 (Progressive) to 1 (Conservative)
      // Candidate ideologyAxis: -1 to 1
      const ideologyMatch = (1 - Math.abs(candidate.ideologyAxis - district.leaning)) * 30;
      
      score += popularityBonus + ideologyMatch;
    } else {
      // Penalty for no candidate
      score = 10;
    }

    scores[faction.id] = score;
    totalScore += score;
  });

  const turnout = Math.min(1, district.voterTurnout * (1 + (stability - 50) / 200));
  const totalVotes = 100000 * turnout; // Assume 100k voters per district

  let winnerPartyId = "";
  let maxVotes = -1;

  Object.entries(scores).forEach(([partyId, score]) => {
    const partyVotes = Math.floor((score / totalScore) * totalVotes);
    votes[partyId] = partyVotes;
    if (partyVotes > maxVotes) {
      maxVotes = partyVotes;
      winnerPartyId = partyId;
    }
  });

  const sortedVotes = Object.values(votes).sort((a, b) => b - a);
  const margin = sortedVotes.length > 1 ? (sortedVotes[0] - sortedVotes[1]) / totalVotes : 1;

  return {
    districtId: district.id,
    winnerPartyId,
    winnerId: district.candidateIds[winnerPartyId] || null,
    votes,
    turnout,
    margin
  };
};

export const runFullElection = (gameState: GameState): ElectionResult[] => {
  return gameState.election.districts.map(district => 
    calculateDistrictResult(district, gameState.mps, gameState.factions, gameState.nation.stability)
  );
};
