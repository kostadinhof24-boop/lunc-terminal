const fs = require('fs');
const path = require('path');

const w = (p, c) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Création du module Staking...");

// 1. Service
w('src/features/staking/services/staking.service.ts', `
import axios from 'axios';
import { TERRA_CLASSIC_CONFIG } from '@/config/chains';

export interface Validator {
  operator_address: string;
  description: {
    moniker: string;
    identity?: string;
    website?: string;
    security_contact?: string;
    details?: string;
  };
  commission: {
    commission_rates: {
      rate: string;
      max_rate: string;
      max_change_rate: string;
    };
  };
  status: string;
  tokens: string;
  delegator_shares: string;
  jailed: boolean;
}

export const StakingService = {
  async getActiveValidators(): Promise<Validator[]> {
    try {
      const res = await axios.get(\`\${TERRA_CLASSIC_CONFIG.lcdUrl}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=100\`);
      return res.data.validators || [];
    } catch (err) {
      console.error("Erreur lors de la récupération des validateurs:", err);
      return [];
    }
  },

  async getStakingApr(): Promise<number> {
    try {
      const res = await axios.get(\`\${TERRA_CLASSIC_CONFIG.lcdUrl}/cosmos/mint/v1beta1/annual_provisions\`);
      const annualProvisions = parseFloat(res.data.annual_provisions);
      
      const poolRes = await axios.get(\`\${TERRA_CLASSIC_CONFIG.lcdUrl}/cosmos/staking/v1beta1/pool\`);
      const bondedTokens = parseFloat(poolRes.data.pool.bonded_tokens);
      
      if (bondedTokens === 0) return 0;
      const apr = (annualProvisions / bondedTokens) * 100;
      return apr;
    } catch {
      return 0;
    }
  }
};
`);

// 2. Hook
w('src/features/staking/hooks/useStaking.ts', `
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
`);

// 3. Composant UI
w('src/features/staking/components/ValidatorsList.tsx', `
'use client';

import { useStaking } from '../hooks/useStaking';
import { Loader, ShieldCheck, ExternalLink, Users } from 'lucide-react';
import { useState } from 'react';
import { Validator } from '../services/staking.service';

export default function ValidatorsList() {
  const { validators, apr, isLoadingValidators } = useStaking();
  const [search, setSearch] = useState<string>('');

  const filteredValidators: Validator[] = validators.filter((v: Validator) => 
    v.description.moniker.toLowerCase().includes(search.toLowerCase())
  );

  const totalVotingPower = validators.reduce((sum: number, v: Validator) => sum + parseFloat(v.tokens), 0);

  return (
    <div className="glass-card rounded-3xl p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-galaxy-blue" /> Validateurs Actifs
          </h2>
          <p className="text-galaxy-gray text-sm mt-1">{validators.length} validateurs sécurisent le réseau</p>
        </div>
        <div className="bg-galaxy-green/10 border border-galaxy-green/30 px-4 py-2 rounded-xl text-sm font-bold text-galaxy-green">
          APR Réseau: {apr.toFixed(2)}%
        </div>
      </div>

      <div className="mb-6">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un validateur..."
          className="bg-space-bg border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-galaxy-blue"
        />
      </div>

      {isLoadingValidators ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-galaxy-blue" />
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filteredValidators.map((val: Validator) => {
            const votingPower = (parseFloat(val.tokens) / totalVotingPower) * 100;
            const commission = parseFloat(val.commission.commission_rates.rate) * 100;
            
            return (
              <div key={val.operator_address} className="bg-space-bg/50 p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-4 hover:border-galaxy-blue/50 border border-transparent transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-galaxy-blue/20 flex items-center justify-center font-bold text-galaxy-blue">
                    {val.description.moniker.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-galaxy-white">{val.description.moniker}</h3>
                    <p className="text-xs text-galaxy-gray-muted font-mono">{val.operator_address.slice(0, 20)}...</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="text-galaxy-gray text-xs">Commission</p>
                    <p className="font-bold text-galaxy-white">{commission.toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-galaxy-gray text-xs">Voting Power</p>
                    <p className="font-bold text-galaxy-blue flex items-center gap-1">
                      <Users className="w-3 h-3" /> {votingPower.toFixed(2)}%
                    </p>
                  </div>
                  <button className="bg-galaxy-blue/20 text-galaxy-blue px-4 py-2 rounded-xl font-bold text-sm hover:bg-galaxy-blue/30 flex items-center gap-2">
                    Déléguer <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
`);

// 4. Page
w('src/app/validateurs/page.tsx', `
"use client";

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const ValidatorsList = dynamic(() => import('@/features/staking/components/ValidatorsList'), { ssr: false });

export default function ValidatorsPage() {
  return (
    <main className="min-h-screen relative container mx-auto px-6 py-8 max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-8 mb-6"
      >
        <h1 className="text-3xl font-bold mb-2">Staking Terra Classic</h1>
        <p className="text-galaxy-gray text-sm">Déléguer votre LUNC pour sécuriser le réseau et gagner des récompenses.</p>
      </motion.div>

      <ValidatorsList />
    </main>
  );
}
`);

console.log('\n🎉 Module Staking créé avec succès !');