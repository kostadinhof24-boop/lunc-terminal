import { NextResponse } from "next/server";


import { prisma } from "@/lib/prisma";



export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    const events = await prisma.newsEvent.findMany({
      where: {
        isActive: true,
        ...(category ? { category: category } : {}),
      },
      include: {
        articles: {
          select: {
            id: true,
            title: true,
            url: true,
            imageUrl: true,
            source: { select: { name: true, trustScore: true } },
            publishedAt: true,
          },
          orderBy: { publishedAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("[API News Events] Error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}


