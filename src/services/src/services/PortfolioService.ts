import axios from 'axios';
import { SUPPORTED_CHAINS } from '@/lib/chains';

export const PortfolioService = {
  // Récupère les soldes natifs et IBC pour une adresse sur toutes les chaînes
  async getUniversalPortfolio(address: string) {
    const portfolio: any[] = [];

    for (const chain of SUPPORTED_CHAINS) {
      try {
        // 1. Solde Natif (ex: LUNC, ATOM)
        const nativeRes = await axios.get(`${chain.lcdUrl}/cosmos/bank/v1beta1/balances/${address}`);
        
        if (nativeRes.data.balances && nativeRes.data.balances.length > 0) {
          for (const balance of nativeRes.data.balances) {
            if (parseInt(balance.amount) > 0) {
              portfolio.push({
                chain: chain.chainName,
                denom: balance.denom,
                amount: parseInt(balance.amount),
                symbol: balance.denom === chain.denom ? chain.symbol : balance.denom,
                isNative: balance.denom === chain.denom
              });
            }
          }
        }
      } catch (err) {
        console.error(`Erreur de chargement pour ${chain.chainName}`, err);
      }
    }

    return portfolio;
  }
};