import { useState, useEffect, useCallback } from 'react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { BurnEngine } from '@/lib/burn-engine';

const RPC_URL = 'https://terra-classic-rpc.publicnode.com';
const DFLUNC_HUB_CONTRACT = 'terra1eewgymwqqp0wcdllmz36xaank8lj3fcylzj3wx';

export function useBurn(address: string | null) {
  const [luncBalance, setLuncBalance] = useState(0); // En micro (uluna)
  const [protocolStats, setProtocolStats] = useState({
    currentCycle: 0,
    totalBurnedBatches: 0,
    cycleMintedDfc: 0,
    totalStakedDfc: 0,
    rewardPoolUstc: 0,
  });
  const [isBurning, setIsBurning] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. Lecture des donnÃ©es
  const fetchData = useCallback(async () => {
    if (!address) return;
    try {
      const client = await SigningCosmWasmClient.connect(RPC_URL);
      
      // Solde LUNC
      const bal = await client.getBalance(address, 'uluna');
      setLuncBalance(parseInt(bal.amount));

      // Stats Protocole (HypothÃ¨ses de requÃªtes CosmWasm)
      try {
        const baseState = await client.queryContractSmart(DFLUNC_HUB_CONTRACT, { get_base_state: {} });
        setProtocolStats({
          currentCycle: baseState.current_cycle || 0,
          totalBurnedBatches: baseState.total_burned_batches || 0,
          cycleMintedDfc: baseState.cycle_minted_dfc || 0,
          totalStakedDfc: baseState.total_staked_dfc || 0,
          rewardPoolUstc: baseState.reward_pool_uusd || 0,
        });
      } catch (e) {
        console.warn("Contrat DFLunc: requÃªte de stats impossible (le contrat a pu changer)");
      }

    } catch (err) {
      console.error("Erreur de lecture LCD/RPC:", err);
    }
  }, [address]);

  useEffect(() => {
    fetchData();
    if (address) {
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [address, fetchData]);

  // 2. ExÃ©cution du Burn
  const executeBurn = async (amountLuncMacro: number) => {
    if (!address || !window.keplr || amountLuncMacro <= 0) return;
    setIsBurning(true);
    setError(null);
    setTxHash(null);

    try {
      const w = window as any;
      await w.keplr.enable('columbus-5');
      const offlineSigner = w.keplr.getOfflineSigner('columbus-5');
      const signingClient = await SigningCosmWasmClient.connectWithSigner(RPC_URL, offlineSigner);

      const amountUluna = Math.floor(amountLuncMacro * 1_000_000).toString();
      const fee = { amount: [{ denom: 'uluna', amount: '300000' }], gas: '1500000' };

      // Message CosmWasm exact pour DFLunc
      const result = await signingClient.execute(
        address, 
        DFLUNC_HUB_CONTRACT, 
        { burn_old_mint_new: {} }, 
        fee, 
        "DFLunc Burn Transaction",
        [{ denom: 'uluna', amount: amountUluna }] // Envoi des fonds LUNC
      );
      
      setTxHash(result.transactionHash);
      fetchData(); // RafraÃ®chit le solde
    } catch (err: any) {
      console.error("Erreur Burn:", err);
      setError(err.message || "La transaction a Ã©chouÃ©.");
    } finally {
      setIsBurning(false);
    }
  };

  return { luncBalance, protocolStats, executeBurn, isBurning, txHash, error };
}
