import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { resolveSenateVote } from "./src/services/senate_logic";
import { calculateCoupProbability } from "./src/services/crisis_manager";
import { resolvePartyDissolution } from "./src/services/judiciary_system";
import { launchSmearCampaign } from "./src/services/propaganda_system";
import { rollForEvent, applyCrisisModifiers } from "./src/services/event_manager";
import { processNpcTurn, NPCAction } from "./src/services/npc_brain";
import { checkCoalitionLoyalty, resolveNoConfidenceVote } from "./src/services/coalition_dynamics";
import { GameState, MP, GameEvent, BillDraft } from "./src/types";
import { STARTING_FACTIONS, INITIAL_MPS, INITIAL_LAWS, INITIAL_TIMELINE, INITIAL_DISTRICTS } from "./src/data/initial_data";
import { calculateEconomyTurn } from "./src/services/economy_logic";
import { resolveIntelligenceOp } from "./src/services/intelligence_logic";
import { runFullElection } from "./src/services/election_engine";

// --- Game State (In-Memory for Demo) ---
let gameState: GameState = {
  player: null,
  nation: {
    name: "Thailand",
    gdp: 505.2,
    inflation: 2.1,
    stability: 65,
    corruption: 42,
    freedom: 38,
    treasury: 45.5,
    coupMeter: 12,
    turn: 1,
    establishmentApproval: 75,
    environmentalHealth: 80,
    militaryBudget: 8.2, // Billion USD
    streetProtestIntensity: 15, // 0-100
  },
  parliament: {
    house: { total: 500, coalition: 260, opposition: 240 },
    senate: { total: 250, establishmentLoyalty: 0.95, militaryAlignment: 0.9 },
  },
  factions: STARTING_FACTIONS,
  mps: INITIAL_MPS,
  demographics: [
    { name: "Military", satisfaction: 85, power: 1.5 },
    { name: "Working Class", satisfaction: 40, power: 0.8 },
    { name: "Elites", satisfaction: 90, power: 2.0 },
    { name: "Middle Class", satisfaction: 55, power: 1.0 },
    { name: "Environmentalists", satisfaction: 70, power: 0.6 },
    { name: "Industrialists", satisfaction: 60, power: 1.2 },
    { name: "Coastal Livelihoods", satisfaction: 75, power: 0.5 },
  ],
  activeCrises: [],
  cabinet: {
    "Ministry of Environment": null,
    "Ministry of Transport": null,
    "Ministry of Finance": null,
    "Ministry of Defense": null,
    "Ministry of Public Health": null,
    "Ministry of Education": null
  },
  economy: {
    nationalDebt: 120.5,
    taxBrackets: { low: 10, mid: 20, high: 35 },
    budgetAllocation: {
      "Ministry of Finance": 15,
      "Ministry of Defense": 20,
      "Ministry of Transport": 10,
      "Ministry of Environment": 5,
      "Ministry of Education": 15,
      "Ministry of Public Health": 10
    }
  },
  laws: INITIAL_LAWS,
  intelligenceOps: [],
  timeline: INITIAL_TIMELINE,
  election: {
    isElectionDay: false,
    phase: 'NOMINATION',
    districts: INITIAL_DISTRICTS,
    results: []
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Endpoints ---
  app.post("/api/game/start", (req, res) => {
    const { player, customFaction } = req.body;
    gameState.player = player;
    if (customFaction) {
      gameState.factions = [...gameState.factions, customFaction];
    }
    res.json(gameState);
  });

  app.post("/api/game/assign-cabinet", (req, res) => {
    const { ministry, politicianId } = req.body;
    gameState.cabinet[ministry] = politicianId;
    res.json(gameState);
  });

  app.post("/api/game/update-economy", (req, res) => {
    const { economy } = req.body;
    gameState.economy = economy;
    res.json(gameState);
  });

  app.post("/api/game/toggle-law", (req, res) => {
    const { lawId } = req.body;
    const law = gameState.laws.find(l => l.id === lawId);
    if (law) law.isActive = !law.isActive;
    res.json(gameState);
  });

  app.post("/api/game/launch-op", (req, res) => {
    const { op } = req.body;
    const newOp = { ...op, id: `op_${Date.now()}`, status: 'PENDING' };
    gameState.intelligenceOps.push(newOp);
    res.json(gameState);
  });

  app.post("/api/game/nominate-candidate", (req, res) => {
    const { districtId, partyId, politicianId } = req.body;
    const district = gameState.election.districts.find(d => d.id === districtId);
    if (district) {
      district.candidateIds[partyId] = politicianId;
    }
    res.json(gameState);
  });

  app.post("/api/game/run-election", (req, res) => {
    const results = runFullElection(gameState);
    gameState.election.results = results;
    
    // Update parliament
    gameState.parliament.house.total = 500;
    
    res.json({ results, gameState });
  });

  // --- Turn Resolution Logic ---
  app.post("/api/game/next-turn", (req, res) => {
    const { nation, demographics, factions, intelligenceOps } = gameState;
    const npcActions: { factionId: string; action: NPCAction }[] = [];
    const loyaltyReports: { factionId: string; change: number; reason: string }[] = [];

    // 1. Economy Turn
    const econReport = calculateEconomyTurn(gameState);

    // 2. Resolve Intelligence Ops
    intelligenceOps.forEach(op => {
      if (op.status === 'PENDING') {
        const result = resolveIntelligenceOp(op, gameState);
        op.status = result.status;
      }
    });

    // 3. Natural Growth & Decay (Simplified from before)
    const avgSatisfaction = demographics.reduce((acc, d) => acc + d.satisfaction * d.power, 0) / 
                           demographics.reduce((acc, d) => acc + d.power, 0);
    nation.stability = (nation.stability * 0.8) + (avgSatisfaction * 0.2);

    // 4. Apply Active Crisis Modifiers
    applyCrisisModifiers(gameState);

    // 5. Coalition Loyalty Check
    factions.forEach(f => {
      if (f.isCoalitionMember) {
        const report = checkCoalitionLoyalty(f, null, gameState);
        f.coalitionLoyalty = Math.max(0, Math.min(100, f.coalitionLoyalty + report.loyaltyChange));
        loyaltyReports.push({ factionId: f.id, change: report.loyaltyChange, reason: report.reason });

        // If loyalty hits 0, they leave
        if (f.coalitionLoyalty <= 0) {
          f.isCoalitionMember = false;
          f.cabinetSeats = [];
          // Update parliament seats
          const factionMps = gameState.mps.filter(mp => mp.factionId === f.id).length;
          gameState.parliament.house.coalition -= factionMps;
          gameState.parliament.house.opposition += factionMps;
        }
      }
    });

    // 4. NPC Brain: Process AI Turns
    factions.forEach(f => {
      const action = processNpcTurn(f, gameState);
      npcActions.push({ factionId: f.id, action });

      // Execute some actions immediately
      if (action.type === "SMEAR_CAMPAIGN" && action.targetId) {
        // Simple smear for now
        const target = gameState.mps.find(mp => mp.id === action.targetId);
        if (target) target.politicalCapital = Math.max(0, target.politicalCapital - 10);
      }
    });

    // 5. No Confidence Check
    let noConfidenceTriggered = false;
    if (resolveNoConfidenceVote(gameState)) {
      noConfidenceTriggered = true;
      nation.stability -= 30;
      // Game Over or Crisis?
    }

    // 6. Roll for New Events
    let event = rollForEvent(nation.turn, gameState);
    if (event && event.type === 'CRISIS') {
      gameState.activeCrises.push(event);
    }

    // 7. Coup Engine Check
    const coupResult = calculateCoupProbability(gameState);
    nation.coupMeter = coupResult.probability;

    if (coupResult.isTriggered) {
      event = { 
        id: "coup_001",
        title: "COUP D'ETAT: JUNTA TAKEOVER", 
        description: "The military has seized power to 'restore order'. The constitution is suspended.",
        impact: { stability: -50, freedom: -90 },
        type: "CRITICAL_GAME_OVER"
      };
      nation.stability = 10;
      nation.freedom = 0;
    } else if (!event && Math.random() < 0.15) {
      // 8. Judiciary System Check (Party Dissolution)
      const dissolutionResult = resolvePartyDissolution(nation.establishmentApproval);
      if (dissolutionResult.isDissolved) {
        event = {
          id: "dissolution_001",
          title: "PARTY DISSOLVED BY COURT",
          description: dissolutionResult.reason,
          impact: { stability: -20, freedom: -10 },
          type: "PARTY_DISSOLUTION"
        };
        // Penalty: Lose coalition support
        gameState.parliament.house.coalition -= 100;
        gameState.parliament.house.opposition += 100;
      }
    }

    nation.turn += 1;
    res.json({ 
      gameState, 
      event, 
      coupResult, 
      npcActions, 
      loyaltyReports,
      noConfidenceTriggered 
    });
  });

  // --- Propaganda API ---
  app.post("/api/game/smear-campaign", (req, res) => {
    const { initiatorId, targetId, budget } = req.body;
    const initiator = gameState.mps.find(mp => mp.id === initiatorId);
    const target = gameState.mps.find(mp => mp.id === targetId);

    if (!initiator || !target) {
      return res.status(404).json({ error: "Initiator or Target not found." });
    }

    const result = launchSmearCampaign(initiator, target, budget);
    
    // Apply Blowback
    if (result.exposed) {
      initiator.integrity = Math.max(0, initiator.integrity - result.impact.integrityDamage);
      gameState.nation.corruption += 5;
    }

    // Apply Success
    if (result.success) {
      target.politicalCapital = Math.max(0, target.politicalCapital - result.impact.approvalReduction);
      if (result.impact.scandalTriggered) {
        target.status = [...(target.status || []), "SCANDAL"];
      }
    }

    res.json({ result, gameState });
  });

  // --- Generic Voting Logic ---
  app.post("/api/game/vote-bill", (req, res) => {
    const { parliament } = gameState;
    const senateVotesFor = Math.floor(parliament.senate.total * 0.9);
    res.json({ passed: true, details: { house: 260, senate: senateVotesFor } });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pracha's Legacy Server running on http://localhost:${PORT}`);
  });
}

startServer();
