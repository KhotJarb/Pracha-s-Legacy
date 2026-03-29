import { Faction, MP, Politician, Law, TimelineEvent, District } from "../types";

export const STARTING_FACTIONS: Faction[] = [
  {
    id: "future_forward",
    name: "Future Forward Party",
    leaderId: 101,
    whipStrength: 0.7,
    ideologyFocus: { "Social Welfare": 0.9, "Taxation": 0.6, "Environment": 0.8 },
    coalitionLoyalty: 0,
    isCoalitionMember: false,
    cabinetSeats: [],
    traits: { ambition: 90, greed: 20, charisma: 85 },
    color: "#FF6321" // Orange
  },
  {
    id: "palang_pracha",
    name: "Palang Pracha Klung",
    leaderId: 201,
    whipStrength: 0.85,
    ideologyFocus: { "Populism": 0.9, "Infrastructure": 0.7, "Social Welfare": 0.5 },
    coalitionLoyalty: 80,
    isCoalitionMember: true,
    cabinetSeats: [],
    traits: { ambition: 60, greed: 50, charisma: 70 },
    color: "#E11D48" // Red
  },
  {
    id: "deng_sang_thai",
    name: "Deng Sang Thai",
    leaderId: 301,
    whipStrength: 0.95,
    ideologyFocus: { "Military": 0.9, "Infrastructure": 0.8, "Establishment": 0.9 },
    coalitionLoyalty: 90,
    isCoalitionMember: true,
    cabinetSeats: [],
    traits: { ambition: 40, greed: 60, charisma: 65 },
    color: "#2563EB" // Blue
  }
];

const generateNPCs = (factionId: string, count: number, startId: number): MP[] => {
  const names = [
    "Somsak", "Prayut", "Thaksin", "Anutin", "Prawit", "Pita", "Thanathorn", "Chuan", "Abhisit", "Yingluck",
    "Somchai", "Banharn", "Chavalit", "Suchinda", "Prem", "Kriangsak", "Thanom", "Sarit", "Plaek", "Pridi"
  ];
  const surnames = [
    "Shinawatra", "Chan-o-cha", "Wongsuwan", "Charnvirakul", "Limjaroenrat", "Juangroongruangkit", "Leekpai", "Vejjajiva", "Adireksarn", "Silpa-archa"
  ];

  return Array.from({ length: count }).map((_, i) => {
    const id = startId + i;
    const name = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
    const ideologyAxis = factionId === "future_forward" ? -0.8 : (factionId === "palang_pracha" ? 0 : 0.8);
    
    return {
      id,
      name,
      portraitId: Math.floor(Math.random() * 20) + 1,
      factionId,
      popularity: Math.floor(Math.random() * 60) + 20,
      wealth: Math.floor(Math.random() * 1000),
      corruptionLevel: Math.floor(Math.random() * 100),
      partyLoyalty: Math.floor(Math.random() * 60) + 40,
      ideologyAxis: ideologyAxis + (Math.random() - 0.5) * 0.4,
      role: i === 0 ? 'Faction Leader' : (Math.random() > 0.8 ? 'Fundraiser' : 'Backbencher'),
      politicalCapital: Math.floor(Math.random() * 100),
      integrity: Math.floor(Math.random() * 80) + 20,
      ideology: {
        "Environment": (Math.random() - 0.5) * 2,
        "Infrastructure": (Math.random() - 0.5) * 2,
        "Taxation": (Math.random() - 0.5) * 2,
        "Social Welfare": (Math.random() - 0.5) * 2,
        "Military": (Math.random() - 0.5) * 2,
      }
    };
  });
};

export const INITIAL_MPS: MP[] = [
  ...generateNPCs("future_forward", 15, 100),
  ...generateNPCs("palang_pracha", 15, 200),
  ...generateNPCs("deng_sang_thai", 15, 300),
  // Fill the rest with generic MPs
  ...Array.from({ length: 455 }).map((_, i) => {
    const factionId = Math.random() > 0.6 ? "future_forward" : (Math.random() > 0.3 ? "palang_pracha" : "deng_sang_thai");
    return generateNPCs(factionId, 1, 1000 + i)[0];
  })
];

export const INITIAL_LAWS: Law[] = [
  {
    id: "law_001",
    title: "Universal Healthcare Act",
    description: "Provides basic healthcare to all citizens, funded by progressive taxation.",
    effects: { stability: 10, satisfaction: { "Working Class": 15, "Middle Class": 5, "Elites": -5 } },
    isActive: true
  },
  {
    id: "law_002",
    title: "Military Procurement Oversight",
    description: "Requires parliamentary approval for all military purchases over $100M.",
    effects: { corruption: -10, freedom: 5, satisfaction: { "Military": -20, "Elites": -5 } },
    isActive: false
  }
];

export const INITIAL_TIMELINE: TimelineEvent[] = [
  { id: "event_001", title: "Budget Debate", turn: 5, type: "DEBATE" },
  { id: "event_002", title: "Constitutional Court Ruling", turn: 12, type: "COURT_RULING" },
  { id: "event_003", title: "General Election", turn: 48, type: "ELECTION" }
];

export const INITIAL_DISTRICTS: District[] = Array.from({ length: 400 }).map((_, i) => ({
  id: i + 1,
  name: `District ${i + 1}`,
  leaning: (Math.random() - 0.5) * 2,
  voterTurnout: 0.7 + Math.random() * 0.2,
  incumbentId: null,
  candidateIds: { "future_forward": null, "palang_pracha": null, "deng_sang_thai": null }
}));
