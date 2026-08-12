const fs = require('fs');
const path = require('path');

const w = (p, c) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Ajout de la fonctionnalité de Délégation...");

// 1. Mise à jour de WalletService pour supporter MsgDelegate natif
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
    
    // On utilise SigningStargateClient pour les messages natifs Cosmos (Staking)
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
}
`);

// 2. Création du composant DelegateModal
w('src/features/staking/components/DelegateModal.tsx', `
'use client';

import { useState } from 'react';
import { X, Loader, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { WalletService } from '@/features/wallet/services/wallet.service';

interface DelegateModalProps {
  validatorAddress: string;
  validatorName: string;
  onClose: () => void;
}

export default function DelegateModal({ validatorAddress, validatorName, onClose }: DelegateModalProps) {
  const { address } = useWallet();
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelegate = async () => {
    if (!address || !amount) return;
    setIsProcessing(true);
    setError(null);
    setTxHash(null);

    try {
      const amountUluna = Math.floor(parseFloat(amount) * 1_000_000).toString();
      if (parseFloat(amountUluna) <= 0) throw new Error("Montant invalide");

      const walletService = new WalletService();
      const hash = await walletService.delegateTokens(address, validatorAddress, amountUluna);
      setTxHash(hash);
    } catch (err: any) {
      console.error("Erreur Délégation:", err);
      setError(err.message || "La délégation a échoué.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-galaxy-gray hover:text-galaxy-white">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-2">Déléguer du LUNC</h2>
        <p className="text-galaxy-gray text-sm mb-6">Vers: <span className="font-bold text-galaxy-white">{validatorName}</span></p>

        <div className="mb-6">
          <label className="text-galaxy-gray text-sm mb-2 block">Montant à Déléguer (LUNC)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="bg-space-bg border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-galaxy-blue text-lg font-bold"
          />
          <p className="text-xs text-galaxy-gray-muted mt-2 font-mono break-all">{validatorAddress}</p>
        </div>

        {txHash && (
          <div className="mb-4 bg-galaxy-green/10 border border-galaxy-green/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-green">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Succès ! Hash: {txHash.slice(0, 20)}...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-galaxy-red/10 border border-galaxy-red/30 rounded-xl p-4 flex items-center gap-3 text-galaxy-red">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button 
          onClick={handleDelegate}
          disabled={isProcessing || !amount}
          className="w-full px-4 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 bg-galaxy-blue/20 text-galaxy-blue border border-galaxy-blue/30 hover:bg-galaxy-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? <><Loader className="w-5 h-5 animate-spin" /> Délégation en cours...</> : 'Confirmer la Délégation'}
        </button>
      </div>
    </div>
  );
}
`);

// 3. Mise à jour de ValidatorsList pour ouvrir le Modal
w('src/features/staking/components/ValidatorsList.tsx', `
'use client';

import { useStaking } from '../hooks/useStaking';
import { Loader, ShieldCheck, ExternalLink, Users } from 'lucide-react';
import { useState } from 'react';
import { Validator } from '../services/staking.service';
import DelegateModal from './DelegateModal';

export default function ValidatorsList() {
  const { validators, apr, isLoadingValidators } = useStaking();
  const [search, setSearch] = useState<string>('');
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);

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
                  <button 
                    onClick={() => setSelectedValidator(val)}
                    className="bg-galaxy-blue/20 text-galaxy-blue px-4 py-2 rounded-xl font-bold text-sm hover:bg-galaxy-blue/30 flex items-center gap-2"
                  >
                    Déléguer <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedValidator && (
        <DelegateModal 
          validatorAddress={selectedValidator.operator_address}
          validatorName={selectedValidator.description.moniker}
          onClose={() => setSelectedValidator(null)}
        />
      )}
    </div>
  );
}
`);

console.log('\n🎉 Délégation prête ! Clique sur "Déléguer" pour tester.');