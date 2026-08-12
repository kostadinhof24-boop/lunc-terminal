"use client";

import { useWallet } from "../hooks/useWallet";
import { useWalletBalances } from "../hooks/useWalletBalances";
import { Wallet as WalletIcon, Loader2, Coins } from "lucide-react";

export default function WalletDashboardClient() {
  const { address } = useWallet();
  const { stablecoins, otherTokens, totalValue, loading } = useWalletBalances();

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <WalletIcon className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">Wallet non connecté</p>
        <p className="text-sm">Connectez votre wallet pour voir vos actifs.</p>
      </div>
    );
  }

  const renderTable = (tokens: any[], title: string) => (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Coins className="w-5 h-5 text-cyan-400" /> {title}
      </h3>
      <div className="space-y-2">
        <div className="hidden md:grid grid-cols-4 gap-4 px-4 pb-2 border-b border-white/5 text-xs uppercase text-gray-500">
          <div>Token</div>
          <div>Prix</div>
          <div>Quantité</div>
          <div className="text-right">Valeur</div>
        </div>

        {tokens.map((token) => (
          <div key={token.symbol} className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center p-4 rounded-lg hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3 col-span-2 md:col-span-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{ backgroundColor: token.color }}>
                {token.symbol[0]}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{token.symbol}</p>
                <p className="text-xs text-gray-500">{token.name}</p>
              </div>
            </div>
            <div className="text-right md:text-left">
              <p className="text-xs text-gray-500 md:hidden">Prix</p>
              <p className="text-sm text-gray-300">${token.price > 0 ? token.price.toFixed(6) : "-"}</p>
            </div>
            <div className="text-right md:text-left">
              <p className="text-xs text-gray-500 md:hidden">Quantité</p>
              <p className="text-sm text-white font-medium">{token.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 md:hidden">Valeur</p>
              <p className="text-sm font-bold text-white">${token.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0B1022] to-[#050816]">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Valeur Totale du Portfolio</p>
        {loading ? (
          <div className="h-10 w-48 bg-white/5 animate-pulse rounded-lg"></div>
        ) : (
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        )}
        <p className="text-sm text-gray-600 mt-2 font-mono break-all">{address}</p>
      </div>

      {loading ? (
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-lg"></div>)}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {stablecoins.length > 0 && renderTable(stablecoins, "Stablecoins")}
          {otherTokens.length > 0 && renderTable(otherTokens, "Mes Autres Tokens")}
          {stablecoins.length === 0 && otherTokens.length === 0 && (
             <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center text-gray-500">
               Aucun token trouvé dans ce portefeuille.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
