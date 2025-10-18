import { GoogleGenAI } from "@google/genai";

const API_KEY = window.APP_CONFIG?.API_KEY;
const isConfigured = API_KEY && !API_KEY.startsWith('PASTE_YOUR_');

// This function pattern ensures we don't crash on module load if API_KEY is missing.
const getAiClient = () => {
    if (!isConfigured) {
        return null;
    }
    // This will only be called if the API_KEY is present.
    return new GoogleGenAI({ apiKey: API_KEY });
};

export const fetchMotivationalQuote = async (): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    console.error("Gemini API Key not configured in index.html. Using fallback for quotes.");
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