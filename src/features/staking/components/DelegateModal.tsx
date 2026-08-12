'use client';
import { useState } from 'react';
import { X, Loader, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { WalletService } from '@/features/wallet/services/wallet.service';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/lib/translations';

export default function DelegateModal({ validatorAddress, validatorName, onClose }) {
  const { address } = useWallet();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const lang = useLanguageStore((state) => state.lang);
  const t = useTranslation(lang);
  const handleDelegate = async () => { if (!address || !amount) return; setIsProcessing(true); setError(null); setTxHash(null); try { const walletService = new WalletService(); const hash = await walletService.delegateTokens(address, validatorAddress, Math.floor(parseFloat(amount) * 1000000).toString()); setTxHash(hash); } catch (err) { setError(err.message); } finally { setIsProcessing(false); } };
  return (<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'><div className='glass-card rounded-3xl p-8 w-full max-w-md relative'><button onClick={onClose} className='absolute top-4 right-4 text-galaxy-gray hover:text-galaxy-white'><X className='w-6 h-6' /></button><h2 className='text-2xl font-bold mb-2'>{t.validators.delegateTitle}</h2><p className='text-galaxy-gray text-sm mb-6'>{validatorName}</p><div className='mb-6'><label className='text-galaxy-gray text-sm mb-2 block'>{t.validators.delegateAmount}</label><input type='number' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='0.00' className='bg-space-bg border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-galaxy-blue text-lg font-bold' /></div>{txHash && <div className='mb-4 bg-galaxy-green/10 border border-galaxy-green/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-green'><CheckCircle2 className='w-5 h-5' /><p className='text-sm'>Hash: {txHash.slice(0, 20)}...</p></div>}{error && <div className='mb-4 bg-galaxy-red/10 border border-galaxy-red/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-red'><AlertCircle className='w-5 h-5' /><p className='text-sm'>{error}</p></div>}<button onClick={handleDelegate} disabled={isProcessing || !amount} className='w-full px-4 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 bg-galaxy-blue/20 text-galaxy-blue border border-galaxy-blue/30 hover:bg-galaxy-blue/30 disabled:opacity-50'>{isProcessing ? <Loader className='w-5 h-5 animate-spin' /> : t.validators.confirm}</button></div></div>);
}