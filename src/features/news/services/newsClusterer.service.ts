import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "missing-key",
  baseURL: "https://api.groq.com/openai/v1",
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class NewsClustererService {
  public async processNormalizedArticles(): Promise<void> {
    console.log("[Clusterer] Recherche d articles a regrouper...");

    const normalizedArticles = await prisma.newsArticle.findMany({
      where: { 
        status: "NORMALIZED",
        eventId: null,
      },
      take: 20,
      include: { source: true }
    });

    if (normalizedArticles.length === 0) {
      console.log("[Clusterer] Aucun article a regrouper.");
      return;
    }

    const activeEvents = await prisma.newsEvent.findMany({
      where: { isActive: true, updatedAt: { gte: new Date(Date.now() - 48 * 60 * 60 * 1000) } },
      take: 10,
    });

    for (const article of normalizedArticles) {
      try {
        let eventId: string;
        let merged = false;

        if (activeEvents.length > 0) {
          try {
            const decision = await this.determineClustering(article, activeEvents);
            if (decision.action === "MERGE_WITH_EXISTING" && decision.existingEventId) {
              eventId = decision.existingEventId;
              await prisma.newsEvent.update({ where: { id: eventId }, data: { updatedAt: new Date() } });
              merged = true;
            }
          } catch (e) {
            console.log("[Clusterer] IA de fusion a echoue, creation d un nouvel evenement.");
          }
        }

        if (!merged) {
          let eventTitle = article.title;
          let eventSummary = article.summary || "Pas de resume disponible.";
          let eventCategory = "MARKET";

          try {
            const cat = await this.categorizeEvent(article.title);
            eventCategory = cat;
          } catch (e) {}

          const newEvent = await prisma.newsEvent.create({
            data: {
              title: eventTitle.length > 100 ? eventTitle.substring(0, 100) + "..." : eventTitle,
              summary: eventSummary,
              category: eventCategory,
              avgRelevance: article.relevanceScore || 50,
              avgTrustScore: article.source.trustScore,
            }
          });
          eventId = newEvent.id;
        }

        await prisma.newsArticle.update({
          where: { id: article.id },
          data: { eventId: eventId, status: "CLUSTERED" }
        });

        await sleep(2000);
      } catch (error) {
        console.error(`[Clusterer] Erreur fatale sur l article ${article.id}:`, error);
      }
    }
  }

  private async determineClustering(article: any, activeEvents: any[]): Promise<any> {
    const eventsContext = activeEvents.map(e => `ID: ${e.id} | Titre: ${e.title}`).join("\n");
    const prompt = `Evenements actifs:\n${eventsContext}\n\nNouvel article: ${article.title}\n\nSi l'article parle du meme evenement, reponds avec un JSON.`;
    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    return JSON.parse(response.choices[0].message.content!);
  }

  private async categorizeEvent(title: string): Promise<string> {
    const prompt = `Categorise ce titre LUNC en un seul mot parmi: MARKET, BURN, GOVERNANCE, DEVELOPMENT, COMMUNITY, EXCHANGE. Titre: ${title}`;
    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });
    const cat = response.choices[0].message.content!.trim().toUpperCase();
    return ["MARKET", "BURN", "GOVERNANCE", "DEVELOPMENT", "COMMUNITY", "EXCHANGE"].includes(cat) ? cat : "MARKET";
  }
}

export const newsClustererService = new NewsClustererService();