'use client';
import { useStaking } from '../hooks/useStaking';
import { Loader, ShieldCheck, ExternalLink, Users } from 'lucide-react';
import { useState } from 'react';
import { Validator } from '../services/staking.service';
import DelegateModal from './DelegateModal';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/lib/translations';

export default function ValidatorsList() {
  const { validators, apr, isLoadingValidators } = useStaking();
  const [search, setSearch] = useState('');
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
  const lang = useLanguageStore((state) => state.lang);
  const t = useTranslation(lang);
  const filteredValidators = validators.filter((v) => v.description.moniker.toLowerCase().includes(search.toLowerCase()));
  const totalVotingPower = validators.reduce((sum, v) => sum + parseFloat(v.tokens), 0);
  return (
    <div className='glass-card rounded-3xl p-8'><div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'><div><h2 className='text-2xl font-bold flex items-center gap-3'><ShieldCheck className='w-7 h-7 text-galaxy-blue' /> {t.validators.listTitle}</h2><p className='text-galaxy-gray text-sm mt-1'>{validators.length} {t.validators.activeSub}</p></div><div className='bg-galaxy-green/10 border border-galaxy-green/30 px-4 py-2 rounded-xl text-sm font-bold text-galaxy-green'>{t.validators.search.includes('APR') ? '' : 'APR'} {apr.toFixed(2)}%</div></div><div className='mb-6'><input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.validators.search} className='bg-space-bg border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-galaxy-blue' /></div>{isLoadingValidators ? <div className='flex justify-center py-12'><Loader className='w-8 h-8 animate-spin text-galaxy-blue' /></div> : <div className='space-y-3 max-h-[600px] overflow-y-auto pr-2'>{filteredValidators.map((val) => { const votingPower = (parseFloat(val.tokens) / totalVotingPower) * 100; const commission = parseFloat(val.commission.commission_rates.rate) * 100; return (<div key={val.operator_address} className='bg-space-bg/50 p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-4 hover:border-galaxy-blue/50 border border-transparent transition-all'><div className='flex items-center gap-4'><div className='w-10 h-10 rounded-full bg-galaxy-blue/20 flex items-center justify-center font-bold text-galaxy-blue'>{val.description.moniker.charAt(0)}</div><div><h3 className='font-bold text-galaxy-white'>{val.description.moniker}</h3><p className='text-xs text-galaxy-gray-muted font-mono'>{val.operator_address.slice(0, 20)}...</p></div></div><div className='flex items-center gap-6 text-sm'><div className='text-right'><p className='text-galaxy-gray text-xs'>{t.validators.commission}</p><p className='font-bold text-galaxy-white'>{commission.toFixed(1)}%</p></div><div className='text-right'><p className='text-galaxy-gray text-xs'>{t.validators.power}</p><p className='font-bold text-galaxy-blue flex items-center gap-1'><Users className='w-3 h-3' /> {votingPower.toFixed(2)}%</p></div><button onClick={() => setSelectedValidator(val)} className='bg-galaxy-blue/20 text-galaxy-blue px-4 py-2 rounded-xl font-bold text-sm hover:bg-galaxy-blue/30 flex items-center gap-2'>{t.validators.delegate} <ExternalLink className='w-3 h-3' /></button></div></div>); })}</div>}{selectedValidator && <DelegateModal validatorAddress={selectedValidator.operator_address} validatorName={selectedValidator.description.moniker} onClose={() => setSelectedValidator(null)} />}</div>
  );
}