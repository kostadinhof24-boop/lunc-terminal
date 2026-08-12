export const NEWS_SOURCES = [
  {
    name: "Google News - Terra Luna Classic",
    url: "https://news.google.com/",
    rssUrl: "https://news.google.com/rss/search?q=Terra+Luna+Classic&hl=en-US&gl=US&ceid=US:en",
    type: "RSS",
    trustScore: 80, 
  },
  {
    name: "Google News - LUNC",
    url: "https://news.google.com/",
    rssUrl: "https://news.google.com/rss/search?q=LUNC+crypto&hl=en-US&gl=US&ceid=US:en",
    type: "RSS",
    trustScore: 75,
  },
  {
    name: "Cointelegraph - Luna",
    url: "https://cointelegraph.com/",
    rssUrl: "https://cointelegraph.com/rss/tag/luna",
    type: "RSS",
    trustScore: 90,
  }
] as const;
