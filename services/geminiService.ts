
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, REGIONS } from "../constants";
import { NewsItem, RegionKey, ScriptRequest } from "../types";

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
      },
    });

    const text = response.text || '';
    
    // Manual JSON extraction/cleaning
    // Matches the first array found in the text, handling potential newlines/markdown formatting
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("No JSON found in response", text);
      return [];
    }

    const jsonString = jsonMatch[0];
    const data = JSON.parse(jsonString);

    if (!Array.isArray(data)) {
        console.error("Parsed data is not an array", data);
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

export const generateScript = async (request: ScriptRequest): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const prompt = `
    Create a voice-over script for a ${request.type}.
    Topic: ${request.topic}
    Tone: ${request.tone}
    
    Output only the raw script text suitable for reading aloud. Do not include markdown formatting or explanations unless they are stage directions in brackets.
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
