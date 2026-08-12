import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "missing-key",
  baseURL: "https://api.groq.com/openai/v1",
});

interface AiAnalysisResult {
  summary: string;
  relevanceScore: number;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  isClickbait: boolean;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class NewsAiAnalyzerService {
  public async processPendingArticles(): Promise<void> {
    console.log("[AIAnalyzer] Recherche d articles a analyser...");

    const pendingArticles = await prisma.newsArticle.findMany({
      where: { 
        status: "PENDING",
        NOT: { cleanContent: null }
      },
      take: 30,
    });

    if (pendingArticles.length === 0) {
      console.log("[AIAnalyzer] Aucun article a analyser.");
      return;
    }

    for (const article of pendingArticles) {
      try {
        const analysis = await this.analyzeArticle(article.title, article.cleanContent!);
        
        await prisma.newsArticle.update({
          where: { id: article.id },
          data: {
            status: "NORMALIZED",
            summary: analysis.summary,
            relevanceScore: analysis.relevanceScore,
            sentiment: analysis.sentiment,
            isClickbait: analysis.isClickbait,
          },
        });

        console.log("[AIAnalyzer] Article analyse: " + article.title);
        await sleep(2000);
      } catch (error) {
        console.error("[AIAnalyzer] Erreur sur l article " + article.id, error);
        
        await prisma.newsArticle.update({
          where: { id: article.id },
          data: { 
            status: "NORMALIZED", 
            summary: "Analyse IA indisponible pour cet article.",
            relevanceScore: 50,
            sentiment: "NEUTRAL",
            isClickbait: false
          },
        });
      }
    }
  }

  private async analyzeArticle(title: string, content: string): Promise<AiAnalysisResult> {
    const prompt = "Tu es un analyste crypto expert. Analyse cet article Terra Luna Classic (LUNC). TITRE: " + title + " CONTENU: " + content.substring(0, 1000) + " Reponds UNIQUEMENT avec un JSON valide.";

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const rawContent = response.choices[0].message.content || "";
    const jsonStart = rawContent.indexOf("{");
    const jsonEnd = rawContent.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON found");

    const jsonString = rawContent.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString) as AiAnalysisResult;
  }
}

export const newsAiAnalyzerService = new NewsAiAnalyzerService();
