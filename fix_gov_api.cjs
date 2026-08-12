const fs = require('fs');
const path = require('path');

const w = (p, c) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Mise à jour du service Governance...");

w('src/features/governance/services/governance.service.ts', `
import axios from 'axios';
import { TERRA_CLASSIC_CONFIG } from '@/config/chains';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: string;
  tally: {
    yes_count: string;
    abstain_count: string;
    no_count: string;
    no_with_veto_count: string;
  };
}

export const GovernanceService = {
  async getProposals(): Promise<Proposal[]> {
    try {
      // Utilisation de l'API v1 plus stable et sans paramètre reverse pour éviter le crash 500 du LCD
      const res = await axios.get(\`\${TERRA_CLASSIC_CONFIG.lcdUrl}/cosmos/gov/v1/proposals?pagination.limit=10\`);
      
      const rawProposals = res.data.proposals || [];
      
      // On adapte le format de la v1 pour notre interface
      return rawProposals.map((p: any) => ({
        id: p.id,
        title: p.messages?.[0]?.title || p.title || 'Untitled Proposal',
        description: p.messages?.[0]?.description || '',
        status: p.status,
        tally: p.final_tally_result || {
          yes_count: "0",
          abstain_count: "0",
          no_count: "0",
          no_with_veto_count: "0"
        }
      }));
    } catch (err) {
      console.error("Erreur lors de la récupération des propositions:", err);
      return [];
    }
  }
};
`);

console.log('\n🎉 Service Governance mis à jour !');