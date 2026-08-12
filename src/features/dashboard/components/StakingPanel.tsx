import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/lib/translations';

interface StakingPanelProps { dfcBalance: string; stakedBalance: string; isProcessing: boolean; onStake: (amount: number) => void; onUnstake: (amount: number) => void; }

export default function StakingPanel({ dfcBalance, stakedBalance, isProcessing, onStake, onUnstake }: StakingPanelProps) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const lang = useLanguageStore((state) => state.lang);
  const t = useTranslation(lang);
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div className='glass-card rounded-3xl p-8'><h3 className='text-lg font-bold mb-4 flex items-center gap-3'><Lock className='w-6 h-6 text-terra-yellow' /> {t.dfc.stakeTitle}</h3><div className='space-y-4'><div><label className='text-galaxy-gray text-sm mb-2 block'>{t.dfc.stakeAmount} ({dfcBalance})</label><div className='flex gap-2'><input type='number' value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} placeholder='0.00' className='bg-space-bg border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-terra-yellow' /><button onClick={() => setStakeAmount(dfcBalance)} className='bg-galaxy-blue/20 text-galaxy-blue px-4 rounded-xl font-bold text-sm'>{t.dfc.max}</button></div></div><button onClick={() => onStake(parseFloat(stakeAmount))} disabled={isProcessing || !stakeAmount} className={`btn-premium w-full px-4 py-3 rounded-xl text-sm font-bold ${isProcessing || !stakeAmount ? 'opacity-50 cursor-not-allowed' : ''}`}>{isProcessing ? '...' : t.dfc.stakeBtn}</button></div></div>
      <div className='glass-card rounded-3xl p-8'><h3 className='text-lg font-bold mb-4 flex items-center gap-3'><Unlock className='w-6 h-6 text-galaxy-red' /> {t.dfc.unstakeTitle}</h3><div className='space-y-4'><div><label className='text-galaxy-gray text-sm mb-2 block'>{t.dfc.unstakeAmount} ({stakedBalance})</label><div className='flex gap-2'><input type='number' value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)} placeholder='0.00' className='bg-space-bg border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-galaxy-red' /><button onClick={() => setUnstakeAmount(stakedBalance)} className='bg-galaxy-blue/20 text-galaxy-blue px-4 rounded-xl font-bold text-sm'>{t.dfc.max}</button></div></div><button onClick={() => onUnstake(parseFloat(unstakeAmount))} disabled={isProcessing || !unstakeAmount} className={`bg-galaxy-red/20 text-galaxy-red border border-galaxy-red/30 w-full px-4 py-3 rounded-xl text-sm font-bold hover:bg-galaxy-red/30 ${isProcessing || !unstakeAmount ? 'opacity-50 cursor-not-allowed' : ''}`}>{isProcessing ? '...' : t.dfc.unstakeBtn}</button></div></div>
    </div>
  );
}