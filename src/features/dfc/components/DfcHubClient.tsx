"use client";

import * as React from "react";
import BurnTracker from "@/features/burn/components/BurnTracker";
import { useDFC } from "@/hooks/useDFC"; 
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { Wallet, Loader2, AlertTriangle } from "lucide-react";

export default function DfcHubClient() {
  const { address } = useWallet();
  const [stakeAmount, setStakeAmount] = React.useState("");
  const [unstakeAmount, setUnstakeAmount] = React.useState("");
  
  const { 
    dfcBalance, 
    stakedBalance, 
    pendingRewards, 
    pendingFees, 
    claimRewards, 
    claimFees, 
    stakeDFC, 
    unstakeDFC, 
    processingAction, 
    txHash, 
    error 
  } = useDFC();

  const handleStake = () => {
    const amt = parseFloat(stakeAmount);
    if (amt > 0) stakeDFC(amt);
  };

  const handleUnstake = () => {
    const amt = parseFloat(unstakeAmount);
    if (amt > 0) unstakeDFC(amt);
  };

  return (
    <div className="w-full min-h-screen bg-[#050816] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">DFC Hub</h1>
            <p className="text-gray-500 mt-1">The nerve center of the DFLunc protocol: Burn, Staking and Rewards.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1">
            <BurnTracker />
          </div>

          <div className="lg:col-span-2 space-y-6">
            
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-400" /> Wallet & Rewards
              </h2>
              
              {error && (
                <div className="p-3 rounded-lg text-xs mb-4 flex items-start gap-2 bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {txHash && (
                <div className="p-3 rounded-lg text-xs mb-4 bg-green-500/10 text-green-400 border border-green-500/20 break-all">
                  ✅ Transaction successful! Hash: {txHash}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">Available DFC</p>
                  <p className="text-xl font-bold text-white">{dfcBalance}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">Staked DFC</p>
                  <p className="text-xl font-bold text-green-400">{stakedBalance}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">Rewards DFC</p>
                  <p className="text-xl font-bold text-white">{pendingRewards}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">Rewards USTC</p>
                  <p className="text-xl font-bold text-yellow-400">{pendingFees}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <button 
                  onClick={() => claimRewards()} 
                  disabled={!!processingAction}
                  className="flex-1 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processingAction === "claimDfc" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Claim DFC
                </button>
                <button 
                  onClick={() => claimFees()} 
                  disabled={!!processingAction}
                  className="flex-1 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processingAction === "claimUstc" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Claim USTC
                </button>
              </div>

              <div className="text-xs text-gray-500 uppercase mb-4">Connected Address</div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/5 text-sm text-gray-400 font-mono mb-6 break-all">
                {address || "Wallet not connected"}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Stake my DFC</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="Amount" 
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-green-500/50" 
                    />
                    <button 
                      onClick={() => setStakeAmount(dfcBalance)} 
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:bg-white/10"
                    >
                      MAX
                    </button>
                  </div>
                  <button 
                    onClick={handleStake} 
                    disabled={!!processingAction}
                    className="w-full py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingAction === "stake" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Stake
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Unstake my DFC</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      placeholder="Amount" 
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-red-500/50" 
                    />
                    <button 
                      onClick={() => setUnstakeAmount(stakedBalance)} 
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:bg-white/10"
                    >
                      MAX
                    </button>
                  </div>
                  <button 
                    onClick={handleUnstake} 
                    disabled={!!processingAction}
                    className="w-full py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingAction === "unstake" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Unstake
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}