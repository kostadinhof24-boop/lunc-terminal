"use client";

import { useState } from "react";
import { useBurn } from "../hooks/useBurn";
import { motion } from "framer-motion";
import { Flame, AlertTriangle, Loader2 } from "lucide-react";
import { useWallet } from "@/features/wallet/hooks/useWallet"; 
import { useLanguageStore } from "@/store/languageStore";

const translations = {
  fr: { engine: "Moteur de Burn DFLunc", batches: "Nombre de Lots (1 = 5000 LUNC)", luncToBurn: "LUNC à brûler :", ustcFee: "Frais USTC :", burn: "Burn", confirm: "Confirmation Ledger...", connect: "Connectez votre wallet", txSuccess: "✅ Transaction réussie ! Hash : " },
  en: { engine: "DFLunc Burn Engine", batches: "Number of Batches (1 = 5000 LUNC)", luncToBurn: "LUNC to burn:", ustcFee: "USTC Fee:", burn: "Burn", confirm: "Confirm on Ledger...", connect: "Connect your wallet", txSuccess: "✅ Transaction successful! Hash: " },
  zh: { engine: "DFLunc 销毁引擎", batches: "批次数量 (1 = 5000 LUNC)", luncToBurn: "待销毁 LUNC：", ustcFee: "USTC 费用：", burn: "销毁", confirm: "在 Ledger 上确认...", connect: "连接您的钱包", txSuccess: "✅ 交易成功！哈希： " }
};

export default function BurnTracker() {
  const { address } = useWallet();
  const { executeBurn, isBurning, txHash, error } = useBurn();
  const [batches, setBatches] = useState(1);
  const lang = useLanguageStore((state) => state.lang);
  const t = translations[lang as keyof typeof translations] || translations.en;

  const luncAmount = batches * 5000;
  const ustcFee = batches * 4.99975;
  const isAmountValid = batches >= 1;

  const handleBurn = async () => {
    if (!address || !isAmountValid) return;
    await executeBurn(address, luncAmount);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-[#0B1022] to-[#050816] backdrop-blur-md"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-400" /> {t.engine}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 mb-2 block">{t.batches}</label>
          <input
            type="number"
            value={batches}
            onChange={(e) => setBatches(Math.max(0, Number(e.target.value)))}
            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500/50 transition-all text-lg font-bold"
            placeholder="1"
            min="1"
            step="1"
          />
          <div className="flex justify-between items-center mt-2 text-xs">
            <span className="text-gray-500">{t.luncToBurn}</span>
            <span className="font-medium text-white">{luncAmount.toLocaleString()} LUNC</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-xs">
            <span className="text-gray-500">{t.ustcFee}</span>
            <span className="font-medium text-yellow-400">{ustcFee.toFixed(5)} USTC</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg text-xs flex items-start gap-2 bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {txHash && (
          <div className="p-3 rounded-lg text-xs bg-green-500/10 text-green-400 border border-green-500/20 break-all">
            {t.txSuccess} {txHash}
          </div>
        )}

        <button
          onClick={handleBurn}
          disabled={isBurning || !isAmountValid || !address}
          className="w-full py-3 rounded-lg bg-orange-500/20 border border-orange-500/50 text-orange-400 font-semibold hover:bg-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isBurning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t.confirm}
            </>
          ) : !address ? (
            t.connect
          ) : (
            <>
              <Flame className="w-4 h-4" />
              {t.burn}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
