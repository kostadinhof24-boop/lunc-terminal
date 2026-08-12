import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { TERRA_CLASSIC_CONFIG } from '@/config/chains';
import { DFC_TOKEN_CONTRACT, DFC_STAKING_CONTRACT } from '@/config/contracts';

let client: CosmWasmClient | null = null;

async function getClient(): Promise<CosmWasmClient> {
  if (!client) {
    client = await CosmWasmClient.connect(TERRA_CLASSIC_CONFIG.rpcUrl);
  }
  return client;
}

export const DFCService = {
  async getBalance(address: string): Promise<string> {
    try {
      const c = await getClient();
      console.log("🔍 Querying DFC Balance for:", address);
      const res = await c.queryContractSmart(DFC_TOKEN_CONTRACT, { balance: { address } });
      console.log("✅ DFC Balance Response:", res);
      return (Number(res.balance) / 1000000).toFixed(2);
    } catch (err: any) {
      console.error("❌ Erreur getBalance DFC:", err.message || err);
      return '0';
    }
  },

  async getStakerInfo(address: string): Promise<{ staked: string; rewards: string; fees: string }> {
    try {
      const c = await getClient();
      let staked = '0';
      let rewards = '0';
      let fees = '0';

      try {
        const r = await c.queryContractSmart(DFC_STAKING_CONTRACT, { get_acc_withdrawable_stake: { user_address: address } });
        staked = r.amount || '0';
      } catch (e: any) {
        console.warn("Err stake:", e.message);
      }

      try {
        const r = await c.queryContractSmart(DFC_STAKING_CONTRACT, { get_unclaimed_rewards: { user_address: address } });
        rewards = r.amount || '0';
      } catch (e: any) {
        console.warn("Err rewards:", e.message);
      }

      try {
        const r = await c.queryContractSmart(DFC_STAKING_CONTRACT, { get_unclaimed_fees: { user_address: address } });
        fees = r.amount || '0';
      } catch (e: any) {
        console.warn("Err fees:", e.message);
      }

      return { staked, rewards, fees };
    } catch (err: any) {
      console.error("Erreur Lecture Staking:", err.message);
      return { staked: '0', rewards: '0', fees: '0' };
    }
  }
};