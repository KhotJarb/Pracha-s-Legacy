export interface Player {
  name: string;
  background: 'Lawyer' | 'General' | 'Businessman';
  partyId: string;
  stats: {
    charisma: number;
    intelligence: number;
    wealth: number;
  };
}

export interface Nation {
  name: string;
  gdp: number;
  inflation: number;
  stability: number;
  corruption: number;
  freedom: number;
  treasury: number;
  coupMeter: number;
  turn: number;
  establishmentApproval: number;
  environmentalHealth: number;
  militaryBudget: number;
  streetProtestIntensity: number;
}

export interface Faction {
  id: string;
  name: string;
  leaderId: number;
  whipStrength: number; // 0-1, how well they enforce party line
  ideologyFocus: Record<string, number>; // e.g., { "Environment": -0.8, "Infrastructure": 0.9 }
  coalitionLoyalty: number; // 0-100
  isCoalitionMember: boolean;
  cabinetSeats: string[]; // List of ministries held
  traits: {
    ambition: number; // 0-100 (Higher = more likely to backstab for PM seat)
    greed: number; // 0-100 (Higher = more likely to demand money/bribes)
    charisma: number; // 0-100 (Higher = better at convincing others)
  };
  color: string;
}

export interface Politician {
  id: number;
  name: string;
  portraitId: number;
  factionId: string;
  popularity: number; // 0-100
  wealth: number; // Million USD
  corruptionLevel: number; // 0-100
  partyLoyalty: number; // 0-100
  ideologyAxis: number; // -1 (Progressive) to 1 (Conservative)
  role: 'Faction Leader' | 'Backbencher' | 'Fundraiser' | 'Minister';
  politicalCapital: number;
  integrity: number;
  status?: string[];
}

export interface MP extends Politician {
  ideology: Record<string, number>; // Personal ideological scores per sector
}

export interface Demographic {
  name: string;
  satisfaction: number;
  power: number;
}

export interface BillDraft {
  title: string;
  sector: string;
  type?: 'STANDARD' | 'CONSTITUTIONAL_AMENDMENT' | 'PM_CANDIDATE';
  isAntiEstablishment?: boolean;
  budget: number; // 0-100 (Billion)
  severity: number; // 0-100 (Impact intensity)
  bribeTotal: number; // Total money spent on "lobbying" this specific bill
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  impact: {
    gdp?: number;
    stability?: number;
    inflation?: number;
    environmentalHealth?: number;
    freedom?: number;
  };
  type: 'CRISIS' | 'OPPORTUNITY' | 'CRITICAL_GAME_OVER' | 'PARTY_DISSOLUTION';
  duration?: number; // Turns remaining
  reliefSector?: string; // Sector of bill needed to resolve
}

export interface Ministry {
  id: string;
  name: string;
  incumbentId: number | null; // Politician ID
  budget: number; // Million USD
  efficiency: number; // 0-100
}

export interface EconomyStats {
  nationalDebt: number; // Billion USD
  taxBrackets: {
    low: number; // %
    mid: number; // %
    high: number; // %
  };
  budgetAllocation: Record<string, number>; // Ministry ID -> Percentage
}

export interface Law {
  id: string;
  title: string;
  description: string;
  effects: {
    gdp?: number;
    inflation?: number;
    stability?: number;
    corruption?: number;
    freedom?: number;
    satisfaction?: Record<string, number>; // Demographic -> Change
  };
  isActive: boolean;
}

export interface IntelligenceOp {
  id: string;
  type: 'WIRETAP' | 'SMEAR' | 'REVEAL_CORRUPTION';
  targetId: number; // Politician ID
  cost: number;
  risk: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPOSED';
}

export interface TimelineEvent {
  id: string;
  title: string;
  turn: number;
  type: 'ELECTION' | 'DEBATE' | 'COURT_RULING' | 'CRISIS';
}

export interface District {
  id: number;
  name: string;
  leaning: number; // -1 (Progressive) to 1 (Conservative)
  voterTurnout: number;
  incumbentId: number | null;
  candidateIds: Record<string, number | null>; // Party ID -> Politician ID
}

export interface ElectionResult {
  districtId: number;
  winnerPartyId: string;
  winnerId: number | null;
  votes: Record<string, number>;
  turnout: number;
  margin: number;
}

export interface ElectionState {
  isElectionDay: boolean;
  phase: 'NOMINATION' | 'VOTING' | 'RESULTS';
  districts: District[];
  results: ElectionResult[];
}

export interface GameState {
  player: Player | null;
  nation: Nation;
  factions: Faction[];
  mps: MP[];
  demographics: Demographic[];
  parliament: {
    house: { total: number; coalition: number; opposition: number };
    senate: { total: number; establishmentLoyalty: number; militaryAlignment: number };
  };
  activeCrises: GameEvent[];
  cabinet: Record<string, number | null>; // Ministry Name -> Politician ID
  economy: EconomyStats;
  laws: Law[];
  intelligenceOps: IntelligenceOp[];
  timeline: TimelineEvent[];
  election: ElectionState;
}
