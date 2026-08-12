const fs = require('fs');
const path = require('path');

const w = (p, lines) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const content = lines.join('\n');
  fs.writeFileSync(p, content, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Traduction de l'intégralité du site...");

// 1. Dictionnaire complet
w('src/lib/translations.ts', [
  "import { Language } from '@/store/languageStore';",
  "",
  "export const translations = {",
  "  fr: {",
  "    nav: { dashboard: 'Dashboard', dfc: 'DFC Hub', burn: 'Burn', validators: 'Validators', governance: 'Governance', news: 'News', settings: 'Settings' },",
  "    wallet: { connect: 'Connect Wallet', disconnect: 'Déconnexion' },",
  "    dashboard: { title: 'Network Dashboard', subtitle: 'Analyse en temps réel de l\\'écosystème Terra Classic.' },",
  "    stats: { totalSupply: 'Total Supply', staked: 'Staked', validators: 'Validators', communityPool: 'Community Pool', price: 'Prix LUNC', marketCap: 'Market Cap', supplySub: 'LUNC', stakedSub: 'de la supply', validatorsSub: 'Actifs', poolSub: 'Fonds communautaires', liveSub: 'Live' },",
  "    analytics: { votingPower: 'Répartition du Voting Power', tokenomics: 'Tokenomie LUNC (en Milliards)' },",
  "    dfc: { title: 'DFLunc Protocol Hub', subtitle: 'Gérez votre DFC, vos rewards et votre staking DFLunc.', walletTitle: 'Portefeuille & Rewards', dfcAvail: 'DFC Disponible', dfcStaked: 'DFC Staké', rewardsDfc: 'Rewards DFC', rewardsUstc: 'Rewards USTC', claimDfc: 'Claim DFC', claimUstc: 'Claim USTC', address: 'Adresse', stakeTitle: 'Staker mes DFC', stakeAmount: 'Montant à Staker', unstakeTitle: 'Unstaker mes DFC', unstakeAmount: 'Montant à Unstaker', max: 'MAX', stakeBtn: 'Staker', unstakeBtn: 'Unstaker' },",
  "    burn: { title: 'DFLUNC Burn Terminal', subtitle: 'Brûlez votre LUNC pour mint du DFC et participer au Reward Pool.', burnTitle: 'Brûler du LUNC', burnAmount: 'Nombre de Batches à Brûler (1 Batch = 5,000 LUNC)', luncBurn: 'LUNC à Brûler', fee: 'Frais de Protocole', estDfc: 'DFC Estimés (Mint)', execute: 'Exécuter le Burn', howTitle: 'Comment ça marche ?', how1: 'Le montant de LUNC que vous envoyez est divisé en Batches de 5,000 LUNC.', how2: 'Le protocole brûle immédiatement ces LUNC (envoi à l\\'adresse de burn mort).', how3: 'En échange, le contrat mint des tokens DFC et vous les envoie.', how4: 'Vous pouvez ensuite staker ces DFC pour réclamer des récompenses en USTC.' },",
  "    validators: { title: 'Staking Terra Classic', subtitle: 'Déléguer votre LUNC pour sécuriser le réseau et gagner des récompenses.', listTitle: 'Validateurs Actifs', activeSub: 'sécurisent le réseau', search: 'Rechercher un validateur...', commission: 'Commission', power: 'Voting Power', delegate: 'Déléguer', delegateTitle: 'Déléguer du LUNC', delegateAmount: 'Montant à Déléguer (LUNC)', confirm: 'Confirmer la Délégation' },",
  "    governance: { title: 'Gouvernance Terra Classic', subtitle: 'Participez à l\\'avenir du réseau en votant sur les propositions.', listTitle: 'Propositions Actives', vote: 'Voter', voteTitle: 'Voter sur la Proposition', yes: 'Yes', abstain: 'Abstain', no: 'No', noWithVeto: 'No with Veto', confirm: 'Confirmer le Vote' },",
  "    news: { title: 'Actualités Terra Classic', subtitle: 'Les dernières nouvelles de l\\'écosystème agrégées en temps réel.', listTitle: 'Fil d\\'Actualité', readMore: 'Lire plus', empty: 'Aucune actualité disponible pour le moment.' },",
  "    settings: { title: 'Paramètres', subtitle: 'Personnalisez votre expérience LUNC Terminal.', expertTitle: 'Mode Expert', expertDescOn: 'Affiche les données techniques (adresses de contrats, denoms).', expertDescOff: 'Masque les données blockchain complexes.' }",
  "  },",
  "  en: {",
  "    nav: { dashboard: 'Dashboard', dfc: 'DFC Hub', burn: 'Burn', validators: 'Validators', governance: 'Governance', news: 'News', settings: 'Settings' },",
  "    wallet: { connect: 'Connect Wallet', disconnect: 'Disconnect' },",
  "    dashboard: { title: 'Network Dashboard', subtitle: 'Real-time analysis of the Terra Classic ecosystem.' },",
  "    stats: { totalSupply: 'Total Supply', staked: 'Staked', validators: 'Validators', communityPool: 'Community Pool', price: 'Price LUNC', marketCap: 'Market Cap', supplySub: 'LUNC', stakedSub: 'of supply', validatorsSub: 'Active', poolSub: 'Community funds', liveSub: 'Live' },",
  "    analytics: { votingPower: 'Voting Power Distribution', tokenomics: 'LUNC Tokenomics (in Billions)' },",
  "    dfc: { title: 'DFLunc Protocol Hub', subtitle: 'Manage your DFC, rewards and DFLunc staking.', walletTitle: 'Wallet & Rewards', dfcAvail: 'DFC Available', dfcStaked: 'DFC Staked', rewardsDfc: 'Rewards DFC', rewardsUstc: 'Rewards USTC', claimDfc: 'Claim DFC', claimUstc: 'Claim USTC', address: 'Address', stakeTitle: 'Stake my DFC', stakeAmount: 'Amount to Stake', unstakeTitle: 'Unstake my DFC', unstakeAmount: 'Amount to Unstake', max: 'MAX', stakeBtn: 'Stake', unstakeBtn: 'Unstake' },",
  "    burn: { title: 'DFLUNC Burn Terminal', subtitle: 'Burn your LUNC to mint DFC and join the Reward Pool.', burnTitle: 'Burn LUNC', burnAmount: 'Number of Batches to Burn (1 Batch = 5,000 LUNC)', luncBurn: 'LUNC to Burn', fee: 'Protocol Fee', estDfc: 'Estimated DFC (Mint)', execute: 'Execute Burn', howTitle: 'How it works', how1: 'The LUNC amount sent is divided into Batches of 5,000 LUNC.', how2: 'The protocol immediately burns these LUNC (sent to a dead address).', how3: 'In exchange, the contract mints DFC tokens and sends them to you.', how4: 'You can then stake these DFC to claim USTC rewards.' },",
  "    validators: { title: 'Terra Classic Staking', subtitle: 'Delegate your LUNC to secure the network and earn rewards.', listTitle: 'Active Validators', activeSub: 'secure the network', search: 'Search a validator...', commission: 'Commission', power: 'Voting Power', delegate: 'Delegate', delegateTitle: 'Delegate LUNC', delegateAmount: 'Amount to Delegate (LUNC)', confirm: 'Confirm Delegation' },",
  "    governance: { title: 'Terra Classic Governance', subtitle: 'Participate in the network future by voting on proposals.', listTitle: 'Active Proposals', vote: 'Vote', voteTitle: 'Vote on Proposal', yes: 'Yes', abstain: 'Abstain', no: 'No', noWithVeto: 'No with Veto', confirm: 'Confirm Vote' },",
  "    news: { title: 'Terra Classic News', subtitle: 'Latest ecosystem news aggregated in real-time.', listTitle: 'News Feed', readMore: 'Read more', empty: 'No news available at the moment.' },",
  "    settings: { title: 'Settings', subtitle: 'Customize your LUNC Terminal experience.', expertTitle: 'Expert Mode', expertDescOn: 'Shows technical data (contract addresses, denoms).', expertDescOff: 'Hides complex blockchain data.' }",
  "  },",
  "  zh: {",
  "    nav: { dashboard: '仪表盘', dfc: 'DFC中心', burn: '销毁', validators: '验证节点', governance: '治理', news: '新闻', settings: '设置' },",
  "    wallet: { connect: '连接钱包', disconnect: '断开连接' },",
  "    dashboard: { title: '网络仪表盘', subtitle: 'Terra Classic 生态系统的实时分析。' },",
  "    stats: { totalSupply: '总供应量', staked: '质押量', validators: '验证节点', communityPool: '社区池', price: 'LUNC 价格', marketCap: '市值', supplySub: 'LUNC', stakedSub: '占总供应', validatorsSub: '活跃', poolSub: '社区资金', liveSub: '实时' },",
  "    analytics: { votingPower: '投票权分布', tokenomics: 'LUNC 代币经济学（十亿）' },",
  "    dfc: { title: 'DFLunc 协议中心', subtitle: '管理您的 DFC、奖励和 DFLunc 质押。', walletTitle: '钱包与奖励', dfcAvail: '可用 DFC', dfcStaked: '已质押 DFC', rewardsDfc: 'DFC 奖励', rewardsUstc: 'USTC 奖励', claimDfc: '领取 DFC', claimUstc: '领取 USTC', address: '地址', stakeTitle: '质押我的 DFC', stakeAmount: '质押数量', unstakeTitle: '解除质押我的 DFC', unstakeAmount: '解除质押数量', max: '最大', stakeBtn: '质押', unstakeBtn: '解除质押' },",
  "    burn: { title: 'DFLUNC 销毁终端', subtitle: '销毁您的 LUNC 以铸造 DFC 并加入奖励池。', burnTitle: '销毁 LUNC', burnAmount: '要销毁的批次数（1批 = 5,000 LUNC）', luncBurn: '要销毁的 LUNC', fee: '协议费用', estDfc: '预计 DFC (铸造)', execute: '执行销毁', howTitle: '运作方式', how1: '发送的 LUNC 数量被分为 5,000 LUNC 一批。', how2: '协议立即销毁这些 LUNC（发送至死地址）。', how3: '作为交换，合约铸造 DFC 代币并发送给您。', how4: '然后您可以质押这些 DFC 以领取 USTC 奖励。' },",
  "    validators: { title: 'Terra Classic 质押', subtitle: '委托您的 LUNC 以保护网络并赚取奖励。', listTitle: '活跃验证节点', activeSub: '保护网络安全', search: '搜索验证节点...', commission: '佣金', power: '投票权', delegate: '委托', delegateTitle: '委托 LUNC', delegateAmount: '委托数量 (LUNC)', confirm: '确认委托' },",
  "    governance: { title: 'Terra Classic 治理', subtitle: '通过对提案投票参与网络的未来。', listTitle: '活跃提案', vote: '投票', voteTitle: '对提案投票', yes: '赞成', abstain: '弃权', no: '反对', noWithVeto: '反对并否决', confirm: '确认投票' },",
  "    news: { title: 'Terra Classic 新闻', subtitle: '实时聚合的最新生态系统新闻。', listTitle: '新闻流', readMore: '阅读更多', empty: '暂无新闻。' },",
  "    settings: { title: '设置', subtitle: '自定义您的 LUNC 终端体验。', expertTitle: '专家模式', expertDescOn: '显示技术数据（合约地址、代币标识）。', expertDescOff: '隐藏复杂的区块链数据。' }",
  "  }",
  "};",
  "",
  "export const useTranslation = (lang: Language) => {",
  "  return translations[lang];",
  "};"
]);

// 2. DFC Hub (WalletPanel + StakingPanel)
w('src/features/dashboard/components/WalletPanel.tsx', [
  "import { Wallet, CheckCircle2, AlertCircle } from 'lucide-react';",
  "import { useSettingsStore } from '@/store/settingsStore';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "",
  "interface WalletPanelProps { address: string | null; dfcBalance: string; stakedBalance: string; pendingRewards: string; pendingFees: string; isProcessing: boolean; txHash: string | null; txError: string | null; onClaimRewards: () => void; onClaimFees: () => void; }",
  "",
  "export default function WalletPanel({ address, dfcBalance, stakedBalance, pendingRewards, pendingFees, isProcessing, txHash, txError, onClaimRewards, onClaimFees }: WalletPanelProps) {",
  "  const { isExpertMode } = useSettingsStore();",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  return (",
  "    <div className='glass-card rounded-3xl p-8'>",
  "      <h2 className='text-xl font-bold mb-6 flex items-center gap-3'><Wallet className='w-6 h-6 text-terra-yellow' /> {t.dfc.walletTitle}</h2>",
  "      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>",
  "        <div className='bg-space-bg/50 p-6 rounded-2xl'><p className='text-galaxy-gray text-xs uppercase tracking-wider mb-2'>{t.dfc.dfcAvail}</p><p className='text-2xl font-bold text-terra-yellow'>{dfcBalance}</p></div>",
  "        <div className='bg-space-bg/50 p-6 rounded-2xl'><p className='text-galaxy-gray text-xs uppercase tracking-wider mb-2'>{t.dfc.dfcStaked}</p><p className='text-2xl font-bold text-galaxy-blue'>{stakedBalance}</p></div>",
  "        <div className='bg-space-bg/50 p-6 rounded-2xl flex flex-col justify-between'>",
  "          <div className='flex justify-between mb-4'><div><p className='text-galaxy-gray text-xs uppercase tracking-wider mb-1'>{t.dfc.rewardsDfc}</p><p className='text-xl font-bold text-galaxy-green'>{pendingRewards}</p></div><div className='text-right'><p className='text-galaxy-gray text-xs uppercase tracking-wider mb-1'>{t.dfc.rewardsUstc}</p><p className='text-xl font-bold text-galaxy-blue'>{pendingFees}</p></div></div>",
  "          <div className='flex gap-2'><button onClick={onClaimRewards} disabled={isProcessing || pendingRewards === '0'} className={`btn-premium flex-1 px-4 py-2 rounded-xl text-sm font-bold ${isProcessing || pendingRewards === '0' ? 'opacity-50 cursor-not-allowed' : ''}`}>{isProcessing ? '...' : t.dfc.claimDfc}</button><button onClick={onClaimFees} disabled={isProcessing || pendingFees === '0'} className={`bg-galaxy-blue/20 text-galaxy-blue border border-galaxy-blue/30 flex-1 px-4 py-2 rounded-xl text-sm font-bold hover:bg-galaxy-blue/30 ${isProcessing || pendingFees === '0' ? 'opacity-50 cursor-not-allowed' : ''}`}>{isProcessing ? '...' : t.dfc.claimUstc}</button></div>",
  "        </div>",
  "        <div className='bg-space-bg/50 p-6 rounded-2xl flex flex-col justify-center items-center text-center'><p className='text-galaxy-gray text-xs uppercase tracking-wider mb-2'>{t.dfc.address}</p>{isExpertMode ? <p className='font-mono text-xs text-galaxy-white break-all'>{address}</p> : <p className='font-mono text-sm text-galaxy-white'>{address ? `${address.slice(0, 10)}...${address.slice(-6)}` : ''}</p>}</div>",
  "      </div>",
  "      {txHash && <div className='mt-6 bg-galaxy-green/10 border border-galaxy-green/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-green'><CheckCircle2 className='w-5 h-5 flex-shrink-0' /><p className='text-sm'>Hash: {txHash.slice(0, 20)}...</p></div>}",
  "      {txError && <div className='mt-6 bg-galaxy-red/10 border border-galaxy-red/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-red'><AlertCircle className='w-5 h-5 flex-shrink-0' /><p className='text-sm'>{txError}</p></div>}",
  "    </div>",
  "  );",
  "}"
]);

w('src/features/dashboard/components/StakingPanel.tsx', [
  "import { useState } from 'react';",
  "import { Lock, Unlock } from 'lucide-react';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "",
  "interface StakingPanelProps { dfcBalance: string; stakedBalance: string; isProcessing: boolean; onStake: (amount: number) => void; onUnstake: (amount: number) => void; }",
  "",
  "export default function StakingPanel({ dfcBalance, stakedBalance, isProcessing, onStake, onUnstake }: StakingPanelProps) {",
  "  const [stakeAmount, setStakeAmount] = useState('');",
  "  const [unstakeAmount, setUnstakeAmount] = useState('');",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  return (",
  "    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>",
  "      <div className='glass-card rounded-3xl p-8'><h3 className='text-lg font-bold mb-4 flex items-center gap-3'><Lock className='w-6 h-6 text-terra-yellow' /> {t.dfc.stakeTitle}</h3><div className='space-y-4'><div><label className='text-galaxy-gray text-sm mb-2 block'>{t.dfc.stakeAmount} ({dfcBalance})</label><div className='flex gap-2'><input type='number' value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} placeholder='0.00' className='bg-space-bg border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-terra-yellow' /><button onClick={() => setStakeAmount(dfcBalance)} className='bg-galaxy-blue/20 text-galaxy-blue px-4 rounded-xl font-bold text-sm'>{t.dfc.max}</button></div></div><button onClick={() => onStake(parseFloat(stakeAmount))} disabled={isProcessing || !stakeAmount} className={`btn-premium w-full px-4 py-3 rounded-xl text-sm font-bold ${isProcessing || !stakeAmount ? 'opacity-50 cursor-not-allowed' : ''}`}>{isProcessing ? '...' : t.dfc.stakeBtn}</button></div></div>",
  "      <div className='glass-card rounded-3xl p-8'><h3 className='text-lg font-bold mb-4 flex items-center gap-3'><Unlock className='w-6 h-6 text-galaxy-red' /> {t.dfc.unstakeTitle}</h3><div className='space-y-4'><div><label className='text-galaxy-gray text-sm mb-2 block'>{t.dfc.unstakeAmount} ({stakedBalance})</label><div className='flex gap-2'><input type='number' value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)} placeholder='0.00' className='bg-space-bg border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-galaxy-red' /><button onClick={() => setUnstakeAmount(stakedBalance)} className='bg-galaxy-blue/20 text-galaxy-blue px-4 rounded-xl font-bold text-sm'>{t.dfc.max}</button></div></div><button onClick={() => onUnstake(parseFloat(unstakeAmount))} disabled={isProcessing || !unstakeAmount} className={`bg-galaxy-red/20 text-galaxy-red border border-galaxy-red/30 w-full px-4 py-3 rounded-xl text-sm font-bold hover:bg-galaxy-red/30 ${isProcessing || !unstakeAmount ? 'opacity-50 cursor-not-allowed' : ''}`}>{isProcessing ? '...' : t.dfc.unstakeBtn}</button></div></div>",
  "    </div>",
  "  );",
  "}"
]);

// 3. Burn Page
w('src/features/burn/components/BurnTracker.tsx', [
  "'use client';",
  "import { useState } from 'react';",
  "import { Flame, ArrowRight, AlertCircle, CheckCircle2, Loader } from 'lucide-react';",
  "import { useBurn } from '../hooks/useBurn';",
  "import { useWallet } from '@/features/wallet/hooks/useWallet';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "",
  "export default function BurnTracker() {",
  "  const { isConnected } = useWallet();",
  "  const { luncBalance, ustcBalance, executeBurn, isBurning, txHash, error, simulateBurn } = useBurn();",
  "  const [batchAmount, setBatchAmount] = useState('1');",
  "  const batches = parseInt(batchAmount, 10) || 0;",
  "  const simulation = simulateBurn(batches);",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  return (",
  "    <div className='glass-card rounded-3xl p-8'><h2 className='text-2xl font-bold mb-6 flex items-center gap-3'><Flame className='w-7 h-7 text-galaxy-red' /> {t.burn.burnTitle}</h2>{!isConnected ? <div className='text-center py-12'><p className='text-galaxy-gray text-lg'>Connect Wallet</p></div> : <><div className='mb-6'><label className='text-galaxy-gray text-sm mb-2 block'>{t.burn.burnAmount}</label><input type='number' value={batchAmount} onChange={(e) => setBatchAmount(e.target.value)} min='1' className='bg-space-bg border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-galaxy-red text-lg font-bold' /><div className='flex justify-between text-xs text-galaxy-gray-muted mt-2'><span>LUNC: {luncBalance}</span><span>USTC: {ustcBalance}</span></div></div><div className='bg-space-bg/50 p-6 rounded-2xl mb-6 space-y-3'><div className='flex justify-between items-center'><span className='text-galaxy-gray text-sm'>{t.burn.luncBurn}</span><span className='font-bold text-galaxy-white'>{simulation.luncRequired.toLocaleString()} LUNC</span></div><div className='flex justify-between items-center'><span className='text-galaxy-gray text-sm'>{t.burn.fee}</span><span className='font-bold text-galaxy-white'>{simulation.ustcRequired.toFixed(5)} USTC</span></div><div className='flex justify-between items-center border-t border-white/10 pt-3'><span className='text-galaxy-gray text-sm'>{t.burn.estDfc}</span><span className='font-bold text-terra-yellow flex items-center gap-2'>{simulation.estimatedDfc.toLocaleString()} DFC <ArrowRight className='w-4 h-4' /></span></div></div>{txHash && <div className='mb-6 bg-galaxy-green/10 border border-galaxy-green/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-green'><CheckCircle2 className='w-5 h-5 flex-shrink-0' /><p className='text-sm'>Hash: {txHash.slice(0, 20)}...</p></div>}{error && <div className='mb-6 bg-galaxy-red/10 border border-galaxy-red/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-red'><AlertCircle className='w-5 h-5 flex-shrink-0' /><p className='text-sm'>{error}</p></div>}<button onClick={() => executeBurn(batches)} disabled={isBurning || batches <= 0} className={`w-full px-4 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all ${isBurning || batches <= 0 ? 'bg-galaxy-red/20 text-galaxy-red/50 cursor-not-allowed' : 'bg-galaxy-red/20 text-galaxy-red border border-galaxy-red/30 hover:bg-galaxy-red/30'}`}>{isBurning ? <><Loader className='w-5 h-5 animate-spin' /> ...</> : <><Flame className='w-5 h-5' /> {t.burn.execute}</>}</button></>}</div>",
  "  );",
  "}"
]);

w('src/app/burn-tracker/page.tsx', [
  "\"use client\";",
  "import dynamic from 'next/dynamic';",
  "import { motion } from 'framer-motion';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "const BurnTracker = dynamic(() => import('@/features/burn/components/BurnTracker'), { ssr: false });",
  "export default function BurnPage() {",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  return (",
  "    <main className='min-h-screen relative container mx-auto px-6 py-8 max-w-7xl'><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='glass-card rounded-3xl p-8 mb-6'><h1 className='text-3xl font-bold mb-2'>{t.burn.title}</h1><p className='text-galaxy-gray text-sm'>{t.burn.subtitle}</p></motion.div><div className='grid grid-cols-1 lg:grid-cols-2 gap-6'><BurnTracker /><div className='glass-card rounded-3xl p-8'><h3 className='text-xl font-bold mb-4'>{t.burn.howTitle}</h3><ul className='space-y-4 text-galaxy-gray text-sm'><li className='flex gap-3'><span className='w-6 h-6 rounded-full bg-galaxy-blue/20 text-galaxy-blue flex items-center justify-center font-bold text-xs flex-shrink-0'>1</span><span>{t.burn.how1}</span></li><li className='flex gap-3'><span className='w-6 h-6 rounded-full bg-galaxy-blue/20 text-galaxy-blue flex items-center justify-center font-bold text-xs flex-shrink-0'>2</span><span>{t.burn.how2}</span></li><li className='flex gap-3'><span className='w-6 h-6 rounded-full bg-galaxy-blue/20 text-galaxy-blue flex items-center justify-center font-bold text-xs flex-shrink-0'>3</span><span>{t.burn.how3}</span></li><li className='flex gap-3'><span className='w-6 h-6 rounded-full bg-galaxy-blue/20 text-galaxy-blue flex items-center justify-center font-bold text-xs flex-shrink-0'>4</span><span>{t.burn.how4}</span></li></ul></div></div></main>",
  "  );",
  "}"
]);

// 4. Validators Page
w('src/features/staking/components/ValidatorsList.tsx', [
  "'use client';",
  "import { useStaking } from '../hooks/useStaking';",
  "import { Loader, ShieldCheck, ExternalLink, Users } from 'lucide-react';",
  "import { useState } from 'react';",
  "import { Validator } from '../services/staking.service';",
  "import DelegateModal from './DelegateModal';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "",
  "export default function ValidatorsList() {",
  "  const { validators, apr, isLoadingValidators } = useStaking();",
  "  const [search, setSearch] = useState('');",
  "  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  const filteredValidators = validators.filter((v) => v.description.moniker.toLowerCase().includes(search.toLowerCase()));",
  "  const totalVotingPower = validators.reduce((sum, v) => sum + parseFloat(v.tokens), 0);",
  "  return (",
  "    <div className='glass-card rounded-3xl p-8'><div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'><div><h2 className='text-2xl font-bold flex items-center gap-3'><ShieldCheck className='w-7 h-7 text-galaxy-blue' /> {t.validators.listTitle}</h2><p className='text-galaxy-gray text-sm mt-1'>{validators.length} {t.validators.activeSub}</p></div><div className='bg-galaxy-green/10 border border-galaxy-green/30 px-4 py-2 rounded-xl text-sm font-bold text-galaxy-green'>{t.validators.search.includes('APR') ? '' : 'APR'} {apr.toFixed(2)}%</div></div><div className='mb-6'><input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.validators.search} className='bg-space-bg border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-galaxy-blue' /></div>{isLoadingValidators ? <div className='flex justify-center py-12'><Loader className='w-8 h-8 animate-spin text-galaxy-blue' /></div> : <div className='space-y-3 max-h-[600px] overflow-y-auto pr-2'>{filteredValidators.map((val) => { const votingPower = (parseFloat(val.tokens) / totalVotingPower) * 100; const commission = parseFloat(val.commission.commission_rates.rate) * 100; return (<div key={val.operator_address} className='bg-space-bg/50 p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-4 hover:border-galaxy-blue/50 border border-transparent transition-all'><div className='flex items-center gap-4'><div className='w-10 h-10 rounded-full bg-galaxy-blue/20 flex items-center justify-center font-bold text-galaxy-blue'>{val.description.moniker.charAt(0)}</div><div><h3 className='font-bold text-galaxy-white'>{val.description.moniker}</h3><p className='text-xs text-galaxy-gray-muted font-mono'>{val.operator_address.slice(0, 20)}...</p></div></div><div className='flex items-center gap-6 text-sm'><div className='text-right'><p className='text-galaxy-gray text-xs'>{t.validators.commission}</p><p className='font-bold text-galaxy-white'>{commission.toFixed(1)}%</p></div><div className='text-right'><p className='text-galaxy-gray text-xs'>{t.validators.power}</p><p className='font-bold text-galaxy-blue flex items-center gap-1'><Users className='w-3 h-3' /> {votingPower.toFixed(2)}%</p></div><button onClick={() => setSelectedValidator(val)} className='bg-galaxy-blue/20 text-galaxy-blue px-4 py-2 rounded-xl font-bold text-sm hover:bg-galaxy-blue/30 flex items-center gap-2'>{t.validators.delegate} <ExternalLink className='w-3 h-3' /></button></div></div>); })}</div>}{selectedValidator && <DelegateModal validatorAddress={selectedValidator.operator_address} validatorName={selectedValidator.description.moniker} onClose={() => setSelectedValidator(null)} />}</div>",
  "  );",
  "}"
]);

w('src/features/staking/components/DelegateModal.tsx', [
  "'use client';",
  "import { useState } from 'react';",
  "import { X, Loader, CheckCircle2, AlertCircle } from 'lucide-react';",
  "import { useWallet } from '@/features/wallet/hooks/useWallet';",
  "import { WalletService } from '@/features/wallet/services/wallet.service';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "",
  "export default function DelegateModal({ validatorAddress, validatorName, onClose }) {",
  "  const { address } = useWallet();",
  "  const [amount, setAmount] = useState('');",
  "  const [isProcessing, setIsProcessing] = useState(false);",
  "  const [txHash, setTxHash] = useState(null);",
  "  const [error, setError] = useState(null);",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  const handleDelegate = async () => { if (!address || !amount) return; setIsProcessing(true); setError(null); setTxHash(null); try { const walletService = new WalletService(); const hash = await walletService.delegateTokens(address, validatorAddress, Math.floor(parseFloat(amount) * 1000000).toString()); setTxHash(hash); } catch (err) { setError(err.message); } finally { setIsProcessing(false); } };",
  "  return (<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'><div className='glass-card rounded-3xl p-8 w-full max-w-md relative'><button onClick={onClose} className='absolute top-4 right-4 text-galaxy-gray hover:text-galaxy-white'><X className='w-6 h-6' /></button><h2 className='text-2xl font-bold mb-2'>{t.validators.delegateTitle}</h2><p className='text-galaxy-gray text-sm mb-6'>{validatorName}</p><div className='mb-6'><label className='text-galaxy-gray text-sm mb-2 block'>{t.validators.delegateAmount}</label><input type='number' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='0.00' className='bg-space-bg border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-galaxy-blue text-lg font-bold' /></div>{txHash && <div className='mb-4 bg-galaxy-green/10 border border-galaxy-green/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-green'><CheckCircle2 className='w-5 h-5' /><p className='text-sm'>Hash: {txHash.slice(0, 20)}...</p></div>}{error && <div className='mb-4 bg-galaxy-red/10 border border-galaxy-red/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-red'><AlertCircle className='w-5 h-5' /><p className='text-sm'>{error}</p></div>}<button onClick={handleDelegate} disabled={isProcessing || !amount} className='w-full px-4 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 bg-galaxy-blue/20 text-galaxy-blue border border-galaxy-blue/30 hover:bg-galaxy-blue/30 disabled:opacity-50'>{isProcessing ? <Loader className='w-5 h-5 animate-spin' /> : t.validators.confirm}</button></div></div>);",
  "}"
]);

w('src/app/validateurs/page.tsx', [
  "\"use client\";",
  "import dynamic from 'next/dynamic';",
  "import { motion } from 'framer-motion';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "const ValidatorsList = dynamic(() => import('@/features/staking/components/ValidatorsList'), { ssr: false });",
  "export default function ValidatorsPage() {",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  return (<main className='min-h-screen relative container mx-auto px-6 py-8 max-w-7xl'><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='glass-card rounded-3xl p-8 mb-6'><h1 className='text-3xl font-bold mb-2'>{t.validators.title}</h1><p className='text-galaxy-gray text-sm'>{t.validators.subtitle}</p></motion.div><ValidatorsList /></main>);",
  "}"
]);

// 5. Governance Page
w('src/features/governance/components/GovernanceList.tsx', [
  "'use client';",
  "import { useGovernance } from '../hooks/useGovernance';",
  "import { Loader, Vote as VoteIcon, CheckCircle, XCircle, MinusCircle } from 'lucide-react';",
  "import { useState } from 'react';",
  "import { Proposal } from '../services/governance.service';",
  "import VoteModal from './VoteModal';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "",
  "export default function GovernanceList() {",
  "  const { proposals, isLoading } = useGovernance();",
  "  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  const getStatusColor = (status) => status === 'PROPOSAL_STATUS_VOTING_PERIOD' ? 'bg-galaxy-green/20 text-galaxy-green border-galaxy-green/30' : status === 'PROPOSAL_STATUS_PASSED' ? 'bg-galaxy-blue/20 text-galaxy-blue border-galaxy-blue/30' : 'bg-galaxy-red/20 text-galaxy-red border-galaxy-red/30';",
  "  const formatStatus = (status) => status.replace('PROPOSAL_STATUS_', '').replace('_', ' ');",
  "  return (<div className='glass-card rounded-3xl p-8'><div className='flex justify-between items-center mb-6'><h2 className='text-2xl font-bold flex items-center gap-3'><VoteIcon className='w-7 h-7 text-galaxy-blue' /> {t.governance.listTitle}</h2></div>{isLoading ? <div className='flex justify-center py-12'><Loader className='w-8 h-8 animate-spin text-galaxy-blue' /></div> : <div className='space-y-4'>{proposals.map((prop, index) => { const tally = prop.final_tally_result; const yes = parseFloat(tally?.yes || '0'); const no = parseFloat(tally?.no || '0'); const abstain = parseFloat(tally?.abstain || '0'); return (<div key={prop.proposal_id || index} className='bg-space-bg/50 p-5 rounded-2xl border border-white/10 hover:border-galaxy-blue/50 transition-all'><div className='flex flex-col md:flex-row justify-between gap-4 mb-4'><div className='flex-1'><div className='flex items-center gap-3 mb-2'><span className='text-galaxy-gray-muted font-bold text-sm'>#{prop.proposal_id}</span><span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(prop.status)}`}>{formatStatus(prop.status)}</span></div><h3 className='font-bold text-galaxy-white text-lg'>{prop.content?.title || 'Untitled'}</h3></div>{prop.status === 'PROPOSAL_STATUS_VOTING_PERIOD' && <button onClick={() => setSelectedProposal(prop)} className='bg-galaxy-blue/20 text-galaxy-blue px-4 py-2 rounded-xl font-bold text-sm hover:bg-galaxy-blue/30 flex items-center gap-2 h-fit'><VoteIcon className='w-4 h-4' /> {t.governance.vote}</button>}</div>{(yes + no + abstain) > 0 && <div className='flex items-center gap-4 text-sm border-t border-white/5 pt-4 flex-wrap'><div className='flex items-center gap-2 text-galaxy-green'><CheckCircle className='w-4 h-4' /> Yes: {yes.toLocaleString()}</div><div className='flex items-center gap-2 text-galaxy-red'><XCircle className='w-4 h-4' /> No: {no.toLocaleString()}</div><div className='flex items-center gap-2 text-galaxy-gray'><MinusCircle className='w-4 h-4' /> Abstain: {abstain.toLocaleString()}</div></div>}</div>); })}</div>}{selectedProposal && <VoteModal proposalId={selectedProposal.proposal_id} proposalTitle={selectedProposal.content?.title || 'Untitled'} onClose={() => setSelectedProposal(null)} />}</div>);",
  "}"
]);

w('src/features/governance/components/VoteModal.tsx', [
  "'use client';",
  "import { useState } from 'react';",
  "import { X, Loader, CheckCircle2, AlertCircle } from 'lucide-react';",
  "import { useWallet } from '@/features/wallet/hooks/useWallet';",
  "import { WalletService } from '@/features/wallet/services/wallet.service';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "",
  "export default function VoteModal({ proposalId, proposalTitle, onClose }) {",
  "  const { address } = useWallet();",
  "  const [option, setOption] = useState(1);",
  "  const [isProcessing, setIsProcessing] = useState(false);",
  "  const [txHash, setTxHash] = useState(null);",
  "  const [error, setError] = useState(null);",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  const options = [{ value: 1, label: t.governance.yes }, { value: 2, label: t.governance.abstain }, { value: 3, label: t.governance.no }, { value: 4, label: t.governance.noWithVeto }];",
  "  const handleVote = async () => { if (!address) return; setIsProcessing(true); setError(null); setTxHash(null); try { const walletService = new WalletService(); const hash = await walletService.voteOnProposal(address, proposalId, option); setTxHash(hash); } catch (err) { setError(err.message); } finally { setIsProcessing(false); } };",
  "  return (<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'><div className='glass-card rounded-3xl p-8 w-full max-w-md relative'><button onClick={onClose} className='absolute top-4 right-4 text-galaxy-gray hover:text-galaxy-white'><X className='w-6 h-6' /></button><h2 className='text-2xl font-bold mb-2'>{t.governance.voteTitle}</h2><p className='text-galaxy-gray text-sm mb-6'>#{proposalId} - {proposalTitle}</p><div className='mb-6 space-y-3'>{options.map((opt) => <button key={opt.value} onClick={() => setOption(opt.value)} className={`w-full px-4 py-3 rounded-xl border font-bold flex items-center gap-3 transition-all ${option === opt.value ? 'bg-galaxy-blue/20 border-galaxy-blue text-galaxy-white' : 'bg-space-bg/50 border-white/10 text-galaxy-gray'}`}><div className={`w-4 h-4 rounded-full border-2 ${option === opt.value ? 'bg-galaxy-blue border-galaxy-blue' : 'border-galaxy-gray'}`}></div>{opt.label}</button>)}</div>{txHash && <div className='mb-4 bg-galaxy-green/10 border border-galaxy-green/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-green'><CheckCircle2 className='w-5 h-5' /><p className='text-sm'>Hash: {txHash.slice(0, 20)}...</p></div>}{error && <div className='mb-4 bg-galaxy-red/10 border border-galaxy-red/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-red'><AlertCircle className='w-5 h-5' /><p className='text-sm'>{error}</p></div>}<button onClick={handleVote} disabled={isProcessing} className='w-full px-4 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 bg-galaxy-blue/20 text-galaxy-blue border border-galaxy-blue/30 hover:bg-galaxy-blue/30 disabled:opacity-50'>{isProcessing ? <Loader className='w-5 h-5 animate-spin' /> : t.governance.confirm}</button></div></div>);",
  "}"
]);

w('src/app/governance/page.tsx', [
  "\"use client\";",
  "import dynamic from 'next/dynamic';",
  "import { motion } from 'framer-motion';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "const GovernanceList = dynamic(() => import('@/features/governance/components/GovernanceList'), { ssr: false });",
  "export default function GovernancePage() {",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  return (<main className='min-h-screen relative container mx-auto px-6 py-8 max-w-7xl'><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='glass-card rounded-3xl p-8 mb-6'><h1 className='text-3xl font-bold mb-2'>{t.governance.title}</h1><p className='text-galaxy-gray text-sm'>{t.governance.subtitle}</p></motion.div><GovernanceList /></main>);",
  "}"
]);

// 6. News Page
w('src/features/news/components/NewsList.tsx', [
  "'use client';",
  "import { useNews } from '../hooks/useNews';",
  "import { Loader, Newspaper, ExternalLink, Clock } from 'lucide-react';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "",
  "export default function NewsList() {",
  "  const { news, isLoading } = useNews();",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  const formatDate = (dateStr) => { const date = new Date(dateStr); const now = new Date(); const diffH = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60)); if (diffH < 1) return 'Live'; if (diffH < 24) return `${diffH}h`; return date.toLocaleDateString(); };",
  "  return (<div className='glass-card rounded-3xl p-8'><div className='flex justify-between items-center mb-6'><h2 className='text-2xl font-bold flex items-center gap-3'><Newspaper className='w-7 h-7 text-terra-yellow' /> {t.news.listTitle}</h2></div>{isLoading ? <div className='flex justify-center py-12'><Loader className='w-8 h-8 animate-spin text-terra-yellow' /></div> : news.length === 0 ? <div className='text-center py-12 text-galaxy-gray'><Newspaper className='w-12 h-12 mx-auto mb-4 opacity-50' /><p>{t.news.empty}</p></div> : <div className='space-y-3 max-h-[700px] overflow-y-auto pr-2'>{news.map((item, index) => <a key={index} href={item.link} target='_blank' rel='noopener noreferrer' className='block bg-space-bg/50 p-4 rounded-2xl border border-white/10 hover:border-terra-yellow/50 transition-all group'><div className='flex items-center gap-3 mb-2'><span className='px-2 py-1 rounded-full text-xs font-bold border bg-galaxy-blue/20 text-galaxy-blue border-galaxy-blue/30'>{item.source}</span><span className='text-xs text-galaxy-gray-muted flex items-center gap-1'><Clock className='w-3 h-3' /> {formatDate(item.pubDate)}</span></div><h3 className='font-bold text-galaxy-white group-hover:text-terra-yellow transition-colors mb-1'>{item.title}</h3><p className='text-sm text-galaxy-gray line-clamp-2'>{item.content.substring(0, 150)}...</p><div className='mt-2 text-xs text-galaxy-gray-muted flex items-center gap-1'>{t.news.readMore} <ExternalLink className='w-3 h-3' /></div></a>)}</div>}</div>);",
  "}"
]);

w('src/app/actualites/page.tsx', [
  "\"use client\";",
  "import dynamic from 'next/dynamic';",
  "import { motion } from 'framer-motion';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "const NewsList = dynamic(() => import('@/features/news/components/NewsList'), { ssr: false });",
  "export default function NewsPage() {",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  return (<main className='min-h-screen relative container mx-auto px-6 py-8 max-w-7xl'><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='glass-card rounded-3xl p-8 mb-6'><h1 className='text-3xl font-bold mb-2'>{t.news.title}</h1><p className='text-galaxy-gray text-sm'>{t.news.subtitle}</p></motion.div><NewsList /></main>);",
  "}"
]);

// 7. Settings Page
w('src/app/settings/page.tsx', [
  "\"use client\";",
  "import { motion } from 'framer-motion';",
  "import { useSettingsStore } from '@/store/settingsStore';",
  "import { Settings as SettingsIcon, Eye, EyeOff } from 'lucide-react';",
  "import { useLanguageStore } from '@/store/languageStore';",
  "import { useTranslation } from '@/lib/translations';",
  "export default function SettingsPage() {",
  "  const { isExpertMode, toggleExpertMode } = useSettingsStore();",
  "  const lang = useLanguageStore((state) => state.lang);",
  "  const t = useTranslation(lang);",
  "  return (<main className='min-h-screen relative container mx-auto px-6 py-8 max-w-4xl'><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='glass-card rounded-3xl p-8 mb-6'><h1 className='text-3xl font-bold mb-2 flex items-center gap-3'><SettingsIcon className='w-8 h-8 text-terra-yellow' /> {t.settings.title}</h1><p className='text-galaxy-gray text-sm'>{t.settings.subtitle}</p></motion.div><div className='glass-card rounded-3xl p-8'><div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-space-bg/50 rounded-2xl'><div className='flex items-center gap-4'>{isExpertMode ? <Eye className='w-6 h-6 text-galaxy-blue' /> : <EyeOff className='w-6 h-6 text-galaxy-gray' />}<div><h2 className='text-xl font-bold text-galaxy-white'>{t.settings.expertTitle}</h2><p className='text-sm text-galaxy-gray'>{isExpertMode ? t.settings.expertDescOn : t.settings.expertDescOff}</p></div></div><button onClick={toggleExpertMode} className={`relative w-16 h-8 rounded-full transition-colors ${isExpertMode ? 'bg-galaxy-blue' : 'bg-galaxy-gray/30'}`}><span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${isExpertMode ? 'translate-x-9' : 'translate-x-1'}`} /></button></div></div></main>);",
  "}"
]);

console.log('\n🎉 Toutes les pages ont été traduites !');