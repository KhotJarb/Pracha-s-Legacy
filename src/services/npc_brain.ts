import { GameState, Faction, MP, BillDraft } from "../types";

/**
 * NPC Brain: The Utility AI for Faction Leaders
 * Every turn, NPC leaders evaluate potential actions based on their traits and ideology.
 */

export type NPCActionType = 
  | "PROPOSE_BILL" 
  | "SMEAR_CAMPAIGN" 
  | "DEMAND_CABINET" 
  | "LEAVE_COALITION" 
  | "LOBBY_VOTES"
  | "DO_NOTHING";

export interface NPCAction {
  type: NPCActionType;
  utility: number;
  targetId?: string | number;
  bill?: BillDraft;
}

/**
 * calculateActionUtility
 * Scores how much an action benefits the NPC's core ideology and personal power.
 */
export function calculateActionUtility(
  faction: Faction, 
  action: NPCActionType, 
  gameState: GameState,
  targetId?: string | number
): number {
  let utility = 0;
  const { nation, activeCrises } = gameState;

  switch (action) {
    case "PROPOSE_BILL":
      // High utility if there's a crisis in their relief sector
      const relevantCrisis = activeCrises.find(c => faction.ideologyFocus[c.reliefSector || ""] > 0.5);
      utility += relevantCrisis ? 40 : 10;
      // Ambition increases desire to pass laws
      utility += (faction.traits.ambition / 5);
      break;

    case "SMEAR_CAMPAIGN":
      // Target rival faction leader
      if (targetId) {
        utility += 15;
        // High ambition = more aggressive
        utility += (faction.traits.ambition / 4);
        // If target is in coalition and NPC wants their spot
        if (gameState.factions.find(f => f.id === targetId)?.isCoalitionMember) {
          utility += 20;
        }
      }
      break;

    case "DEMAND_CABINET":
      if (faction.isCoalitionMember && faction.cabinetSeats.length < 2) {
        utility += 30;
        utility += (faction.traits.greed / 3);
      }
      break;

    case "LEAVE_COALITION":
      if (faction.isCoalitionMember) {
        // High utility if loyalty is low
        utility += (100 - faction.coalitionLoyalty) * 0.8;
        // High ambition = more likely to leave to challenge for PM
        if (nation.stability < 40) utility += 25;
      }
      break;

    case "LOBBY_VOTES":
      utility += 10;
      utility += (faction.traits.greed / 5);
      break;

    case "DO_NOTHING":
      utility = 5;
      break;
  }

  return utility;
}

/**
 * processNpcTurn
 * The core logic loop for an NPC deciding its move.
 */
export function processNpcTurn(faction: Faction, gameState: GameState): NPCAction {
  const actions: NPCActionType[] = ["PROPOSE_BILL", "SMEAR_CAMPAIGN", "DEMAND_CABINET", "LEAVE_COALITION", "LOBBY_VOTES", "DO_NOTHING"];
  
  const evaluatedActions: NPCAction[] = actions.map(type => {
    // For Smear Campaign, pick a random rival
    let targetId: string | number | undefined;
    if (type === "SMEAR_CAMPAIGN") {
      const rivals = gameState.factions.filter(f => f.id !== faction.id);
      targetId = rivals[Math.floor(Math.random() * rivals.length)].id;
    }

    return {
      type,
      utility: calculateActionUtility(faction, type, gameState, targetId),
      targetId
    };
  });

  // Pick the action with the highest utility
  const bestAction = evaluatedActions.reduce((prev, current) => (prev.utility > current.utility) ? prev : current);

  // If proposing a bill, generate a basic one
  if (bestAction.type === "PROPOSE_BILL") {
    const sector = Object.keys(faction.ideologyFocus)[0] || "Infrastructure";
    bestAction.bill = {
      title: `${faction.name}'s ${sector} Reform`,
      sector,
      budget: 20 + Math.random() * 30,
      severity: 40 + Math.random() * 40,
      bribeTotal: faction.traits.greed > 50 ? 10 : 0
    };
  }

  return bestAction;
}
