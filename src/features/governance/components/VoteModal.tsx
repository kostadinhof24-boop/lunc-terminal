'use client';
import { useState } from 'react';
import { X, Loader, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { WalletService } from '@/features/wallet/services/wallet.service';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/lib/translations';

export default function VoteModal({ proposalId, proposalTitle, onClose }) {
  const { address } = useWallet();
  const [option, setOption] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const lang = useLanguageStore((state) => state.lang);
  const t = useTranslation(lang);
  const options = [{ value: 1, label: t.governance.yes }, { value: 2, label: t.governance.abstain }, { value: 3, label: t.governance.no }, { value: 4, label: t.governance.noWithVeto }];
  const handleVote = async () => { if (!address) return; setIsProcessing(true); setError(null); setTxHash(null); try { const walletService = new WalletService(); const hash = await walletService.voteOnProposal(address, proposalId, option); setTxHash(hash); } catch (err) { setError(err.message); } finally { setIsProcessing(false); } };
  return (<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'><div className='glass-card rounded-3xl p-8 w-full max-w-md relative'><button onClick={onClose} className='absolute top-4 right-4 text-galaxy-gray hover:text-galaxy-white'><X className='w-6 h-6' /></button><h2 className='text-2xl font-bold mb-2'>{t.governance.voteTitle}</h2><p className='text-galaxy-gray text-sm mb-6'>#{proposalId} - {proposalTitle}</p><div className='mb-6 space-y-3'>{options.map((opt) => <button key={opt.value} onClick={() => setOption(opt.value)} className={`w-full px-4 py-3 rounded-xl border font-bold flex items-center gap-3 transition-all ${option === opt.value ? 'bg-galaxy-blue/20 border-galaxy-blue text-galaxy-white' : 'bg-space-bg/50 border-white/10 text-galaxy-gray'}`}><div className={`w-4 h-4 rounded-full border-2 ${option === opt.value ? 'bg-galaxy-blue border-galaxy-blue' : 'border-galaxy-gray'}`}></div>{opt.label}</button>)}</div>{txHash && <div className='mb-4 bg-galaxy-green/10 border border-galaxy-green/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-green'><CheckCircle2 className='w-5 h-5' /><p className='text-sm'>Hash: {txHash.slice(0, 20)}...</p></div>}{error && <div className='mb-4 bg-galaxy-red/10 border border-galaxy-red/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-red'><AlertCircle className='w-5 h-5' /><p className='text-sm'>{error}</p></div>}<button onClick={handleVote} disabled={isProcessing} className='w-full px-4 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 bg-galaxy-blue/20 text-galaxy-blue border border-galaxy-blue/30 hover:bg-galaxy-blue/30 disabled:opacity-50'>{isProcessing ? <Loader className='w-5 h-5 animate-spin' /> : t.governance.confirm}</button></div></div>);
}