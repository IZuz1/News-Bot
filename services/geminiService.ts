import { GoogleGenAI } from "@google/genai";
import { NewsItem } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Ensure API key is present (handled by environment in this context)
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const fetchRegionalNews = async (regionFullName: string): Promise<NewsItem[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // We cannot use strict JSON schema mode (responseMimeType: application/json) with googleSearch tool.
    // We rely on the system instruction to format the output as JSON and parse it manually.

    const prompt = `Find the latest news and important events specifically for ${regionFullName} happened in the last 24 hours. 
    Conduct a comprehensive search covering:
    - Official government statements and decrees
    - Infrastructure updates (water, electricity, roads)
    - Emergency incidents and shelling reports
    - Social sphere (pensions, schools, hospitals)
    - Cultural events and daily life
    
    Target Quantity: Return 8 to 12 distinct news items. 
    Ensure a wide coverage of events. Do not duplicate stories.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable Grounding
      },
    });

    let jsonText = response.text;
    
    if (!jsonText) {
      throw new Error("No data returned from Gemini.");
    }

    // Clean up potential markdown formatting (```json ... ```) wrapping the JSON
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    let rawData;
    try {
        rawData = JSON.parse(jsonText);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        console.log("Raw Text:", jsonText);
        throw new Error("Failed to parse news data. The AI response was not valid JSON.");
    }

    if (!Array.isArray(rawData)) {
        throw new Error("AI response was not a JSON array.");
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    let fallbackSource = "Google Search";
    if (groundingChunks.length > 0 && groundingChunks[0].web?.uri) {
        fallbackSource = groundingChunks[0].web.uri;
    }

    return rawData.map((item: any, index: number) => ({
      id: `news-${Date.now()}-${index}`,
      title: item.title,
      summary: item.summary,
      source: item.source || fallbackSource,
      telegramPostDraft: item.telegramPostDraft,
      url: item.source && item.source.startsWith('http') ? item.source : undefined,
      timestamp: item.timestamp || new Date().toLocaleTimeString(),
    }));

  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};