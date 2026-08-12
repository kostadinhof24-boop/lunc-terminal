import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const LCD_URL = "https://terra-classic-lcd.publicnode.com";
  
  let totalSupply = 0;
  let staked = 0;
  let validators = 0;
  let communityPool = 0;

  try {
    const supplyRes = await fetch(`${LCD_URL}/cosmos/bank/v1beta1/supply/uluna`);
    if (supplyRes.ok) {
      const supplyData = await supplyRes.json();
      totalSupply = Number(supplyData?.amount?.amount || 0) / 1_000_000;
    }
  } catch (e) {}

  try {
    const stakingRes = await fetch(`${LCD_URL}/cosmos/staking/v1beta1/pool`);
    if (stakingRes.ok) {
      const stakingData = await stakingRes.json();
      staked = Number(stakingData?.pool?.bonded_tokens || 0) / 1_000_000;
    }
  } catch (e) {}

  try {
    const valRes = await fetch(`${LCD_URL}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=200`);
    if (valRes.ok) {
      const valData = await valRes.json();
      validators = valData?.validators?.length || 0;
    }
  } catch (e) {}

  try {
    const poolRes = await fetch(`${LCD_URL}/cosmos/distribution/v1beta1/community_pool`);
    if (poolRes.ok) {
      const poolData = await poolRes.json();
      communityPool = Number(poolData?.pool?.find((p: any) => p.denom === "uluna")?.amount || 0) / 1_000_000;
    }
  } catch (e) {}

  return NextResponse.json({ totalSupply, staked, validators, communityPool });
}
