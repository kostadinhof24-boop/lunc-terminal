const fs = require('fs');
const path = require('path');

const w = (p, lines) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const content = lines.join('\n');
  fs.writeFileSync(p, content, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Correction de l'API Burn avec une source tierce...");

// 1. Route API pour fetcher le Total Burned (via Terrascope)
w('src/app/api/network-stats/burn/route.ts', [
  "import { NextResponse } from 'next/server';",
  "import axios from 'axios';",
  "",
  "export async function GET() {",
  "  try {",
  "    // On utilise l'API de Terrascope qui indexe correctement le burn",
  "    const res = await axios.get('https://api.terrasco.pe/v1/stats');",
  "    const burned = res.data.burned_lunc / 1_000_000; // L'API renvoie des microLUNC",
  "    return NextResponse.json({ success: true, totalBurned: burned });",
  "  } catch (err) {",
  "    try {",
  "      // Fallback sur une autre source si Terrascope échoue",
  "      const fallbackRes = await axios.get('https://api.luncdao.com/burn');",
  "      const burned = fallbackRes.data.total / 1_000_000;",
  "      return NextResponse.json({ success: true, totalBurned: burned });",
  "    } catch (e2) {",
  "      return NextResponse.json({ success: false, error: 'Failed to fetch burn data' }, { status: 500 });",
  "    }",
  "  }",
  "}"
]);

console.log('\n🎉 API Burn corrigée ! Va sur le Dashboard pour vérifier le Total Burned.');