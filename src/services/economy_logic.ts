import { GameState, Politician, MP } from "../types";

export const calculateEconomyTurn = (gameState: GameState) => {
  const { nation, economy, cabinet, mps } = gameState;
  
  // 1. Calculate Average Tax Rate
  const avgTaxRate = (economy.taxBrackets.low + economy.taxBrackets.mid + economy.taxBrackets.high) / 3 / 100;
  
  // 2. Calculate Total Budget Expenditure
  const totalBudget = Object.values(economy.budgetAllocation).reduce((acc, val) => acc + val, 0);
  const expenditure = (nation.gdp * (totalBudget / 100)) * 0.2; // Assume 20% of GDP is budget
  
  // 3. Minister Bonuses
  let treasuryDrainMultiplier = 1.0;
  let gdpGrowthBonus = 0;
  
  const financeMinisterId = cabinet["Ministry of Finance"];
  const financeMinister = mps.find(mp => mp.id === financeMinisterId);
  
  if (financeMinister) {
    // Populist (ideologyAxis near 0) drains treasury faster but boosts stability
    if (Math.abs(financeMinister.ideologyAxis) < 0.3) {
      treasuryDrainMultiplier = 1.2;
      nation.stability += 2;
    }
    // Conservative (ideologyAxis > 0.5) reduces inflation but slows growth
    if (financeMinister.ideologyAxis > 0.5) {
      nation.inflation -= 0.1;
      gdpGrowthBonus -= 0.005;
    }
    // Progressive (ideologyAxis < -0.5) boosts growth but increases debt
    if (financeMinister.ideologyAxis < -0.5) {
      gdpGrowthBonus += 0.01;
      economy.nationalDebt += 1;
    }
  }

  // 4. GDP Growth
  const baseGrowth = (nation.stability / 100) * 0.05 - (nation.corruption / 100) * 0.02;
  const growth = baseGrowth + gdpGrowthBonus;
  nation.gdp *= (1 + growth);
  
  // 5. Inflation
  nation.inflation += (growth * 0.5) + (economy.nationalDebt / 5000) + (Math.random() - 0.5) * 0.1;
  
  // 6. Treasury & Debt
  const revenue = (nation.gdp * avgTaxRate);
  const netBalance = revenue - (expenditure * treasuryDrainMultiplier);
  
  if (netBalance >= 0) {
    nation.treasury += netBalance;
    economy.nationalDebt = Math.max(0, economy.nationalDebt - netBalance * 0.5);
  } else {
    nation.treasury = Math.max(0, nation.treasury + netBalance);
    if (nation.treasury === 0) {
      economy.nationalDebt += Math.abs(netBalance);
    }
  }

  return {
    growth,
    revenue,
    expenditure: expenditure * treasuryDrainMultiplier,
    netBalance
  };
};
