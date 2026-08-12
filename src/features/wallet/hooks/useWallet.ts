'use client';
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
}