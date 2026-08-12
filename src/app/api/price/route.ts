import { NextResponse } from 'next/server';


import axios from 'axios';



export const dynamic = 'force-dynamic';
export async function GET() {
  // Valeur de secours si toutes les APIs plantent
  const FALLBACK_PRICE = 0.000049;
  const FALLBACK_CHANGE = 0.5;

  try {
    // On tente Binance (fonctionne trÃ¨s bien cÃ´tÃ© serveur sur Vercel)
    const res = await axios.get('https://api.binance.com/api/v3/ticker/24hr?symbol=LUNCUSDT', { timeout: 5000 });
    const price = parseFloat(res.data.lastPrice);
    const change24h = parseFloat(res.data.priceChangePercent);
    if (price > 0) return NextResponse.json({ price, change24h });
  } catch (e) { console.error('Binance API failed:', e.message); }
  
  try {
    // Fallback sur CoinGecko
    const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=terra-classic&vs_currencies=usd&include_24hr_change=true', { timeout: 5000 });
    const price = res.data['terra-classic'].usd;
    const change24h = res.data['terra-classic'].usd_24h_change;
    if (price > 0) return NextResponse.json({ price, change24h });
  } catch (e) { console.error('CoinGecko API failed:', e.message); }

  // Si tout Ã©choue, on renvoie le prix de secours pour ne pas casser l'UI
  return NextResponse.json({ price: FALLBACK_PRICE, change24h: FALLBACK_CHANGE, fallback: true });
}


