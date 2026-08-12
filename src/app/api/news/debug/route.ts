import { NextResponse } from "next/server";


import { prisma } from "@/lib/prisma";



export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const pending = await prisma.newsArticle.count({ where: { status: "PENDING" } });
    const normalized = await prisma.newsArticle.count({ where: { status: "NORMALIZED" } });
    const clustered = await prisma.newsArticle.count({ where: { status: "CLUSTERED" } });
    const rejected = await prisma.newsArticle.count({ where: { status: "REJECTED" } });
    const events = await prisma.newsEvent.count();

    return NextResponse.json({ stats: { pending, normalized, clustered, rejected, events } });
  } catch (error) {
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}


