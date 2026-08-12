const fs = require('fs');

const content = `'use client';
import * as WalletKit from '@terra-money/wallet-kit';
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
  const wallets = [
    // @ts-ignore
    new WalletKit.KeplrWallet(),
    // @ts-ignore
    new WalletKit.LeapWallet()
  ];

  return (
    // @ts-ignore
    <WalletKit.WalletProvider wallets={wallets} defaultNetworks={networksConfig}>
      {children}
    </WalletKit.WalletProvider>
  );
}`;

fs.writeFileSync('src/features/wallet/components/WalletProviderClient.tsx', content, 'utf8');
console.log('✅ Provider corrigé avec l\'import dynamique !');