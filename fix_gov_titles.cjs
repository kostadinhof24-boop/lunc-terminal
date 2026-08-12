const fs = require('fs');
const path = require('path');

const w = (p, c) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Correction des titres de propositions...");

// 1. Mise à jour du service avec l'API v1beta1 (qui contient les vrais titres)
w('src/features/governance/services/governance.service.ts', `
import axios from 'axios';
import { TERRA_CLASSIC_CONFIG } from '@/config/chains';

export interface Proposal {
  proposal_id: string;
  content: {
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
      // On utilise v1beta1 sans le paramètre reverse pour éviter l'erreur 500 du LCD
      const res = await axios.get(\`\${TERRA_CLASSIC_CONFIG.lcdUrl}/cosmos/gov/v1beta1/proposals?pagination.limit=10\`);
      let proposals = res.data.proposals || [];
      
      // On trie manuellement par ID décroissant (du plus récent au plus ancien)
      proposals.sort((a: any, b: any) => parseInt(b.proposal_id) - parseInt(a.proposal_id));
      
      return proposals;
    } catch (err) {
      console.error("Erreur lors de la récupération des propositions:", err);
      return [];
    }
  }
};
`);

// 2. Mise à jour de GovernanceList.tsx pour lire les bonnes données v1beta1
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
            const yes = parseFloat(tally?.yes || '0');
            const no = parseFloat(tally?.no || '0');
            const abstain = parseFloat(tally?.abstain || '0');
            const veto = parseFloat(tally?.no_with_veto || '0');
            const total = yes + no + abstain + veto;
            
            return (
              <div key={prop.proposal_id} className="bg-space-bg/50 p-5 rounded-2xl border border-white/10 hover:border-galaxy-blue/50 transition-all">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-galaxy-gray-muted font-bold text-sm">#{prop.proposal_id}</span>
                      <span className={\`px-2 py-1 rounded-full text-xs font-bold border \${getStatusColor(prop.status)}\`}>{formatStatus(prop.status)}</span>
                    </div>
                    <h3 className="font-bold text-galaxy-white text-lg">{prop.content?.title || 'Untitled Proposal'}</h3>
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

                {total > 0 && (
                  <div className="flex items-center gap-4 text-sm border-t border-white/5 pt-4 flex-wrap">
                    <div className="flex items-center gap-2 text-galaxy-green">
                      <CheckCircle className="w-4 h-4" /> Yes: {yes.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-galaxy-red">
                      <XCircle className="w-4 h-4" /> No: {no.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-galaxy-gray">
                      <MinusCircle className="w-4 h-4" /> Abstain: {abstain.toLocaleString()}
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
          proposalTitle={selectedProposal.content?.title || 'Untitled'}
          onClose={() => setSelectedProposal(null)}
        />
      )}
    </div>
  );
}
`);

console.log('\n🎉 Titres corrigés !');