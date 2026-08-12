import fs from 'fs';
import path from 'path';

console.log("🚀 Début de la réparation...");

// 1. Réparer WalletProviderClient.tsx
const wpcPath = 'src/features/wallet/components/WalletProviderClient.tsx';
const wpcContent = `'use client';

import { WalletProvider, KeplrWallet, LeapWallet } from '@terra-money/wallet-kit';
import { ReactNode } from 'react';
import { TERRA_CLASSIC_CONFIG } from '@/config/chains';

const networksConfig = {
  [TERRA_CLASSIC_CONFIG.chainId]: {
    chainID: TERRA_CLASSIC_CONFIG.chainId,
    URL: TERRA_CLASSIC_CONFIG.lcdUrl,
    gasAdjustment: '1.5',
    gasPrices: '0.15uluna',
    prefix: 'terra',
    isClassic: true,
  },
};

export default function WalletProviderClient({ children }: { children: ReactNode }) {
  return (
    <WalletProvider 
      wallets={[new KeplrWallet(), new LeapWallet()]} 
      defaultNetworks={networksConfig as any}
    >
      {children}
    </WalletProvider>
  );
}
`;
fs.mkdirSync(path.dirname(wpcPath), { recursive: true });
fs.writeFileSync(wpcPath, wpcContent, 'utf8');
console.log("✅ Fichier mis à jour: " + wpcPath);

// 2. Réparer useDFC.ts (avec TanStack Query optimisé)
const useDfcPath = 'src/features/wallet/hooks/useDFC.ts';
const useDfcContent = `'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DFCService } from '@/services/DFCService';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { WalletService } from '@/features/wallet/services/wallet.service';
import { DFC_TOKEN_CONTRACT, DFC_STAKING_CONTRACT } from '@/config/contracts';

export function useDFC() {
  const { controller, isConnected, address } = useWallet();
  const queryClient = useQueryClient();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['dfcData', address],
    queryFn: async () => {
      if (!address) return null;
      const balance = await DFCService.getBalance(address);
      const info = await DFCService.getStakerInfo(address);
      
      return {
        dfcBalance: balance,
        stakedBalance: (Number(info.staked || 0) / 1_000_000).toFixed(2),
        pendingRewards: (Number(info.rewards || 0) / 1_000_000).toFixed(2),
        pendingFees: (Number(info.fees || 0) / 1_000_000).toFixed(2),
      };
    },
    enabled: isConnected && !!address,
    refetchInterval: 30000,
  });

  const executeTransaction = async (contractAddress: string, msg: object) => {
    if (!isConnected || !address || !controller) {
      setError("Wallet non connecté");
      return false;
    }
    
    setIsProcessing(true);
    setError(null);
    setTxHash(null);

    try {
      const walletService = new WalletService(controller);
      const hash = await walletService.executeTransaction(contractAddress, msg);
      
      setTxHash(hash);
      return true;
    } catch (err: any) {
      console.error("Erreur Transaction:", err);
      setError(err.message || "La transaction a échoué.");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['dfcData', address] });
  };

  const claimRewards = async () => {
    const success = await executeTransaction(DFC_STAKING_CONTRACT, { claim_rewards: { receipt_address: address } });
    if (success) setTimeout(refreshData, 5000);
  };

  const claimFees = async () => {
    const success = await executeTransaction(DFC_STAKING_CONTRACT, { claim_fees: {} });
    if (success) setTimeout(refreshData, 5000);
  };

  const stakeDFC = async (amount: number) => {
    const amountInUdfc = Math.floor(amount * 1_000_000).toString();
    
    const allowanceMsg = { increase_allowance: { spender: DFC_STAKING_CONTRACT, amount: amountInUdfc, expires: { never: {} } } };
    const step1Success = await executeTransaction(DFC_TOKEN_CONTRACT, allowanceMsg);
    
    if (!step1Success) return;
    
    const stakeMsg = { stake: { amount: amountInUdfc } };
    const step2Success = await executeTransaction(DFC_STAKING_CONTRACT, stakeMsg);
    
    if (step2Success) setTimeout(refreshData, 5000);
  };

  const unstakeDFC = async (amount: number) => {
    const amountInUdfc = Math.floor(amount * 1_000_000).toString();
    const success = await executeTransaction(DFC_STAKING_CONTRACT, { unstake: { amount: amountInUdfc } });
    if (success) setTimeout(refreshData, 5000);
  };

  return { 
    dfcBalance: data?.dfcBalance || "0",
    stakedBalance: data?.stakedBalance || "0",
    pendingRewards: data?.pendingRewards || "0",
    pendingFees: data?.pendingFees || "0",
    isLoading,
    claimRewards, 
    claimFees, 
    stakeDFC, 
    unstakeDFC, 
    isProcessing, 
    txHash, 
    error 
  };
}
`;
fs.mkdirSync(path.dirname(useDfcPath), { recursive: true });
fs.writeFileSync(useDfcPath, useDfcContent, 'utf8');
console.log("✅ Fichier mis à jour: " + useDfcPath);

// 3. Mettre à jour l'import dans DashboardClient.tsx
const dashPath = 'src/features/dashboard/components/DashboardClient.tsx';
if (fs.existsSync(dashPath)) {
  let dashContent = fs.readFileSync(dashPath, 'utf8');
  // On remplace l'ancien import par le bon chemin
  dashContent = dashContent.replace("@/hooks/useDFC", "@/features/wallet/hooks/useDFC");
  fs.writeFileSync(dashPath, dashContent, 'utf8');
  console.log("✅ Import corrigé dans: " + dashPath);
} else {
  console.log("⚠️ DashboardClient.tsx introuvable, vérifie le chemin.");
}

// 4. Nettoyer l'ancien doublon dans src/hooks/useDFC.ts
const oldDfcPath = 'src/hooks/useDFC.ts';
if (fs.existsSync(oldDfcPath)) {
  fs.unlinkSync(oldDfcPath);
  console.log("🧹 Ancien fichier supprimé: " + oldDfcPath);
}

console.log("\n🎉 Réparation terminée ! Tu peux lancer 'npm run dev'.");