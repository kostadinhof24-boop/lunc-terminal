
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
      const res = await axios.get(`${TERRA_CLASSIC_CONFIG.lcdUrl}/cosmos/gov/v1beta1/proposals?pagination.limit=10`);
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
