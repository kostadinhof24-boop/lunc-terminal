const fs = require('fs');

const content = `'use client';
import { WalletProvider } from '@terra-money/wallet-kit';
import { ReactNode, useState, useEffect } from 'react';
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
  const [wallets, setWallets] = useState<any[]>([]);

  useEffect(() => {
    // Import dynamique pour contourner le bug de compilation de Turbopack
    import('@terra-money/wallet-kit').then((module) => {
      try {
        if (module.KeplrWallet && module.LeapWallet) {
          setWallets([new module.KeplrWallet(), new module.LeapWallet()]);
        }
      } catch (e) {
        console.error("Erreur chargement wallets:", e);
      }
    });
  }, []);

  if (wallets.length === 0) {
    return <>{children}</>;
  }

  return (
    // @ts-ignore
    <WalletProvider wallets={wallets} defaultNetworks={networksConfig}>
      {children}
    </WalletProvider>
  );
}`;

fs.writeFileSync('src/features/wallet/components/WalletProviderClient.tsx', content, 'utf8');
console.log('✅ Provider corrigé avec l\'import dynamique des wallets !');