const fs = require('fs');
const path = require('path');

const w = (p, c) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Création du module Governance...");

// 1. Mise à jour de WalletService pour le vote natif (MsgVote)
w('src/features/wallet/services/wallet.service.ts', `
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClient, coins } from '@cosmjs/stargate';
import { TERRA_CLASSIC_CONFIG } from '@/config/chains';

export class WalletService {
  async executeTransaction(address: string, contractAddress: string, msg: object, funds?: { denom: string; amount: string }[]) {
    const w = window as any;
    if (!w.keplr) throw new Error('Keplr non installé');
    
    await w.keplr.enable(TERRA_CLASSIC_CONFIG.chainId);
    const offlineSigner = w.keplr.getOfflineSigner(TERRA_CLASSIC_CONFIG.chainId);
    const client = await SigningCosmWasmClient.connectWithSigner(TERRA_CLASSIC_CONFIG.rpcUrl, offlineSigner);
    
    const fee = { amount: [{ denom: 'uluna', amount: '300000' }], gas: '1500000' };
    const result = await client.execute(address, contractAddress, msg, fee, 'LUNC Terminal', funds || []);
    return result.transactionHash;
  }

  async delegateTokens(delegatorAddress: string, validatorAddress: string, amountUluna: string) {
    const w = window as any;
    if (!w.keplr) throw new Error('Keplr non installé');
    
    await w.keplr.enable(TERRA_CLASSIC_CONFIG.chainId);
    const offlineSigner = w.keplr.getOfflineSigner(TERRA_CLASSIC_CONFIG.chainId);
    const client = await SigningStargateClient.connectWithSigner(TERRA_CLASSIC_CONFIG.rpcUrl, offlineSigner);
    
    const msg = {
      typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
      value: {
        delegatorAddress: delegatorAddress,
        validatorAddress: validatorAddress,
        amount: { denom: "uluna", amount: amountUluna }
      }
    };
    
    const fee = { amount: coins(300000, "uluna"), gas: "200000" };
    const result = await client.signAndBroadcast(delegatorAddress, [msg], fee, "LUNC Terminal Delegation");
    return result.transactionHash;
  }

  async voteOnProposal(voterAddress: string, proposalId: string, option: number) {
    const w = window as any;
    if (!w.keplr) throw new Error('Keplr non installé');
    
    await w.keplr.enable(TERRA_CLASSIC_CONFIG.chainId);
    const offlineSigner = w.keplr.getOfflineSigner(TERRA_CLASSIC_CONFIG.chainId);
    const client = await SigningStargateClient.connectWithSigner(TERRA_CLASSIC_CONFIG.rpcUrl, offlineSigner);
    
    // Options: 1=Yes, 2=Abstain, 3=No, 4=NoWithVeto
    const msg = {
      typeUrl: "/cosmos.gov.v1beta1.MsgVote",
      value: {
        voter: voterAddress,
        proposalId: proposalId,
        option: option
      }
    };
    
    const fee = { amount: coins(300000, "uluna"), gas: "200000" };
    const result = await client.signAndBroadcast(voterAddress, [msg], fee, "LUNC Terminal Vote");
    return result.transactionHash;
  }
}
`);

// 2. Service Governance
w('src/features/governance/services/governance.service.ts', `
import axios from 'axios';
import { TERRA_CLASSIC_CONFIG } from '@/config/chains';

export interface Proposal {
  proposal_id: string;
  content: {
    "@type": string;
    title: string;
    description: string;
  };
  status: string;
  final_tally_result: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
}

export const GovernanceService = {
  async getProposals(): Promise<Proposal[]> {
    try {
      const res = await axios.get(\`\${TERRA_CLASSIC_CONFIG.lcdUrl}/cosmos/gov/v1beta1/proposals?pagination.limit=10&pagination.reverse=true\`);
      return res.data.proposals || [];
    } catch (err) {
      console.error("Erreur lors de la récupération des propositions:", err);
      return [];
    }
  }
};
`);

// 3. Hook Governance
w('src/features/governance/hooks/useGovernance.ts', `
'use client';

import { useQuery } from '@tanstack/react-query';
import { GovernanceService, Proposal } from '../services/governance.service';

export function useGovernance() {
  const { data: proposals, isLoading } = useQuery<Proposal[]>({
    queryKey: ['proposals'],
    queryFn: GovernanceService.getProposals,
    refetchInterval: 60000,
  });

  return {
    proposals: proposals || [],
    isLoading,
  };
}
`);

