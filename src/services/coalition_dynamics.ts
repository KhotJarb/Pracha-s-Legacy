import { GameState, Faction, BillDraft } from "../types";

/**
 * Coalition Dynamics: Handling Alliances and Betrayals
 * NPCs decide whether to join or leave the ruling government based on their ideology and demands.
 */

export const MINISTRIES = [
  "Ministry of Transport",
  "Ministry of Environment",
  "Ministry of Finance",
  "Ministry of Defense",
  "Ministry of Public Health",
  "Ministry of Education"
];

/**
 * checkCoalitionLoyalty
 * If the player passes laws that hurt the NPC's voter base, or if their demands aren't met, their loyalty drops.
 * If loyalty hits 0, they trigger a "Vote of No Confidence".
 */
export function checkCoalitionLoyalty(faction: Faction, lastBill: BillDraft | null, gameState: GameState): { loyaltyChange: number; reason: string } {
  let loyaltyChange = 0;
  let reason = "Standard Turn";

  if (!faction.isCoalitionMember) return { loyaltyChange: 0, reason: "Not in coalition" };

  // 1. Ideological Alignment with last bill
  if (lastBill) {
    const alignment = faction.ideologyFocus[lastBill.sector] || 0;
    if (alignment < -0.5) {
      loyaltyChange -= 15;
      reason = `Opposed to ${lastBill.title} (Ideological Conflict)`;
    } else if (alignment > 0.5) {
      loyaltyChange += 10;
      reason = `Supported ${lastBill.title} (Ideological Alignment)`;
    }
  }

  // 2. Cabinet Representation
  // If they have no cabinet seats, they are unhappy
  if (faction.cabinetSeats.length === 0) {
    loyaltyChange -= 5;
    reason = "Lack of Cabinet Representation";
  }

  // 3. National Stability
  if (gameState.nation.stability < 40) {
    loyaltyChange -= 10;
    reason = "National Instability";
  }

  // 4. Greed Factor
  if (faction.traits.greed > 70 && Math.random() < 0.2) {
    loyaltyChange -= 5;
    reason = "Demanding more concessions";
  }

  return { loyaltyChange, reason };
}

/**
 * negotiateCabinetSeats
 * NPCs demand specific ministries that align with their ideology.
 */
export function negotiateCabinetSeats(faction: Faction, gameState: GameState): string | null {
  if (!faction.isCoalitionMember) return null;

  // Find a ministry that aligns with their ideology
  const preferredSector = Object.keys(faction.ideologyFocus).find(s => faction.ideologyFocus[s] > 0.5);
  
  // Map sector to ministry
  const sectorToMinistry: Record<string, string> = {
    "Infrastructure": "Ministry of Transport",
    "Environment": "Ministry of Environment",
    "Military": "Ministry of Defense",
    "Social Welfare": "Ministry of Public Health",
    "Taxation": "Ministry of Finance"
  };

  const demandedMinistry = preferredSector ? sectorToMinistry[preferredSector] : MINISTRIES[Math.floor(Math.random() * MINISTRIES.length)];

  // If the ministry is already held by another faction, there's a conflict
  const currentHolderId = gameState.cabinet[demandedMinistry];
  const currentHolderMp = gameState.mps.find(mp => mp.id === currentHolderId);
  const isHeldByAnother = currentHolderMp && currentHolderMp.factionId !== faction.id;
  
  return demandedMinistry;
}

/**
 * resolveNoConfidenceVote
 * Triggered when a major coalition partner leaves.
 */
export function resolveNoConfidenceVote(gameState: GameState): boolean {
  const { house } = gameState.parliament;
  // If coalition seats drop below 250, the government falls
  return house.coalition < 250;
}
