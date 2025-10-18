
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will be caught by the calling component, preventing a hard crash.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const fetchMotivationalQuote = async (): Promise<string> => {
  if (!API_KEY) {
    return "The journey of a thousand miles begins with a single step. - Lao Tzu (API key not configured)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Generate a short, powerful, and inspirational quote for a student on a digital learning platform. Keep it under 20 words.',
      config: {
        temperature: 0.9,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching motivational quote:", error);
    return "Believe you can and you're halfway there. - Theodore Roosevelt";
  }
};
