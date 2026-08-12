import Parser from "rss-parser";
import { prisma } from "@/lib/prisma";
import { NEWS_SOURCES } from "../config/sources.config";

export class FetcherError extends Error {
  constructor(message: string, public sourceName: string) {
    super(message);
    this.name = "FetcherError";
  }
}

type CustomRssItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  creator?: string;
  enclosure?: { url?: string };
};

class NewsFetcherService {
  private parser: Parser<{}, CustomRssItem>;

  constructor() {
    this.parser = new Parser({
      timeout: 10000,
      headers: { "User-Agent": "LUNC-Terminal-Bot/1.0" },
      customFields: {
        item: ["enclosure"]
      }
    });
  }

  public async runIngestionPipeline(): Promise<{ fetched: number; inserted: number }> {
    let insertedCount = 0;
    let fetchedCount = 0;

    for (const sourceConfig of NEWS_SOURCES) {
      try {
        if (!sourceConfig.rssUrl) continue;

        console.log(`[NewsFetcher] Fetching from ${sourceConfig.name}...`);
        const feed = await this.parser.parseURL(sourceConfig.rssUrl);
        fetchedCount += feed.items.length;

        for (const item of feed.items) {
          if (!item.link || !item.title) continue;

          const exists = await prisma.newsArticle.findUnique({ where: { url: item.link } });
          if (exists) continue;

          const cleanContent = this.sanitizeContent(item.contentSnippet || item.content || "");
          const imageUrl = this.extractImageUrl(item);

          const dbSource = await prisma.newsSource.upsert({
            where: { name: sourceConfig.name },
            update: {},
            create: {
              name: sourceConfig.name,
              url: sourceConfig.url,
              rssUrl: sourceConfig.rssUrl,
              type: sourceConfig.type,
              trustScore: sourceConfig.trustScore,
            },
          });

          await prisma.newsArticle.create({
            data: {
              sourceId: dbSource.id,
              url: item.link,
              title: item.title,
              author: item.creator || "Unknown",
              rawContent: item.content || "",
              cleanContent: cleanContent,
              imageUrl: imageUrl,
              publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
              status: "PENDING",
            },
          });

          insertedCount++;
        }
      } catch (error) {
        console.error(new FetcherError(`Failed to fetch source ${sourceConfig.name}: ${(error as Error).message}`, sourceConfig.name));
      }
    }

    console.log(`[NewsFetcher] Ingestion complete. Fetched: ${fetchedCount}, Inserted: ${insertedCount}`);
    return { fetched: fetchedCount, inserted: insertedCount };
  }

  private extractImageUrl(item: CustomRssItem): string | null {
    if (item.enclosure && item.enclosure.url) return item.enclosure.url;
    if (item.content) {
      const match = item.content.match(/<img[^>]+src="([^">]+)"/);
      if (match && match[1]) return match[1];
    }
    return null;
  }

  private sanitizeContent(rawHtml: string): string {
    return rawHtml
      .replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 5000);
  }
}

export const newsFetcherService = new NewsFetcherService();
