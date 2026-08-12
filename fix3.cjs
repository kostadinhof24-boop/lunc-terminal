const fs = require('fs');

const content = `'use client';
import { useWallet as useTerraWallet } from '@terra-money/wallet-kit';
import { useMemo } from 'react';

export function useWallet() {
  const w = useTerraWallet();

  return useMemo(() => ({
    // Le controller est l'objet retourné par le hook, il contient la méthode post()
    controller: w,
    connected: w.connectedWallet,
    status: w.status,
    availableWallets: w.availableWallets,
    // Correction ici : la librairie utilise connect() et disconnect()
    connect: w.connect,
    disconnect: w.disconnect,
    isConnected: w.status === 'CONNECTED',
    address: w.connectedWallet?.addresses ? Object.values(w.connectedWallet.addresses)[0] : null,
  }), [w]);
}`;

fs.writeFileSync('src/features/wallet/hooks/useWallet.ts', content, 'utf8');
console.log('✅ Hook useWallet.ts corrigé avec succès !');