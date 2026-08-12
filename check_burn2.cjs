const axios = require('axios');

const BURN_ADDRESS = 'terra1sk06e3dyexuq4shw77y4dtt0xpqkcjm974wu5w';
const TERRA_LCD = 'https://phoenix-lcd.terra.dev';

async function check() {
  console.log("🔍 Test: Terra Official LCD (phoenix-lcd)");
  try {
    const res = await axios.get(`${TERRA_LCD}/cosmos/bank/v1beta1/balances/${BURN_ADDRESS}/by_denom?denom=uluna`);
    console.log("✅ Réponse:", JSON.stringify(res.data, null, 2));
    const burned = parseFloat(res.data.balance.amount) / 1_000_000;
    console.log("🔥 Total Burned:", burned.toLocaleString());
  } catch (err) {
    console.error("❌ Erreur:", err.response?.data?.message || err.message);
  }
}

check();