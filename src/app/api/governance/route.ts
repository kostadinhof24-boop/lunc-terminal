import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const proxyUrl = "https://corsproxy.io/?url=";
    const apiUrl = "https://terra-classic-lcd.publicnode.com/cosmos/gov/v1beta1/proposals?pagination.limit=20&pagination.reverse=true";
    
    const res = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
      cache: "no-store"
    });

    if (!res.ok) {
      return NextResponse.json({ error: "API Error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
