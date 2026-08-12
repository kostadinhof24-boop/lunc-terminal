const fs = require('fs');
const path = require('path');

const w = (p, c) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Mise à jour finale des flux RSS...");

w('src/app/api/news/route.ts', `
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser({
  headers: { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml'
  }
});

const FEEDS = [
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph' }
];

export async function GET() {
  try {
    const allNews = [];
    
    const feedPromises = FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        parsed.items.slice(0, 20).forEach((item) => {
          allNews.push({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate || item.isoDate,
            source: feed.source,
            author: item.creator || item.author || 'Unknown',
            content: item.contentSnippet || item.content || ''
          });
        });
      } catch (e) {
        console.error(\`Erreur sur le flux \${feed.url}:\`, e.message);
      }
    });

    await Promise.all(feedPromises);

    allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return NextResponse.json({ success: true, data: allNews });
  } catch (error) {
    console.error("Erreur API News:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`);

console.log('\n🎉 Flux RSS mis à jour ! Va sur /actualites');