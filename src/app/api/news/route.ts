import { NextResponse } from 'next/server';


import Parser from 'rss-parser';



const parser = new Parser({
  headers: { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml'
  }
});

// On utilise les versions franÃ§aises de CoinTelegraph et du Journal du Coin
const FEEDS = [
  { url: 'https://fr.cointelegraph.com/rss', source: 'CoinTelegraph FR' },
  { url: 'https://journalducoin.com/feed/', source: 'Journal du Coin' },
  { url: 'https://cryptoslate.com/feed/', source: 'CryptoSlate' }
];

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const allNews = [];
    // Mots-clÃ©s obligatoires pour garder l'article
    const KEYWORDS = ['terra', 'lunc', 'ustc', 'terra classic', 'terraform'];
    
    const feedPromises = FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        parsed.items.slice(0, 30).forEach((item) => {
          const title = (item.title || '').toLowerCase();
          const content = (item.contentSnippet || item.content || '').toLowerCase();
          
          // On vÃ©rifie si l'article parle de Terra Classic
          const isTerraNews = KEYWORDS.some(kw => title.includes(kw) || content.includes(kw));
          
          if (isTerraNews) {
            allNews.push({
              title: item.title,
              link: item.link,
              pubDate: item.pubDate || item.isoDate,
              source: feed.source,
              author: item.creator || item.author || 'Unknown',
              content: item.contentSnippet || item.content || ''
            });
          }
        });
      } catch (e) {
        console.error(`Erreur sur le flux ${feed.url}:`, e.message);
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


