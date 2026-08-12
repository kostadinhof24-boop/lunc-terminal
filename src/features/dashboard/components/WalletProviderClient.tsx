'use client';
import { WalletProvider } from '@terra-money/wallet-kit';
import { ReactNode } from 'react';
import { TERRA_CLASSIC_CONFIG } from '@/config/chains';

// @ts-ignore
const networksConfig = {
  [TERRA_CLASSIC_CONFIG.chainId]: {
    chainID: TERRA_CLASSIC_CONFIG.chainId,
    lcd: TERRA_CLASSIC_CONFIG.lcdUrl,
    gasAdjustment: '1.5',
    gasPrices: '0.15uluna',
    prefix: 'terra',
    isClassic: true,
  },
};

export default function WalletProviderClient({ children }: { children: ReactNode }) {
  return (
    // @ts-ignore
    <WalletProvider defaultNetworks={networksConfig}>
      {children}
    </WalletProvider>
  );
}