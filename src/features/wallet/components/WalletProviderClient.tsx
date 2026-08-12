'use client';
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
}