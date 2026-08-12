"use client";

import { useState, useEffect } from "react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useWallet } from "./useWallet"; 
import { useMarketData } from "@/features/market/hooks/useMarketData";
import { DFC_TOKEN_CONTRACT } from "@/config/contracts";

const RPC_URL = "https://terra-classic-rpc.publicnode.com:443";
const LCD_URL = "https://terra-classic-lcd.publicnode.com";

export interface WalletAsset {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  value: number;
  color: string;
  type: "native" | "stablecoin" | "cw20" | "staked";
}

export function useWalletBalances() {
  const { address, isConnected } = useWallet();
  const { data: market } = useMarketData();
  const [assets, setAssets] = useState<WalletAsset[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [stakedLunc, setStakedLunc] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!isConnected || !address) {
        setAssets([]);
        setTotalValue(0);
        setStakedLunc(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const client = await CosmWasmClient.connect(RPC_URL);
        const luncPrice = market?.currentPrice || 0;

        const tokenList: WalletAsset[] = [];
        let calculatedStakedLunc = 0;

        // 1. Récupérer le LUNC Staké via l'API LCD
        try {
          const stakingRes = await fetch(`${LCD_URL}/cosmos/staking/v1beta1/delegations/${address}`);
          if (stakingRes.ok) {
            const stakingData = await stakingRes.json();
            const delegations = stakingData.delegation_responses || [];
            for (const del of delegations) {
              calculatedStakedLunc += Number(del.balance?.amount || 0);
            }
            calculatedStakedLunc = calculatedStakedLunc / 1_000_000;
            setStakedLunc(calculatedStakedLunc);

            if (calculatedStakedLunc > 0) {
              tokenList.push({
                symbol: "LUNC",
                name: "Luna Classic (Staked)",
                amount: calculatedStakedLunc,
                price: luncPrice,
                value: calculatedStakedLunc * luncPrice,
                color: "#10B981",
                type: "staked"
              });
            }
          }
        } catch (e) {
          console.error("Erreur staking:", e);
        }

        // 2. Récupérer tous les soldes natifs (LUNC, USTC, etc.) via l'API LCD
        try {
          const bankRes = await fetch(`${LCD_URL}/cosmos/bank/v1beta1/balances/${address}`);
          if (bankRes.ok) {
            const bankData = await bankRes.json();
            const balances = bankData.balances || [];
            
            for (const bal of balances) {
              if (bal.denom === "uluna") {
                const amount = Number(bal.amount) / 1_000_000;
                tokenList.push({
                  symbol: "LUNC",
                  name: "Luna Classic",
                  amount,
                  price: luncPrice,
                  value: amount * luncPrice,
                  color: "#F0B90B",
                  type: "native"
                });
              } else if (bal.denom === "uusd") {
                const amount = Number(bal.amount) / 1_000_000;
                tokenList.push({
                  symbol: "USTC",
                  name: "TerraUSD Classic",
                  amount,
                  price: 1,
                  value: amount,
                  color: "#00A3FF",
                  type: "stablecoin"
                });
              }
            }
          }
        } catch (e) {
          console.error("Erreur bank balances:", e);
        }

        // 3. Récupérer le solde DFC (CW20) via CosmWasm
        try {
          const dfcRes = await client.queryContractSmart(DFC_TOKEN_CONTRACT, { balance: { address } });
          const dfcAmount = Number(dfcRes.balance || 0) / 1_000_000;
          if (dfcAmount > 0) {
            tokenList.push({
              symbol: "DFC",
              name: "DFLUNC Token",
              amount: dfcAmount,
              price: 0,
              value: 0,
              color: "#8A2BE2",
              type: "cw20"
            });
          }
        } catch (e) {
          console.error("Erreur DFC:", e);
        }

        // Calculer la valeur totale
        const total = tokenList.reduce((acc, t) => acc + t.value, 0);
        
        setAssets(tokenList);
        setTotalValue(total);
      } catch (error) {
        console.error("Erreur globale wallet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [address, isConnected, market]);

  return { assets, totalValue, stakedLunc, loading };
}