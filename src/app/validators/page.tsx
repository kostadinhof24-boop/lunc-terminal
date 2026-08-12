"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle } from "lucide-react";

const LCD_URL = "https://terra-classic-lcd.publicnode.com";

interface ValidatorData {
  operator_address: string;
  description: {
    moniker: string;
    identity?: string;
    website?: string;
  };
  status: string;
  jailed: boolean;
  tokens: string;
  commission: {
    commission_rates: {
      rate: string;
    };
  };
}

export default function ValidatorsPage() {
  const [validators, setValidators] = useState<ValidatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVotingPower, setTotalVotingPower] = useState(0);

  useEffect(() => {
    const fetchValidators = async () => {
      try {
        const res = await fetch(`${LCD_URL}/cosmos/staking/v1beta1/validators?pagination.limit=100&status=BOND_STATUS_BONDED`);
        const data = await res.json();
        const activeValidators = data.validators || [];
        
        const total = activeValidators.reduce((acc: number, v: ValidatorData) => acc + Number(v.tokens), 0);
        setTotalVotingPower(total);
        
        activeValidators.sort((a: ValidatorData, b: ValidatorData) => Number(b.tokens) - Number(a.tokens));
        setValidators(activeValidators);
      } catch (error) {
        console.error("Error fetching validators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchValidators();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-t-[#F0B90B] border-gray-700 rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading validators...</p>
      </div>
    );
  }

  const formatNum = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(2) + "K";
    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-white">Validators</h1>
            <p className="text-gray-400 mt-2">Active validators securing the Terra Classic network</p>
          </div>
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total Bonded</p>
            <p className="text-xl font-bold text-[#F0B90B]">{formatNum(totalVotingPower)} LUNC</p>
          </div>
        </motion.div>

        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 text-xs uppercase text-gray-500 tracking-wider">
            <div className="col-span-5">Validator</div>
            <div className="col-span-3 text-right">Voting Power</div>
            <div className="col-span-2 text-right">% of Total</div>
            <div className="col-span-2 text-right">Commission</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {validators.map((val, index) => {
              const votingPower = Number(val.tokens);
              const percentage = (votingPower / totalVotingPower) * 100;
              const commission = (Number(val.commission.commission_rates.rate) * 100).toFixed(1);

              return (
                <motion.div 
                  key={val.operator_address}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B1022] to-[#1a1f3a] flex items-center justify-center border border-white/10 text-[#F0B90B] font-bold">
                      {val.description.moniker.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{val.description.moniker}</span>
                      {val.jailed ? (
                        <span className="flex items-center gap-1 text-xs text-red-400">
                          <AlertTriangle className="w-3 h-3" /> Jailed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <ShieldCheck className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-6 md:col-span-3 text-right">
                    <p className="text-gray-300">{formatNum(votingPower)}</p>
                    <p className="text-xs text-gray-500">LUNC</p>
                  </div>

                  <div className="col-span-6 md:col-span-2 text-right">
                    <p className="text-gray-300">{percentage.toFixed(2)}%</p>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 mt-1">
                      <div className="bg-[#F0B90B] h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-2 text-right">
                    <span className="text-gray-300">{commission}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}