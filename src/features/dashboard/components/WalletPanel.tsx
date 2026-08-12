import { Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/lib/translations';

interface WalletPanelProps { address: string | null; dfcBalance: string; stakedBalance: string; pendingRewards: string; pendingFees: string; isProcessing: boolean; txHash: string | null; txError: string | null; onClaimRewards: () => void; onClaimFees: () => void; }

export default function WalletPanel({ address, dfcBalance, stakedBalance, pendingRewards, pendingFees, isProcessing, txHash, txError, onClaimRewards, onClaimFees }: WalletPanelProps) {
  const { isExpertMode } = useSettingsStore();
  const lang = useLanguageStore((state) => state.lang);
  const t = useTranslation(lang);
  return (
    <div className='glass-card rounded-3xl p-8'>
      <h2 className='text-xl font-bold mb-6 flex items-center gap-3'><Wallet className='w-6 h-6 text-terra-yellow' /> {t.dfc.walletTitle}</h2>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-space-bg/50 p-6 rounded-2xl'><p className='text-galaxy-gray text-xs uppercase tracking-wider mb-2'>{t.dfc.dfcAvail}</p><p className='text-2xl font-bold text-terra-yellow'>{dfcBalance}</p></div>
        <div className='bg-space-bg/50 p-6 rounded-2xl'><p className='text-galaxy-gray text-xs uppercase tracking-wider mb-2'>{t.dfc.dfcStaked}</p><p className='text-2xl font-bold text-galaxy-blue'>{stakedBalance}</p></div>
        <div className='bg-space-bg/50 p-6 rounded-2xl flex flex-col justify-between'>
          <div className='flex justify-between mb-4'><div><p className='text-galaxy-gray text-xs uppercase tracking-wider mb-1'>{t.dfc.rewardsDfc}</p><p className='text-xl font-bold text-galaxy-green'>{pendingRewards}</p></div><div className='text-right'><p className='text-galaxy-gray text-xs uppercase tracking-wider mb-1'>{t.dfc.rewardsUstc}</p><p className='text-xl font-bold text-galaxy-blue'>{pendingFees}</p></div></div>
          <div className='flex gap-2'><button onClick={onClaimRewards} disabled={isProcessing || pendingRewards === '0'} className={`btn-premium flex-1 px-4 py-2 rounded-xl text-sm font-bold ${isProcessing || pendingRewards === '0' ? 'opacity-50 cursor-not-allowed' : ''}`}>{isProcessing ? '...' : t.dfc.claimDfc}</button><button onClick={onClaimFees} disabled={isProcessing || pendingFees === '0'} className={`bg-galaxy-blue/20 text-galaxy-blue border border-galaxy-blue/30 flex-1 px-4 py-2 rounded-xl text-sm font-bold hover:bg-galaxy-blue/30 ${isProcessing || pendingFees === '0' ? 'opacity-50 cursor-not-allowed' : ''}`}>{isProcessing ? '...' : t.dfc.claimUstc}</button></div>
        </div>
        <div className='bg-space-bg/50 p-6 rounded-2xl flex flex-col justify-center items-center text-center'><p className='text-galaxy-gray text-xs uppercase tracking-wider mb-2'>{t.dfc.address}</p>{isExpertMode ? <p className='font-mono text-xs text-galaxy-white break-all'>{address}</p> : <p className='font-mono text-sm text-galaxy-white'>{address ? `${address.slice(0, 10)}...${address.slice(-6)}` : ''}</p>}</div>
      </div>
      {txHash && <div className='mt-6 bg-galaxy-green/10 border border-galaxy-green/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-green'><CheckCircle2 className='w-5 h-5 flex-shrink-0' /><p className='text-sm'>Hash: {txHash.slice(0, 20)}...</p></div>}
      {txError && <div className='mt-6 bg-galaxy-red/10 border border-galaxy-red/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-red'><AlertCircle className='w-5 h-5 flex-shrink-0' /><p className='text-sm'>{txError}</p></div>}
    </div>
  );
}