import axios from 'axios';
import { TERRA_CLASSIC_CONFIG } from '@/config/chains';

export interface Validator {
  operator_address: string;
  description: {
    moniker: string;
    identity?: string;
    website?: string;
    security_contact?: string;
    details?: string;
  };
  commission: {
    commission_rates: {
      rate: string;
      max_rate: string;
      max_change_rate: string;
    };
  };
  status: string;
  tokens: string;
  delegator_shares: string;
  jailed: boolean;
}

export const StakingService = {
  async getActiveValidators(): Promise<Validator[]> {
    try {
      const res = await axios.get(`${TERRA_CLASSIC_CONFIG.lcdUrl}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=100`);
      return res.data.validators || [];
    } catch (err) {
      console.error("Erreur lors de la récupération des validateurs:", err);
      return [];
    }
  },

  async getStakingApr(): Promise<number> {
    try {
      const res = await axios.get(`${TERRA_CLASSIC_CONFIG.lcdUrl}/cosmos/mint/v1beta1/annual_provisions`);
      const annualProvisions = parseFloat(res.data.annual_provisions);
      
      const poolRes = await axios.get(`${TERRA_CLASSIC_CONFIG.lcdUrl}/cosmos/staking/v1beta1/pool`);
      const bondedTokens = parseFloat(poolRes.data.pool.bonded_tokens);
      
      if (bondedTokens === 0) return 0;
      // Calcul de l'APR approximatif (Annual Provisions / Bonded Tokens)
      const apr = (annualProvisions / bondedTokens) * 100;
      return apr;
    } catch {
      return 0;
    }
  }
};