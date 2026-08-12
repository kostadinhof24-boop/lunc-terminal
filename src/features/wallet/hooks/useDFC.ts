'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DFCService } from '@/services/DFCService';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { WalletService } from '@/features/wallet/services/wallet.service';
import { DFC_TOKEN_CONTRACT, DFC_STAKING_CONTRACT } from '@/config/contracts';

export function useDFC() {
  const { isConnected, address } = useWallet();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ['dfcData', address],
    queryFn: async () => {
      if (!address) return null;
      const balance = await DFCService.getBalance(address);
      const info = await DFCService.getStakerInfo(address);
      return {
        dfcBalance: balance,
        stakedBalance: (Number(info.staked || 0) / 1000000).toFixed(2),
        pendingRewards: (Number(info.rewards || 0) / 1000000).toFixed(2),
        pendingFees: (Number(info.fees || 0) / 1000000).toFixed(2),
      };
    },
    enabled: isConnected && !!address,
    refetchInterval: 30000,
  });

  const executeTransaction = async (contractAddress: string, msg: object) => {
    if (!isConnected || !address) { setError('Wallet non connecté'); return false; }
    setIsProcessing(true); setError(null); setTxHash(null);
    try {
      const walletService = new WalletService();
      const hash = await walletService.executeTransaction(address, contractAddress, msg);
      setTxHash(hash);
      return true;
    } catch (err: any) { setError(err.message || 'Échec'); return false; } 
    finally { setIsProcessing(false); }
  };

  const refreshData = () => queryClient.invalidateQueries({ queryKey: ['dfcData', address] });

  const claimRewards = async () => {
    if (await executeTransaction(DFC_STAKING_CONTRACT, { claim_rewards: { receipt_address: address } })) setTimeout(refreshData, 5000);
  };
  const claimFees = async () => {
    if (await executeTransaction(DFC_STAKING_CONTRACT, { claim_fees: {} })) setTimeout(refreshData, 5000);
  };
  const stakeDFC = async (amount: number) => {
    const amt = Math.floor(amount * 1000000).toString();
    if (await executeTransaction(DFC_TOKEN_CONTRACT, { increase_allowance: { spender: DFC_STAKING_CONTRACT, amount: amt, expires: { never: {} } } })) {
      if (await executeTransaction(DFC_STAKING_CONTRACT, { stake: { amount: amt } })) setTimeout(refreshData, 5000);
    }
  };
  const unstakeDFC = async (amount: number) => {
    const amt = Math.floor(amount * 1000000).toString();
    if (await executeTransaction(DFC_STAKING_CONTRACT, { unstake: { amount: amt } })) setTimeout(refreshData, 5000);
  };

  return { dfcBalance: data?.dfcBalance || '0', stakedBalance: data?.stakedBalance || '0', pendingRewards: data?.pendingRewards || '0', pendingFees: data?.pendingFees || '0', claimRewards, claimFees, stakeDFC, unstakeDFC, isProcessing, txHash, error };
}