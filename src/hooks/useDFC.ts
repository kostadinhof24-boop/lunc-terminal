'use client';

import { useState, useEffect, useCallback } from 'react';
import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { coin } from "@cosmjs/stargate";
import { DFCService } from '@/services/DFCService';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { DFC_TOKEN_CONTRACT, DFC_STAKING_CONTRACT } from '@/config/contracts';

const RPC_URL = "https://terra-classic-rpc.publicnode.com:443";

export function useDFC() {
  const { isConnected, address } = useWallet();
  const [dfcBalance, setDfcBalance] = useState("0.00");
  const [stakedBalance, setStakedBalance] = useState("0.00");
  const [pendingRewards, setPendingRewards] = useState("0.00");
  const [pendingFees, setPendingFees] = useState("0.00");
  
  // État de l'action en cours (null, "stake", "unstake", "claimDfc", "claimUstc")
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isConnected || !address) return;
    try {
      const client = await CosmWasmClient.connect(RPC_URL);
      const balanceRes = await client.queryContractSmart(DFC_TOKEN_CONTRACT, { balance: { address } });
      setDfcBalance((Number(balanceRes.balance || 0) / 1_000_000).toFixed(2));

      const info = await DFCService.getStakerInfo(address);
      setStakedBalance((Number(info.staked || 0) / 1_000_000).toFixed(2));
      setPendingRewards((Number(info.rewards || 0) / 1_000_000).toFixed(2));
      setPendingFees((Number(info.fees || 0) / 1_000_000).toFixed(2));
    } catch (err) {
      console.error("Erreur de fetch DFC:", err);
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (isConnected && address) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchData, isConnected, address]);

  const executeTx = async (actionName: string, contractAddress: string, msg: object, funds: any[] = []) => {
    if (!address) {
      setError("Wallet non connecté");
      return false;
    }
    setProcessingAction(actionName);
    setError(null);
    setTxHash(null);
    try {
      const w = window as any;
      await w.keplr.enable("columbus-5");
      const offlineSigner = w.keplr.getOfflineSigner("columbus-5");
      const signingClient = await SigningCosmWasmClient.connectWithSigner(RPC_URL, offlineSigner);
      
      const fee = { amount: [coin("1500000", "uluna")], gas: "1500000" };
      const result = await signingClient.execute(address, contractAddress, msg, fee, "Lunc Terminal DFC", funds);
      
      setTxHash(result.transactionHash);
      return true;
    } catch (err: any) {
      console.error("Erreur Transaction:", err);
      setError(err.message || "La transaction a échoué.");
      return false;
    } finally {
      setProcessingAction(null);
    }
  };

  const claimRewards = async () => {
    const ok = await executeTx("claimDfc", DFC_STAKING_CONTRACT, { claim_rewards: { receipt_address: address } });
    if (ok) setTimeout(fetchData, 5000);
  };

  const claimFees = async () => {
    const ok = await executeTx("claimUstc", DFC_STAKING_CONTRACT, { claim_fees: {} });
    if (ok) setTimeout(fetchData, 5000);
  };

  const stakeDFC = async (amount: number) => {
    const amountInUdfc = Math.floor(amount * 1_000_000).toString();
    const allowanceMsg = { increase_allowance: { spender: DFC_STAKING_CONTRACT, amount: amountInUdfc, expires: { never: {} } } };
    const ok1 = await executeTx("stake", DFC_TOKEN_CONTRACT, allowanceMsg);
    if (!ok1) return;
    
    const stakeMsg = { stake: { amount: amountInUdfc } };
    const ok2 = await executeTx("stake", DFC_STAKING_CONTRACT, stakeMsg);
    if (ok2) setTimeout(fetchData, 5000);
  };

  const unstakeDFC = async (amount: number) => {
    const amountInUdfc = Math.floor(amount * 1_000_000).toString();
    const ok = await executeTx("unstake", DFC_STAKING_CONTRACT, { unstake: { amount: amountInUdfc } });
    if (ok) setTimeout(fetchData, 5000);
  };

  return { 
    dfcBalance, 
    stakedBalance, 
    pendingRewards, 
    pendingFees, 
    claimRewards, 
    claimFees, 
    stakeDFC, 
    unstakeDFC, 
    processingAction, 
    txHash, 
    error 
  };
}
