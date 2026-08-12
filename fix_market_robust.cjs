const fs = require('fs');
const path = require('path');

const w = (p, lines) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const content = lines.join('\n');
  fs.writeFileSync(p, content, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Création de l'API Market Data multi-sources...");

w('src/app/api/network-stats/market-data/route.ts', [
  "import { NextResponse } from 'next/server';",
  "import axios from 'axios';",
  "",
  "export async function GET() {",
  "  // On récupère la supply d'abord (ça marche toujours sur le LCD)",
  "  let totalSupply = 6_500_000_000_000;",
  "  try {",
  "    const supplyRes = await axios.get('https://terra-classic-lcd.publicnode.com/cosmos/bank/v1beta1/supply/by_denom?denom=uluna', { timeout: 5000 });",
  "    totalSupply = parseFloat(supplyRes.data.amount.amount) / 1_000_000;",
  "  } catch (e) {",
  "    console.error('Erreur Supply:', e.message);",
  "  }",
  "",
  "  // --- SOURCE 1: KuCoin ---",
  "  try {",
  "    const res = await axios.get('https://api.kucoin.com/api/v1/market/stats?symbol=LUNC-USDT', { timeout: 5000 });",
  "    const price = parseFloat(res.data.data.last);",
  "    const change24h = parseFloat(res.data.data.changeRate) * 100;",
  "    if (price > 0) {",
  "      return NextResponse.json({ success: true, data: { price, marketCap: price * totalSupply, change24h } });",
  "    }",
  "  } catch (e) { console.error('KuCoin failed:', e.message); }",
  "  ",
  "  // --- SOURCE 2: CoinGecko ---",
  "  try {",
  "    const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=terra-classic&vs_currencies=usd&include_24hr_change=true', { timeout: 5000 });",
  "    const price = res.data['terra-classic'].usd;",
  "    const change24h = res.data['terra-classic'].usd_24h_change;",
  "    if (price > 0) {",
  "      return NextResponse.json({ success: true, data: { price, marketCap: price * totalSupply, change24h } });",
  "    }",
  "  } catch (e) { console.error('CoinGecko failed:', e.message); }",
  "",
  "  // --- SOURCE 3: CoinCap ---",
  "  try {",
  "    const res = await axios.get('https://api.coincap.io/v2/assets/terra-luna', { timeout: 5000 });",
  "    const price = parseFloat(res.data.data.priceUsd);",
  "    const change24h = parseFloat(res.data.data.changePercent24Hr);",
  "    if (price > 0) {",
  "      return NextResponse.json({ success: true, data: { price, marketCap: price * totalSupply, change24h } });",
  "    }",
  "  } catch (e) { console.error('CoinCap failed:', e.message); }",
  "  ",
  "  // --- FALLBACK ULTIME ---",
  "  const fallbackPrice = 0.000049;",
  "  const fallbackChange = 0.5;",
  "  return NextResponse.json({ success: true, data: { price: fallbackPrice, marketCap: fallbackPrice * totalSupply, change24h: fallbackChange, fallback: true } });",
  "}"
]);

console.log('\n🎉 API Market Data multi-sources créée !');