import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

async function main() {
  console.log("🔍 Connexion à Terra Classic...");
  const client = await CosmWasmClient.connect('https://terra-classic-rpc.publicnode.com');
  
  // L'adresse CORRECTE du token DFC
  const tokenContract = 'terra1r9laq5788d36gxmf8jkayln3g5szg4ql0nmccs';
  
  try {
    console.log("Interrogation du token DFC pour trouver le Minter...");
    const minterInfo = await client.queryContractSmart(tokenContract, { minter: {} });
    console.log("\n✅ RÉSULTAT :");
    console.log("Le contrat de Burn (Minter) est :", minterInfo.minter);
  } catch (e) {
    console.error("❌ Erreur:", e.message);
  }
}
main();