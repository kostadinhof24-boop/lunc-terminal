import { NextResponse } from 'next/server';



export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    // L'identifiant exact de LUNC sur CoinGecko
    const url = 'https://api.coingecko.com/api/v3/coins/terra-luna?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true';
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LUNC-Terminal/1.0'
      },
      next: { revalidate: 60 } // Cache de 60 secondes pour éviter de spammer l'API
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch from CoinGecko' }, { status: response.status });
    }

    const data = await response.json();
    
    // On renvoie uniquement les données utiles pour le frontend
    return NextResponse.json({
      currentPrice: data.market_data.current_price.usd,
      priceChange24h: data.market_data.price_change_percentage_24h,
      priceChange7d: data.market_data.price_change_percentage_7d,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      circulatingSupply: data.market_data.circulating_supply,
      totalSupply: data.market_data.total_supply,
      sparkline: data.market_data.sparkline_7d.price,
    });
  } catch (error) {
    console.error('[API Market Route] Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


