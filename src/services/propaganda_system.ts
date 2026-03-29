/**
 * propaganda_system.ts
 * 
 * Implements the Media Manipulation Engine.
 * Allows players/NPCs to spend "Dark Money" to run smear campaigns.
 */

import { MP } from '../types';

export interface SmearCampaignResult {
  success: boolean;
  exposed: boolean;
  impact: {
    approvalReduction: number;
    integrityDamage: number;
    scandalTriggered: boolean;
  };
  details: string;
}

/**
 * launchSmearCampaign
 * @param initiator The MP or entity starting the campaign
 * @param target The MP being targeted
 * @param budget Amount of "Dark Money" spent (in Millions)
 */
export function launchSmearCampaign(
  initiator: MP,
  target: MP,
  budget: number
): SmearCampaignResult {
  // 1. Success Probability (S)
  // S = (Budget / 100) * (1 - TargetIntegrity / 100)
  // High integrity targets are harder to smear.
  const successBase = (budget / 100);
  const targetResistance = (target.integrity / 100);
  const successChance = Math.min(0.9, successBase * (1 - targetResistance));
  
  const success = Math.random() < successChance;

  // 2. Blowback Chance (B)
  // B = (Budget / 500) + (1 - InitiatorIntegrity / 100)
  // Spending more money increases the footprint. Low integrity initiators are sloppy.
  const blowbackChance = Math.min(0.8, (budget / 500) + (1 - initiator.integrity / 100));
  const exposed = Math.random() < blowbackChance;

  let approvalReduction = 0;
  let scandalTriggered = false;
  let integrityDamage = 0;
  let details = "";

  if (success) {
    approvalReduction = Math.floor(Math.random() * 20) + 10; // 10-30% reduction
    scandalTriggered = Math.random() < 0.3; // 30% chance to trigger a full scandal
    details = `The smear campaign against ${target.name} was successful. Public approval dropped by ${approvalReduction}%.`;
    if (scandalTriggered) {
      details += " A major scandal has been triggered!";
    }
  } else {
    details = `The smear campaign against ${target.name} failed to gain traction.`;
  }

  if (exposed) {
    integrityDamage = Math.floor(Math.random() * 30) + 20; // 20-50 integrity loss
    details += ` CRITICAL: The operation was exposed! ${initiator.name}'s integrity has been severely damaged.`;
  }

  return {
    success,
    exposed,
    impact: {
      approvalReduction,
      integrityDamage,
      scandalTriggered
    },
    details
  };
}
