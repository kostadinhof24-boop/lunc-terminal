"use client";

import { useState, useEffect } from "react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useWallet } from "@/features/wallet/hooks/useWallet";

const RPC_URL = "https://terra-classic-rpc.publicnode.com:443";

// ⚠️ REMPLACE CECI PAR LA VRAIE ADRESSE DU CONTRAT DFC (Token CW20)
const DFC_TOKEN_CONTRACT = "VOTRE_VRAIE_ADRESSE_ICI"; 

export function useDfcBalance() {
  const { address } = useWallet();
  const [balance, setBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      // Si l'adresse du contrat n'est pas configurée, on ne fait pas d'appel réseau
      if (!address || DFC_TOKEN_CONTRACT === "VOTRE_VRAIE_ADRESSE_ICI") {
        setBalance("0.00");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const client = await CosmWasmClient.connect(RPC_URL);
        
        const response = await client.queryContractSmart(DFC_TOKEN_CONTRACT, {
          balance: { address: address }
        });
        
        const microBalance = parseInt(response.balance, 10);
        const macroBalance = (microBalance / 1_000_000).toFixed(2);
        
        setBalance(macroBalance);
      } catch (error) {
        console.error("Erreur lors de la récupération du solde DFC:", error);
        setBalance("0.00");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  return { balance, loading };
}
