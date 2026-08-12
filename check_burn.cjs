const axios = require('axios');

const BURN_ADDRESS = 'terra1sk06e3dyexuq4shw77y4dtt0xpqkcjm974wu5w';
const PUBLIC_NODE_LCD = 'https://terra-classic-lcd.publicnode.com';

async function check() {
  console.log("🔍 Test 1: PublicNode LCD (by_denom)");
  try {
    const res = await axios.get(`${PUBLIC_NODE_LCD}/cosmos/bank/v1beta1/balances/${BURN_ADDRESS}/by_denom?denom=uluna`);
    console.log("✅ Réponse:", JSON.stringify(res.data, null, 2));
    const burned = parseFloat(res.data.balance.amount) / 1_000_000;
    console.log("🔥 Total Burned:", burned);
  } catch (err) {
    console.error("❌ Erreur Test 1:", err.response?.data?.message || err.message);
  }

  console.log("\n🔍 Test 2: PublicNode LCD (balances classiques)");
  try {
    const res = await axios.get(`${PUBLIC_NODE_LCD}/cosmos/bank/v1beta1/balances/${BURN_ADDRESS}`);
    console.log("✅ Réponse:", JSON.stringify(res.data, null, 2));
    const bal = res.data.balances.find(b => b.denom === 'uluna');
    const burned = bal ? parseFloat(bal.amount) / 1_000_000 : 0;
    console.log("🔥 Total Burned:", burned);
  } catch (err) {
    console.error("❌ Erreur Test 2:", err.response?.data?.message || err.message);
  }
}

check();