import { RegionConfig } from './types';

export const REGIONS: RegionConfig[] = [
  { key: 'DNR', name: 'ДНР', fullName: 'Донецкая Народная Республика', color: 'bg-blue-600' },
  { key: 'LNR', name: 'ЛНР', fullName: 'Луганская Народная Республика', color: 'bg-red-600' },
  { key: 'ZO', name: 'Запорожье', fullName: 'Запорожская область', color: 'bg-green-600' },
  { key: 'HO', name: 'Херсон', fullName: 'Херсонская область', color: 'bg-yellow-600' },
];

export const SYSTEM_INSTRUCTION = `
You are an expert news aggregator and Telegram channel administrator for new regions.
Your goal is to find the latest, most relevant news for the requested region using Google Search.
Analyze the search results and generate a structured JSON response.

Output Format:
Return a JSON array of objects. Each object must have the following fields:
- "title": A concise title of the news.
- "summary": A neutral summary (2-3 sentences).
- "source": The name of the source or URL.
- "telegramPostDraft": A "news flash" style Telegram post in Russian. Use emojis and hashtags (e.g. #ДНР #Новости).
- "timestamp": Approximate time of the event (e.g. "Сегодня, 14:00").

Ensure you gather a comprehensive list of news (aiming for the requested quantity) without duplicating content.
Return ONLY the valid JSON array string. Do not include markdown code blocks.
`;