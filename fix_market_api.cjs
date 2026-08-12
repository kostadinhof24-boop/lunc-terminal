const fs = require('fs');
const path = require('path');

const w = (p, lines) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const content = lines.join('\n');
  fs.writeFileSync(p, content, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Correction de l'API Market Data pour Vercel...");

w('src/app/api/network-stats/market-data/route.ts', [
  "import { NextResponse } from 'next/server';",
  "import axios from 'axios';",
  "",
  "export async function GET() {",
  "  try {",
  "    // 1. On utilise CoinGecko (API simple/price) qui autorise les serveurs US de Vercel",
  "    const priceRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=terra-classic&vs_currencies=usd&include_24hr_change=true');",
  "    const price = priceRes.data['terra-classic'].usd;",
  "    const change24h = priceRes.data['terra-classic'].usd_24h_change;",
  "    ",
  "    // 2. On récupère la supply sur le LCD pour calculer le Market Cap",
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

console.log('\n🎉 API Market Data corrigée !');