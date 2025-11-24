
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, REGIONS } from "../constants";
import { NewsItem, RegionKey, ScriptRequest } from "../types";

// Safe API key access
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const fetchRegionalNews = async (regionKey: RegionKey): Promise<NewsItem[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
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
      },
    });

    const text = response.text || '';
    
    // Manual JSON extraction/cleaning
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn("No JSON array found in response", text);
      return [];
    }

    const jsonString = jsonMatch[0];
    let data;
    try {
        data = JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON", e);
        return [];
    }

    if (!Array.isArray(data)) {
        return [];
    }

    return data.map((item: any, index: number) => ({
      id: `${regionKey}-${Date.now()}-${index}`,
      title: item.title || 'Без заголовка',
      summary: item.summary || 'Нет описания',
      telegramPostDraft: item.telegramPostDraft || '',
      url: item.url,
      source: item.source || 'Источник',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

// Retained to prevent build errors in ScriptGenerator.tsx
export const generateScript = async (request: ScriptRequest): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing.");

  const prompt = `
    Create a voice-over script for a ${request.type}.
    Topic: ${request.topic}
    Tone: ${request.tone}
    Output only the raw script text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || '';
  } catch (error) {
    console.error("Error generating script:", error);
    throw error;
  }
};