// 4. Composant VoteModal
w('src/features/governance/components/VoteModal.tsx', `
'use client';

import { useState } from 'react';
import { X, Loader, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { WalletService } from '@/features/wallet/services/wallet.service';

interface VoteModalProps {
  proposalId: string;
  proposalTitle: string;
  onClose: () => void;
}

export default function VoteModal({ proposalId, proposalTitle, onClose }: VoteModalProps) {
  const { address } = useWallet();
  const [option, setOption] = useState<number>(1); // 1=Yes par défaut
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async () => {
    if (!address) return;
    setIsProcessing(true);
    setError(null);
    setTxHash(null);

    try {
      const walletService = new WalletService();
      const hash = await walletService.voteOnProposal(address, proposalId, option);
      setTxHash(hash);
    } catch (err: any) {
      console.error("Erreur Vote:", err);
      setError(err.message || "Le vote a échoué.");
    } finally {
      setIsProcessing(false);
    }
  };

  const options = [
    { value: 1, label: "Yes", color: "text-galaxy-green" },
    { value: 2, label: "Abstain", color: "text-galaxy-gray" },
    { value: 3, label: "No", color: "text-galaxy-red" },
    { value: 4, label: "No with Veto", color: "text-galaxy-red" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-galaxy-gray hover:text-galaxy-white">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-2">Voter sur la Proposition</h2>
        <p className="text-galaxy-gray text-sm mb-6">#{proposalId} - <span className="font-bold text-galaxy-white">{proposalTitle}</span></p>

        <div className="mb-6 space-y-3">
          {options.map((opt) => (
            <button 
              key={opt.value}
              onClick={() => setOption(opt.value)}
              className={\`w-full px-4 py-3 rounded-xl border font-bold flex items-center gap-3 transition-all \${option === opt.value ? 'bg-galaxy-blue/20 border-galaxy-blue text-galaxy-white' : 'bg-space-bg/50 border-white/10 text-galaxy-gray hover:border-white/30'}\`}
            >
              <div className={\`w-4 h-4 rounded-full border-2 \${option === opt.value ? 'bg-galaxy-blue border-galaxy-blue' : 'border-galaxy-gray'}\`}></div>
              {opt.label}
            </button>
          ))}
        </div>

        {txHash && (
          <div className="mb-4 bg-galaxy-green/10 border border-galaxy-green/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-green">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Vote réussi ! Hash: {txHash.slice(0, 20)}...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-galaxy-red/10 border border-galaxy-red/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-red">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button 
          onClick={handleVote}
          disabled={isProcessing}
          className="w-full px-4 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 bg-galaxy-blue/20 text-galaxy-blue border border-galaxy-blue/30 hover:bg-galaxy-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? <><Loader className="w-5 h-5 animate-spin" /> Vote en cours...</> : 'Confirmer le Vote'}
        </button>
      </div>
    </div>
  );
}
`);

// 5. Composant GovernanceList
w('src/features/governance/components/GovernanceList.tsx', `
'use client';

import { useGovernance } from '../hooks/useGovernance';
import { Loader, Vote as VoteIcon, CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import { useState } from 'react';
import { Proposal } from '../services/governance.service';
import VoteModal from './VoteModal';

export default function GovernanceList() {
  const { proposals, isLoading } = useGovernance();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const getStatusColor = (status: string) => {
    if (status === 'PROPOSAL_STATUS_VOTING_PERIOD') return 'bg-galaxy-green/20 text-galaxy-green border-galaxy-green/30';
    if (status === 'PROPOSAL_STATUS_PASSED') return 'bg-galaxy-blue/20 text-galaxy-blue border-galaxy-blue/30';
    if (status === 'PROPOSAL_STATUS_REJECTED') return 'bg-galaxy-red/20 text-galaxy-red border-galaxy-red/30';
    return 'bg-galaxy-gray/20 text-galaxy-gray border-galaxy-gray/30';
  };

  const formatStatus = (status: string) => status.replace('PROPOSAL_STATUS_', '').replace('_', ' ');

  return (
    <div className="glass-card rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <VoteIcon className="w-7 h-7 text-galaxy-blue" /> Propositions Actives
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-galaxy-blue" />
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((prop) => {
            const tally = prop.final_tally_result;
            const yesPct = tally ? (parseFloat(tally.yes) / (parseFloat(tally.yes) + parseFloat(tally.no) + parseFloat(tally.abstain) + parseFloat(tally.no_with_veto))) * 100 : 0;
            
            return (
              <div key={prop.proposal_id} className="bg-space-bg/50 p-5 rounded-2xl border border-white/10 hover:border-galaxy-blue/50 transition-all">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-galaxy-gray-muted font-bold text-sm">#{prop.proposal_id}</span>
                      <span className={\`px-2 py-1 rounded-full text-xs font-bold border \${getStatusColor(prop.status)}\`}>{formatStatus(prop.status)}</span>
                    </div>
                    <h3 className="font-bold text-galaxy-white text-lg">{prop.content.title}</h3>
                  </div>
                  {prop.status === 'PROPOSAL_STATUS_VOTING_PERIOD' && (
                    <button 
                      onClick={() => setSelectedProposal(prop)}
                      className="bg-galaxy-blue/20 text-galaxy-blue px-4 py-2 rounded-xl font-bold text-sm hover:bg-galaxy-blue/30 flex items-center gap-2 h-fit"
                    >
                      <VoteIcon className="w-4 h-4" /> Voter
                    </button>
                  )}
                </div>

                {tally && (
                  <div className="flex items-center gap-4 text-sm border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2 text-galaxy-green">
                      <CheckCircle className="w-4 h-4" /> Yes: {parseFloat(tally.yes).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-galaxy-red">
                      <XCircle className="w-4 h-4" /> No: {parseFloat(tally.no).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-galaxy-gray">
                      <MinusCircle className="w-4 h-4" /> Abstain: {parseFloat(tally.abstain).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedProposal && (
        <VoteModal 
          proposalId={selectedProposal.proposal_id}
          proposalTitle={selectedProposal.content.title}
          onClose={() => setSelectedProposal(null)}
        />
      )}
    </div>
  );
}
`);

// 6. Page Governance
w('src/app/governance/page.tsx', `
"use client";

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const GovernanceList = dynamic(() => import('@/features/governance/components/GovernanceList'), { ssr: false });

export default function GovernancePage() {
  return (
    <main className="min-h-screen relative container mx-auto px-6 py-8 max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-8 mb-6"
      >
        <h1 className="text-3xl font-bold mb-2">Gouvernance Terra Classic</h1>
        <p className="text-galaxy-gray text-sm">Participez à l'avenir du réseau en votant sur les propositions.</p>
      </motion.div>

      <GovernanceList />
    </main>
  );
}
`);

console.log('\n🎉 Module Governance créé avec succès !');