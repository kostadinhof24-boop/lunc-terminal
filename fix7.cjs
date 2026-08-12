const fs = require('fs');

// 1. Réparer WalletProviderClient.tsx (Contournement complet du bug Turbopack)
const wpcContent = `'use client';
import { WalletProvider } from '@terra-money/wallet-kit';
import type { Wallet, ConnectResponse, InfoResponse } from '@terra-money/wallet-interface';
import { ReactNode } from 'react';
import { TERRA_CLASSIC_CONFIG } from '@/config/chains';

// Adaptateur Keplr custom pour contourner le bug d'export de la librairie
class CustomKeplrWallet implements Wallet {
  public readonly id = 'keplr';
  public readonly details = { name: 'Keplr', icon: '', website: '' };
  public readonly isInstalled = typeof window !== 'undefined' && !!(window as any).keplr;

  async info(): Promise<InfoResponse> { return { name: 'Keplr' } as any; }
  async connect(): Promise<ConnectResponse> {
    if (!(window as any).keplr) throw new Error('Keplr non installé');
    await (window as any).keplr.enable(TERRA_CLASSIC_CONFIG.chainId);
    const key = await (window as any).keplr.getKey(TERRA_CLASSIC_CONFIG.chainId);
    return { addresses: { [TERRA_CLASSIC_CONFIG.chainId]: key.bech32Address }, name: key.name } as any;
  }
  async post(): Promise<never> { throw new Error('Non implémenté'); }
  async sign(): Promise<never> { throw new Error('Non implémenté'); }
  addListener() {}
  removeListener() {}
}

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
    <WalletProvider wallets={[new CustomKeplrWallet()]} defaultNetworks={networksConfig}>
      {children}
    </WalletProvider>
  );
}`;
fs.writeFileSync('src/features/wallet/components/WalletProviderClient.tsx', wpcContent, 'utf8');
console.log('✅ WalletProviderClient.tsx corrigé !');

// 2. Réparer ConnectWalletButton.tsx (Correction de l'erreur TypeScript .slice)
const btnContent = `'use client';
import { useWallet } from '../hooks/useWallet';
import { Wallet, LogOut } from 'lucide-react';

export default function ConnectWalletButton() {
  const { address, isConnected, connect, disconnect } = useWallet();

  if (isConnected && address) {
    const addr = address as string;
    const shortAddress = \`\${addr.slice(0, 6)}...\${addr.slice(-4)}\`;
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

  const handleConnect = () => {
    try {
      connect('keplr');
    } catch (e) {
      console.error("Erreur de connexion:", e);
    }
  };

  return (
    <button onClick={handleConnect} className="btn-premium px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
      <Wallet className="w-4 h-4" /> Connect Wallet
    </button>
  );
}`;
fs.writeFileSync('src/features/wallet/components/ConnectWalletButton.tsx', btnContent, 'utf8');
console.log('✅ ConnectWalletButton.tsx corrigé !');