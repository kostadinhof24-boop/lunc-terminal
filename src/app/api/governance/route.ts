import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const LCD_URLS = [
    "https://phoenix-lcd.terra.dev",
    "https://terra-classic-lcd.publicnode.com"
  ];

  for (const url of LCD_URLS) {
    try {
      const res = await fetch(`${url}/cosmos/gov/v1beta1/proposals?pagination.limit=20&pagination.reverse=true`, {
        headers: { "Accept": "application/json" },
        cache: "no-store"
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      console.error(`Failed on ${url}`);
    }
  }

  return NextResponse.json({ error: "All LCD endpoints failed." }, { status: 500 });
}