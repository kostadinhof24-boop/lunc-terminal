import { NextResponse } from 'next/server';


import { getTotalBurned, getStakingPool, getTotalSupply, getBlockHeight, getActiveValidatorsCount } from '@/lib/api/terraApi';



export const revalidate = 60; // Cache de 60 secondes

interface NetworkStatsData {
  totalBurned: number;
  staked: number;
  stakingRatio: number;
  blockHeight: number;
  totalSupply: number;
  validators: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: string;
  source?: 'live' | 'cache';
}

let cachedNetworkStats: NetworkStatsData | null = null;
const CACHE_TTL_MS = 60 * 1000;
let cachedAt = 0;

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    // Appel Ã  CoinGecko
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=terra-luna,terra-classic,terrausd,bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true', {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) throw new Error('API Error');
    
    const data = await res.json();
    const [totalBurned, staked, totalSupply, blockHeight, validators] = await Promise.all([
      getTotalBurned(),
      getStakingPool(),
      getTotalSupply(),
      getBlockHeight(),
      getActiveValidatorsCount(),
    ]);

    const stakingRatio = totalSupply ? Number(((staked ?? 0) / totalSupply) * 100).toFixed(2) : '0';
    const marketCap = Number(data['terra-classic']?.usd_market_cap ?? 0);
    const volume24h = Number(data['terra-classic']?.usd_24h_vol ?? 0);

    const responseData: NetworkStatsData = {
      totalBurned: totalBurned ?? 0,
      staked: staked ?? 0,
      stakingRatio: Number(stakingRatio),
      blockHeight: blockHeight ?? 0,
      totalSupply: totalSupply ?? 0,
      validators: validators ?? 0,
      marketCap,
      volume24h,
      lastUpdated: new Date().toISOString(),
      source: 'live',
    };

    cachedNetworkStats = responseData;
    cachedAt = Date.now();

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Network stats fetch failed:', error);

    if (cachedNetworkStats && Date.now() - cachedAt < CACHE_TTL_MS) {
      return NextResponse.json({ success: true, data: { ...cachedNetworkStats, source: 'cache' } });
    }

    return NextResponse.json({ success: false, error: 'Failed to fetch network data' }, { status: 500 });
  }
}


