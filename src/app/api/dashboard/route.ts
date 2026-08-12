import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const LCD_URL = "https://terra-classic-lcd.publicnode.com";
  try {
    const [supplyRes, stakingRes, valRes, poolRes] = await Promise.all([
      fetch(`${LCD_URL}/cosmos/bank/v1beta1/supply/uluna`),
      fetch(`${LCD_URL}/cosmos/staking/v1beta1/pool`),
      fetch(`${LCD_URL}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=1`),
      fetch(`${LCD_URL}/cosmos/distribution/v1beta1/community_pool`)
    ]);

    const supplyData = await supplyRes.json();
    const stakingData = await stakingRes.json();
    const valData = await valRes.json();
    const poolData = await poolRes.json();

    const totalSupply = Number(supplyData.amount?.amount || 0) / 1_000_000;
    const staked = Number(stakingData.pool?.bonded_tokens || 0) / 1_000_000;
    const validators = Number(valData.pagination?.total || 0);
    const communityPool = Number(poolData.pool?.find((p: any) => p.denom === 'uluna')?.amount || 0) / 1_000_000;

    return NextResponse.json({
      totalSupply,
      staked,
      validators,
      communityPool,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}