import { NextResponse } from 'next/server';


import axios from 'axios';



export const dynamic = 'force-dynamic';
export async function GET() {
  const BURN_ADDRESS = 'terra1sk06e3dyexuq4shw77y4dtt0xpqkcjm974wu5w';
  const PUBLIC_NODE_LCD = 'https://terra-classic-lcd.publicnode.com';
  
  // Valeur de secours si l'API est en panne (environ 130 Milliards)
  const FALLBACK_BURN = 130_000_000_000;

  try {
    // On tente de rÃ©cupÃ©rer le solde via PublicNode
    const res = await axios.get(`${PUBLIC_NODE_LCD}/cosmos/bank/v1beta1/balances/${BURN_ADDRESS}`);
    const bal = res.data.balances.find((b) => b.denom === 'uluna');
    
    if (bal) {
      const burned = parseFloat(bal.amount) / 1_000_000;
      // Si l'API renvoie 0 (bug connu), on utilise le fallback
      if (burned > 0) {
        return NextResponse.json({ success: true, totalBurned: burned });
      }
    }
    // Sinon, on renvoie le fallback pour ne pas casser l'UI
    return NextResponse.json({ success: true, totalBurned: FALLBACK_BURN, fallback: true });
  } catch (err) {
    // En cas d'erreur rÃ©seau, on renvoie aussi le fallback
    return NextResponse.json({ success: true, totalBurned: FALLBACK_BURN, fallback: true });
  }
}


