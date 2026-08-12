import { Language } from '@/store/languageStore';

export const translations = {
  fr: {
    nav: { dashboard: 'Dashboard',
      wallet: 'Wallet', dfc: 'DFC Hub', burn: 'Burn', validators: 'Validators', governance: 'Governance', news: 'News', settings: 'Settings' },
    wallet: { connect: 'Connect Wallet', disconnect: 'Déconnexion' },
    dashboard: { title: 'Network Dashboard', subtitle: 'Analyse en temps réel de l\'écosystème Terra Classic.' },
    stats: { totalSupply: 'Total Supply', staked: 'Staked', validators: 'Validators', communityPool: 'Community Pool', price: 'Prix LUNC', marketCap: 'Market Cap', supplySub: 'LUNC', stakedSub: 'de la supply', validatorsSub: 'Actifs', poolSub: 'Fonds communautaires', liveSub: 'Live' },
    analytics: { votingPower: 'Répartition du Voting Power', tokenomics: 'Tokenomie LUNC (en Milliards)' },
    dfc: { title: 'DFLunc Protocol Hub', subtitle: 'Gérez votre DFC, vos rewards et votre staking DFLunc.', walletTitle: 'Portefeuille & Rewards', dfcAvail: 'DFC Disponible', dfcStaked: 'DFC Staké', rewardsDfc: 'Rewards DFC', rewardsUstc: 'Rewards USTC', claimDfc: 'Claim DFC', claimUstc: 'Claim USTC', address: 'Adresse', stakeTitle: 'Staker mes DFC', stakeAmount: 'Montant à Staker', unstakeTitle: 'Unstaker mes DFC', unstakeAmount: 'Montant à Unstaker', max: 'MAX', stakeBtn: 'Staker', unstakeBtn: 'Unstaker' },
    burn: { title: 'DFLUNC Burn Terminal', subtitle: 'Brûlez votre LUNC pour mint du DFC et participer au Reward Pool.', burnTitle: 'Brûler du LUNC', burnAmount: 'Nombre de Batches à Brûler (1 Batch = 5,000 LUNC)', luncBurn: 'LUNC à Brûler', fee: 'Frais de Protocole', estDfc: 'DFC Estimés (Mint)', execute: 'Exécuter le Burn', howTitle: 'Comment ça marche ?', how1: 'Le montant de LUNC que vous envoyez est divisé en Batches de 5,000 LUNC.', how2: 'Le protocole brûle immédiatement ces LUNC (envoi à l\'adresse de burn mort).', how3: 'En échange, le contrat mint des tokens DFC et vous les envoie.', how4: 'Vous pouvez ensuite staker ces DFC pour réclamer des récompenses en USTC.' },
    validators: { title: 'Staking Terra Classic', subtitle: 'Déléguer votre LUNC pour sécuriser le réseau et gagner des récompenses.', listTitle: 'Validateurs Actifs', activeSub: 'sécurisent le réseau', search: 'Rechercher un validateur...', commission: 'Commission', power: 'Voting Power', delegate: 'Déléguer', delegateTitle: 'Déléguer du LUNC', delegateAmount: 'Montant à Déléguer (LUNC)', confirm: 'Confirmer la Délégation' },
    governance: { title: 'Gouvernance Terra Classic', subtitle: 'Participez à l\'avenir du réseau en votant sur les propositions.', listTitle: 'Propositions Actives', vote: 'Voter', voteTitle: 'Voter sur la Proposition', yes: 'Yes', abstain: 'Abstain', no: 'No', noWithVeto: 'No with Veto', confirm: 'Confirmer le Vote' },
    news: { title: 'Actualités Terra Classic', subtitle: 'Les dernières nouvelles de l\'écosystème agrégées en temps réel.', listTitle: 'Fil d\'Actualité', readMore: 'Lire plus', empty: 'Aucune actualité disponible pour le moment.' },
    settings: { title: 'Paramètres', subtitle: 'Personnalisez votre expérience LUNC Terminal.', expertTitle: 'Mode Expert', expertDescOn: 'Affiche les données techniques (adresses de contrats, denoms).', expertDescOff: 'Masque les données blockchain complexes.' }
  },
  en: {
    nav: { dashboard: 'Dashboard',
      wallet: 'Wallet', dfc: 'DFC Hub', burn: 'Burn', validators: 'Validators', governance: 'Governance', news: 'News', settings: 'Settings' },
    wallet: { connect: 'Connect Wallet', disconnect: 'Disconnect' },
    dashboard: { title: 'Network Dashboard', subtitle: 'Real-time analysis of the Terra Classic ecosystem.' },
    stats: { totalSupply: 'Total Supply', staked: 'Staked', validators: 'Validators', communityPool: 'Community Pool', price: 'Price LUNC', marketCap: 'Market Cap', supplySub: 'LUNC', stakedSub: 'of supply', validatorsSub: 'Active', poolSub: 'Community funds', liveSub: 'Live' },
    analytics: { votingPower: 'Voting Power Distribution', tokenomics: 'LUNC Tokenomics (in Billions)' },
    dfc: { title: 'DFLunc Protocol Hub', subtitle: 'Manage your DFC, rewards and DFLunc staking.', walletTitle: 'Wallet & Rewards', dfcAvail: 'DFC Available', dfcStaked: 'DFC Staked', rewardsDfc: 'Rewards DFC', rewardsUstc: 'Rewards USTC', claimDfc: 'Claim DFC', claimUstc: 'Claim USTC', address: 'Address', stakeTitle: 'Stake my DFC', stakeAmount: 'Amount to Stake', unstakeTitle: 'Unstake my DFC', unstakeAmount: 'Amount to Unstake', max: 'MAX', stakeBtn: 'Stake', unstakeBtn: 'Unstake' },
    burn: { title: 'DFLUNC Burn Terminal', subtitle: 'Burn your LUNC to mint DFC and join the Reward Pool.', burnTitle: 'Burn LUNC', burnAmount: 'Number of Batches to Burn (1 Batch = 5,000 LUNC)', luncBurn: 'LUNC to Burn', fee: 'Protocol Fee', estDfc: 'Estimated DFC (Mint)', execute: 'Execute Burn', howTitle: 'How it works', how1: 'The LUNC amount sent is divided into Batches of 5,000 LUNC.', how2: 'The protocol immediately burns these LUNC (sent to a dead address).', how3: 'In exchange, the contract mints DFC tokens and sends them to you.', how4: 'You can then stake these DFC to claim USTC rewards.' },
    validators: { title: 'Terra Classic Staking', subtitle: 'Delegate your LUNC to secure the network and earn rewards.', listTitle: 'Active Validators', activeSub: 'secure the network', search: 'Search a validator...', commission: 'Commission', power: 'Voting Power', delegate: 'Delegate', delegateTitle: 'Delegate LUNC', delegateAmount: 'Amount to Delegate (LUNC)', confirm: 'Confirm Delegation' },
    governance: { title: 'Terra Classic Governance', subtitle: 'Participate in the network future by voting on proposals.', listTitle: 'Active Proposals', vote: 'Vote', voteTitle: 'Vote on Proposal', yes: 'Yes', abstain: 'Abstain', no: 'No', noWithVeto: 'No with Veto', confirm: 'Confirm Vote' },
    news: { title: 'Terra Classic News', subtitle: 'Latest ecosystem news aggregated in real-time.', listTitle: 'News Feed', readMore: 'Read more', empty: 'No news available at the moment.' },
    settings: { title: 'Settings', subtitle: 'Customize your LUNC Terminal experience.', expertTitle: 'Expert Mode', expertDescOn: 'Shows technical data (contract addresses, denoms).', expertDescOff: 'Hides complex blockchain data.' }
  },
  zh: {
    nav: { dashboard: '仪表盘', dfc: 'DFC中心', burn: '销毁', validators: '验证节点', governance: '治理', news: '新闻', settings: '设置' },
    wallet: { connect: '连接钱包', disconnect: '断开连接' },
    dashboard: { title: '网络仪表盘', subtitle: 'Terra Classic 生态系统的实时分析。' },
    stats: { totalSupply: '总供应量', staked: '质押量', validators: '验证节点', communityPool: '社区池', price: 'LUNC 价格', marketCap: '市值', supplySub: 'LUNC', stakedSub: '占总供应', validatorsSub: '活跃', poolSub: '社区资金', liveSub: '实时' },
    analytics: { votingPower: '投票权分布', tokenomics: 'LUNC 代币经济学（十亿）' },
    dfc: { title: 'DFLunc 协议中心', subtitle: '管理您的 DFC、奖励和 DFLunc 质押。', walletTitle: '钱包与奖励', dfcAvail: '可用 DFC', dfcStaked: '已质押 DFC', rewardsDfc: 'DFC 奖励', rewardsUstc: 'USTC 奖励', claimDfc: '领取 DFC', claimUstc: '领取 USTC', address: '地址', stakeTitle: '质押我的 DFC', stakeAmount: '质押数量', unstakeTitle: '解除质押我的 DFC', unstakeAmount: '解除质押数量', max: '最大', stakeBtn: '质押', unstakeBtn: '解除质押' },
    burn: { title: 'DFLUNC 销毁终端', subtitle: '销毁您的 LUNC 以铸造 DFC 并加入奖励池。', burnTitle: '销毁 LUNC', burnAmount: '要销毁的批次数（1批 = 5,000 LUNC）', luncBurn: '要销毁的 LUNC', fee: '协议费用', estDfc: '预计 DFC (铸造)', execute: '执行销毁', howTitle: '运作方式', how1: '发送的 LUNC 数量被分为 5,000 LUNC 一批。', how2: '协议立即销毁这些 LUNC（发送至死地址）。', how3: '作为交换，合约铸造 DFC 代币并发送给您。', how4: '然后您可以质押这些 DFC 以领取 USTC 奖励。' },
    validators: { title: 'Terra Classic 质押', subtitle: '委托您的 LUNC 以保护网络并赚取奖励。', listTitle: '活跃验证节点', activeSub: '保护网络安全', search: '搜索验证节点...', commission: '佣金', power: '投票权', delegate: '委托', delegateTitle: '委托 LUNC', delegateAmount: '委托数量 (LUNC)', confirm: '确认委托' },
    governance: { title: 'Terra Classic 治理', subtitle: '通过对提案投票参与网络的未来。', listTitle: '活跃提案', vote: '投票', voteTitle: '对提案投票', yes: '赞成', abstain: '弃权', no: '反对', noWithVeto: '反对并否决', confirm: '确认投票' },
    news: { title: 'Terra Classic 新闻', subtitle: '实时聚合的最新生态系统新闻。', listTitle: '新闻流', readMore: '阅读更多', empty: '暂无新闻。' },
    settings: { title: '设置', subtitle: '自定义您的 LUNC 终端体验。', expertTitle: '专家模式', expertDescOn: '显示技术数据（合约地址、代币标识）。', expertDescOff: '隐藏复杂的区块链数据。' }
  }
};

export const useTranslation = (lang: Language) => {
  return translations[lang];
};
