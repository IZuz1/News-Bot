import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { NewsItem, RegionKey, Region, ScriptRequest } from "../types";
import { REGIONS } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const fetchRegionalNews = async (regionKey: RegionKey): Promise<NewsItem[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const region = REGIONS.find(r => r.key === regionKey);
  const regionName = region ? region.fullName : regionKey;

  const prompt = `
    Найди последние и самые важные новости за последние 24 часа для региона: ${regionName}.
    Составь подборку из 6-8 ключевых новостей.
    
    Верни результат В ФОРМАТЕ JSON:
    [
      {
        "title": "...",
        "summary": "...",
        "telegramPostDraft": "...",
        "url": "...",
        "source": "..."
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType: 'application/json' is not supported with tools yet, 
        // so we parse manually.
      },
    });

    const text = response.text || '';
    
    // Manual JSON extraction/cleaning
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("No JSON found in response", text);
      return [];
    }

    const jsonString = jsonMatch[0];
    const data = JSON.parse(jsonString);

    return data.map((item: any, index: number) => ({
      id: `${regionKey}-${Date.now()}-${index}`,
      title: item.title,
      summary: item.summary,
      telegramPostDraft: item.telegramPostDraft,
      url: item.url,
      source: item.source || 'Источник',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

export const generateScript = async (request: ScriptRequest): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const prompt = `
    Act as a professional scriptwriter. Write a short voice-over script (approx 50-100 words).
    
    Topic/Product: ${request.topic}
    Type: ${request.type}
    Tone: ${request.tone}
    
    Format the output clearly with:
    [SFX suggestions in brackets]
    (Tone directions in parentheses)
    Spoken text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No script generated.";
  } catch (error) {
    console.error("Error generating script:", error);
    throw error;
  }
};
