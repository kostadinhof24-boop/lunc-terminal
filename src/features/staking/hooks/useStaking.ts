
'use client';

import { useQuery } from '@tanstack/react-query';
import { StakingService, Validator } from '../services/staking.service';

export function useStaking() {
  const { data: validators, isLoading: isLoadingValidators } = useQuery<Validator[]>({
    queryKey: ['activeValidators'],
    queryFn: StakingService.getActiveValidators,
    refetchInterval: 60000,
  });

  const { data: apr } = useQuery<number>({
    queryKey: ['stakingApr'],
    queryFn: StakingService.getStakingApr,
    refetchInterval: 300000, // 5 minutes
  });

  return {
    validators: validators || [],
    apr: apr || 0,
    isLoadingValidators,
  };
}
