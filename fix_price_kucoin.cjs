const fs = require('fs');
const path = require('path');

const w = (p, lines) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const content = lines.join('\n');
  fs.writeFileSync(p, content, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Passage à l'API KuCoin pour le prix...");

w('src/app/api/network-stats/market-data/route.ts', [
  "import { NextResponse } from 'next/server';",
  "import axios from 'axios';",
  "",
  "export async function GET() {",
  "  try {",
  "    // 1. Utilisation de KuCoin (aucun blocage sur les serveurs Vercel US)",
  "    const statsRes = await axios.get('https://api.kucoin.com/api/v1/market/stats?symbol=LUNC-USDT');",
  "    const price = parseFloat(statsRes.data.data.last);",
  "    // changeRate est une string comme '0.004' (pour 0.4%)",
  "    const change24h = parseFloat(statsRes.data.data.changeRate) * 100;",
  "    ",
  "    // 2. Récupération de la supply sur le LCD Terra",
  "    const supplyRes = await axios.get('https://terra-classic-lcd.publicnode.com/cosmos/bank/v1beta1/supply/by_denom?denom=uluna');",
  "    const totalSupply = parseFloat(supplyRes.data.amount.amount) / 1_000_000;",
  "    const marketCap = price * totalSupply;",
  "    ",
  "    return NextResponse.json({",
  "      success: true,",
  "      data: { price, marketCap, change24h }",
  "    });",
  "  } catch (error) {",
  "    console.error('Erreur Market Data:', error.message);",
  "    return NextResponse.json({ success: false, error: 'Failed to fetch market data' }, { status: 500 });",
  "  }",
  "}"
]);

console.log('\n🎉 API Prix mise à jour avec KuCoin !');