import axios from 'axios';

const LCD_URL = 'https://terra-classic-lcd.publicnode.com';
const BURN_ADDRESS = 'terra1sk06e3dyexuq4shw77y4dtt0xpqkcjm974wu5w';

// 1. Récupérer le Total Supply (LUNC)
export async function getTotalSupply() {
  try {
    const res = await axios.get(`${LCD_URL}/cosmos/bank/v1beta1/supply/by_denom?denom=uluna`);
    const supply = parseInt(res.data.amount.amount) / 1_000_000; // Conversion uluna -> LUNC
    return supply;
  } catch (error) {
    console.error("Erreur Total Supply:", error);
    return null;
  }
}

// 2. Récupérer le Staking Pool (Total Staké)
export async function getStakingPool() {
  try {
    const res = await axios.get(`${LCD_URL}/cosmos/staking/v1beta1/pool`);
    const bonded = parseInt(res.data.pool.bonded_tokens) / 1_000_000;
    return bonded;
  } catch (error) {
    console.error("Erreur Staking Pool:", error);
    return null;
  }
}

// 3. Récupérer le Total Burned (Solde de l'adresse de Burn)
export async function getTotalBurned() {
  try {
    const res = await axios.get(`${LCD_URL}/cosmos/bank/v1beta1/balances/${BURN_ADDRESS}/by_denom?denom=uluna`);
    const burnedFromByDenom = parseInt(res.data?.balance?.amount ?? '0') / 1_000_000;

    if (!Number.isNaN(burnedFromByDenom) && burnedFromByDenom >= 0) {
      return burnedFromByDenom;
    }

    // Fallback to the standard balances endpoint when by_denom returns no data.
    const fallbackRes = await axios.get(`${LCD_URL}/cosmos/bank/v1beta1/balances/${BURN_ADDRESS}`);
    const balance = Array.isArray(fallbackRes.data.balances)
      ? fallbackRes.data.balances.find((item: any) => item.denom === 'uluna')
      : fallbackRes.data.balance;

    return parseInt(balance?.amount ?? '0') / 1_000_000;
  } catch (error) {
    console.error("Erreur Total Burned:", error);
    return null;
  }
}

// 4. Récupérer les dernières propositions de Gouvernance
export async function getLatestProposals() {
  try {
    const res = await axios.get(`${LCD_URL}/cosmos/gov/v1beta1/proposals?pagination.limit=3&pagination.reverse=true`);
    return res.data.proposals;
  } catch (error) {
    console.error("Erreur Governance:", error);
    return [];
  }
}

// 5. Récupérer le Block Height (Hauteur de bloc actuelle)
export async function getBlockHeight() {
  try {
    const res = await axios.get(`${LCD_URL}/cosmos/base/tendermint/v1beta1/blocks/latest`);
    return Number(res.data.block.header.height);
  } catch (error) {
    console.error("Erreur Block Height:", error);
    return null;
  }
}

// 6. Récupérer le nombre de validateurs actifs
export async function getActiveValidatorsCount() {
  try {
    const res = await axios.get(`${LCD_URL}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=1`);
    return Number(res.data.pagination?.total ?? 0);
  } catch (error) {
    console.error("Erreur Validators Count:", error);
    return null;
  }
}