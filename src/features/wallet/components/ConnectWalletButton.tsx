'use client';
import { useWallet } from '../hooks/useWallet';
import { Wallet, LogOut } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/lib/translations';

export default function ConnectWalletButton() {
  const { address, isConnected, connect, disconnect } = useWallet();
  const lang = useLanguageStore((state) => state.lang);
  const t = useTranslation(lang);

  if (isConnected && address) {
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    return (
      <div className='flex items-center gap-2'>
        <div className='hidden md:flex items-center gap-2 bg-galaxy-blue/10 border border-galaxy-blue/30 px-4 py-2 rounded-xl text-sm font-bold text-galaxy-blue'>
          <Wallet className='w-4 h-4' /> {shortAddress}
        </div>
        <button onClick={disconnect} className='bg-galaxy-red/20 hover:bg-galaxy-red/40 text-galaxy-red px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2'>
          <LogOut className='w-4 h-4' /> {t.wallet.disconnect}
        </button>
      </div>
    );
  }

  return (
    <button onClick={connect} className='btn-premium px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2'>
      <Wallet className='w-4 h-4' /> {t.wallet.connect}
    </button>
  );
}