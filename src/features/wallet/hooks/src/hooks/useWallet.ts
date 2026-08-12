// src/features/wallet/hooks/useWallet.ts
'use client';

import { useWallet as useTerraWallet } from '@terra-money/wallet-kit';
import { useMemo } from 'react';

export function useWallet() {
  const {
    walletController,
    status,
    availableWallets,
    connectWallet,
    disconnectWallet,
    isConnected,
    address,
    connectedWallet,
  } = useTerraWallet();

  // On expose une API propre et minimaliste au reste de l'application
  return useMemo(() => ({
    controller: walletController,
    status,
    availableWallets,
    connect: connectWallet,
    disconnect: disconnectWallet,
    isConnected,
    address: address || null,
    walletName: connectedWallet?.name || null,
  }), [walletController, status, availableWallets, connectWallet, disconnectWallet, isConnected, address, connectedWallet]);
}