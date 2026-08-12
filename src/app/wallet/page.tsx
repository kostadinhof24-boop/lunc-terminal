"use client";

import { useWalletBalances, WalletAsset } from "@/features/wallet/hooks/useWalletBalances";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { motion } from "framer-motion";
import { WalletIcon, Lock } from "lucide-react";

export default function WalletDashboardPage() {
  const { assets, totalValue, stakedLunc, loading } = useWalletBalances();
  const { isConnected, connect } = useWallet();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <WalletIcon className="w-16 h-16 text-gray-600" />
        <h2 className="text-2xl font-bold text-white">Wallet Not Connected</h2>
        <p className="text-gray-400 text-center max-w-md">
          Connect your Keplr, Leap, or Station wallet to view your balances, staking, and tokens.
        </p>
        <button 
          onClick={connect}
          className="px-6 py-3 bg-[#F0B90B] text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-t-[#F0B90B] border-gray-700 rounded-full animate-spin"></div>
        <p className="text-gray-400">Syncing with blockchain...</p>
      </div>
    );
  }

  // Formatage intelligent des nombres (K, M, B)
  const formatNum = (num: number) => {
    if (num === 0) return "0";
    if (num < 0.01) return num.toFixed(6);
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(2) + "K";
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // Séparer les actifs par catégorie
  const stablecoins = assets.filter(a => a.type === "stablecoin");
  const nativeTokens = assets.filter(a => a.type === "native");
  const stakedTokens = assets.filter(a => a.type === "staked");
  const cw20Tokens = assets.filter(a => a.type === "cw20");

  const renderAssetRow = (asset: WalletAsset, index: number) => (
    <motion.div 
      key={`${asset.symbol}-${index}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-lg"
          style={{ backgroundColor: asset.color }}
        >
          {asset.symbol.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-lg">{asset.symbol}</p>
          <p className="text-sm text-gray-500">{asset.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-lg">{formatNum(asset.amount)}</p>
        <p className="text-sm text-gray-400">${asset.value.toFixed(2)}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Solde Total */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1022] to-[#050816] border border-white/10 p-8 shadow-2xl"
        >
          <div className="absolute inset-0 opacity-10"></div>
          <div className="relative z-10">
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Total Balance</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              ${totalValue.toFixed(2)}
            </h1>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Lock className="w-4 h-4 text-[#10B981]" />
                <span className="text-sm text-gray-300">{formatNum(stakedLunc)} LUNC Staked</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <WalletIcon className="w-4 h-4 text-[#F0B90B]" />
                <span className="text-sm text-gray-300">{assets.length} Assets</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Conteneur Principal en Grille */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Colonne Gauche : Liquidités */}
          <div className="space-y-6">
            
            {/* Section Stablecoins */}
            {stablecoins.length > 0 && (
              <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="text-xl font-semibold text-white">Stablecoins</h2>
                  <p className="text-xs text-gray-500">Dollar-pegged stable value</p>
                </div>
                <div className="divide-y divide-white/5">
                  {stablecoins.map(renderAssetRow)}
                </div>
              </div>
            )}

            {/* Section Tokens Natifs */}
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">Native Tokens</h2>
                <p className="text-xs text-gray-500">LUNC and other on-chain assets</p>
              </div>
              <div className="divide-y divide-white/5">
                {nativeTokens.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">No native tokens in liquidity.</div>
                ) : (
                  nativeTokens.map(renderAssetRow)
                )}
              </div>
            </div>

          </div>

          {/* Colonne Droite : Staking & Smart Contracts */}
          <div className="space-y-6">

            {/* Section Staking */}
            {stakedTokens.length > 0 && (
              <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="text-xl font-semibold text-[#10B981]">Staking</h2>
                  <p className="text-xs text-gray-500">Tokens delegated to validators</p>
                </div>
                <div className="divide-y divide-white/5">
                  {stakedTokens.map(renderAssetRow)}
                </div>
              </div>
            )}

            {/* Section CW20 */}
            {cw20Tokens.length > 0 && (
              <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="text-xl font-semibold text-[#8A2BE2]">Smart Contracts (CW20)</h2>
                  <p className="text-xs text-gray-500">Protocol-generated tokens</p>
                </div>
                <div className="divide-y divide-white/5">
                  {cw20Tokens.map(renderAssetRow)}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}