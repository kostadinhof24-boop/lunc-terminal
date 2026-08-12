
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
