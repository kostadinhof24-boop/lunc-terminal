const fs = require('fs');
const path = require('path');

const wpcPath = 'src/features/wallet/components/WalletProviderClient.tsx';
const provPath = 'src/app/providers.tsx';

const wpcContent = `'use client';
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
}`;

const provContent = `'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';
import dynamic from 'next/dynamic';

const WalletProviderClient = dynamic(() => import('@/features/wallet/components/WalletProviderClient'), { ssr: false });

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProviderClient>{children}</WalletProviderClient>
    </QueryClientProvider>
  );
}`;

fs.mkdirSync(path.dirname(wpcPath), { recursive: true });
fs.writeFileSync(wpcPath, wpcContent, 'utf8');
console.log('✅ Fixé : ' + wpcPath);

fs.writeFileSync(provPath, provContent, 'utf8');
console.log('✅ Fixé : ' + provPath);