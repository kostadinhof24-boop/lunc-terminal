
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
