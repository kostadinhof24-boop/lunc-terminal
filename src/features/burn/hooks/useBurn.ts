"use client";

import { useState } from "react";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { coin } from "@cosmjs/stargate";

const RPC_URL = "https://terra-classic-rpc.publicnode.com:443";
const DFLUNC_CONTRACT = "terra1eewgymwqqp0wcdllmz36xaank8lj3fcylzj3wx";

export function useBurn() {
  const [isBurning, setIsBurning] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeBurn = async (address: string, amountLuncMacro: number) => {
    if (!address || amountLuncMacro <= 0) return;
    
    setIsBurning(true);
    setError(null);
    setTxHash(null);

    try {
      const w = window as any;
      await w.keplr.enable("columbus-5");
      const offlineSigner = w.keplr.getOfflineSigner("columbus-5");
      const signingClient = await SigningCosmWasmClient.connectWithSigner(RPC_URL, offlineSigner);

      // 1. Calcul du nombre de batches (1 batch = 5000 LUNC)
      const batchNumber = Math.floor(amountLuncMacro / 5000);
      if (batchNumber === 0) {
        throw new Error("Le montant minimum est de 5000 LUNC (1 batch).");
      }

      // 2. Calcul des fonds à envoyer (LUNC + USTC)
      const amountUluna = (batchNumber * 5000 * 1_000_000).toString();
      const amountUusd = (batchNumber * 4.99975 * 1_000_000).toString(); // Frais USTC par batch
      
      const funds = [
        coin(amountUluna, "uluna"),
        coin(amountUusd, "uusd")
      ];

      const fee = {
        amount: [coin("1500000", "uluna")],
        gas: "1500000"
      };

      // 3. Appel de la fonction avec le bon paramètre
      const result = await signingClient.execute(
        address, 
        DFLUNC_CONTRACT, 
        { burn_batch: { batch_number: batchNumber } }, // On passe le paramètre attendu
        fee, 
        "Lunc Terminal Burn",
        funds // On envoie LUNC + USTC
      );
      
      setTxHash(result.transactionHash);
    } catch (err: any) {
      console.error("Erreur Burn:", err);
      setError(err.message || "La transaction a échoué.");
    } finally {
      setIsBurning(false);
    }
  };

  return { executeBurn, isBurning, txHash, error };
}
