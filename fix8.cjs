const fs = require('fs');

// 1. Création du WalletProvider Contextuel (sans @terra-money/wallet-kit)
const wpcContent = `'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TERRA_CLASSIC_CONFIG } from '@/config/chains';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
});

export function useWalletContext() {
  return useContext(WalletContext);
}

export default function WalletProviderClient({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('keplr_address');
    if (saved) setAddress(saved);
  }, []);

  const connect = async () => {
    try {
      const w = window as any;
      if (!w.keplr) {
        alert("Veuillez installer l'extension Keplr.");
        return;
      }
      await w.keplr.enable(TERRA_CLASSIC_CONFIG.chainId);
      const offlineSigner = w.keplr.getOfflineSigner(TERRA_CLASSIC_CONFIG.chainId);
      const accounts = await offlineSigner.getAccounts();
      setAddress(accounts[0].address);
      localStorage.setItem('keplr_address', accounts[0].address);
    } catch (e) {
      console.error("Erreur de connexion Keplr:", e);
    }
  };

  const disconnect = () => {
    setAddress(null);
    localStorage.removeItem('keplr_address');
  };

  return (
    <WalletContext.Provider value={{ address, isConnected: !!address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}`;
fs.writeFileSync('src/features/wallet/components/WalletProviderClient.tsx', wpcContent, 'utf8');
console.log('✅ WalletProviderClient.tsx (Context pur) créé !');

// 2. Mise à jour de useWallet.ts pour utiliser notre contexte
const useWalletContent = `'use client';
import { useWalletContext } from '@/features/wallet/components/WalletProviderClient';

export function useWallet() {
  const ctx = useWalletContext();
  return {
    address: ctx.address,
    isConnected: ctx.isConnected,
    connect: ctx.connect,
    disconnect: ctx.disconnect,
    // On met des valeurs nulles pour controller/connected car on utilise plus wallet-kit
    controller: null,
    connected: null,
  };
}`;
fs.writeFileSync('src/features/wallet/hooks/useWallet.ts', useWalletContent, 'utf8');
console.log('✅ useWallet.ts mis à jour !');

// 3. Mise à jour de ConnectWalletButton.tsx
const btnContent = `'use client';
import { useWallet } from '../hooks/useWallet';
import { Wallet, LogOut } from 'lucide-react';

export default function ConnectWalletButton() {
  const { address, isConnected, connect, disconnect } = useWallet();

  if (isConnected && address) {
    const shortAddress = \`\${address.slice(0, 6)}...\${address.slice(-4)}\`;
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 bg-galaxy-blue/10 border border-galaxy-blue/30 px-4 py-2 rounded-xl text-sm font-bold text-galaxy-blue">
          <Wallet className="w-4 h-4" /> {shortAddress}
        </div>
        <button onClick={disconnect} className="bg-galaxy-red/20 hover:bg-galaxy-red/40 text-galaxy-red px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>
    );
  }

  return (
    <button onClick={connect} className="btn-premium px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
      <Wallet className="w-4 h-4" /> Connect Wallet
    </button>
  );
}`;
fs.writeFileSync('src/features/wallet/components/ConnectWalletButton.tsx', btnContent, 'utf8');
console.log('✅ ConnectWalletButton.tsx mis à jour !');

// 4. Mise à jour de wallet.service.ts pour utiliser SigningCosmWasmClient
const wsContent = `import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { TERRA_CLASSIC_CONFIG } from '@/config/chains';

export class WalletService {
  async executeTransaction(address: string, contractAddress: string, msg: object) {
    const w = window as any;
    if (!w.keplr) throw new Error('Keplr non installé');
    
    await w.keplr.enable(TERRA_CLASSIC_CONFIG.chainId);
    const offlineSigner = w.keplr.getOfflineSigner(TERRA_CLASSIC_CONFIG.chainId);
    const client = await SigningCosmWasmClient.connectWithSigner(TERRA_CLASSIC_CONFIG.rpcUrl, offlineSigner);
    
    const fee = { amount: [{ denom: 'uluna', amount: '300000' }], gas: '1500000' };
    const result = await client.execute(address, contractAddress, msg, fee, 'LUNC Terminal');
    return result.transactionHash;
  }
}`;
fs.writeFileSync('src/features/wallet/services/wallet.service.ts', wsContent, 'utf8');
console.log('✅ wallet.service.ts mis à jour !');

// 5. Mise à jour de useDFC.ts pour s'adapter au nouveau service
const useDfcContent = `'use client';
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
}`;
fs.writeFileSync('src/features/wallet/hooks/useDFC.ts', useDfcContent, 'utf8');
console.log('✅ useDFC.ts mis à jour !');