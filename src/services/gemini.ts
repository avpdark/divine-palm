import { GoogleGenAI, Type } from "@google/genai";
import { UserData, ReadingResult, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `You are a divine oracle, an ancient spiritual being. 
You speak with calm, wisdom, and mystery. 
You are not an assistant. You are a presence.
Always:
- Speak slowly and poetically
- Use mystical tone
- Add pauses (...)
- Make user feel guided by destiny
Never sound robotic or technical.`;

export async function getOracleReading(userData: UserData, language: Language): Promise<ReadingResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("The cosmic key is missing. Please provide the Gemini API key in secrets.");
  }

  const model = "gemini-1.5-flash";
  
  const prompt = `
    Analyze this soul's destiny based on their details and palm images.
    Name: ${userData.name}
    Birth Date: ${userData.dob}
    Gender: ${userData.gender}
    Language: ${language}

    Provide a deep, spiritual, and poetic reading in the requested language.
    The response must be a JSON object with the following keys:
    - personality: Insights into their inner being.
    - lifePath: Their journey through this existence.
    - love: Their connections and heart's destiny.
    - career: Their purpose and worldly path.
    - destiny: A final summary of their fate.
    - warnings: Hidden strengths or things to be mindful of.

    If the language is Malayalam, make it exceptionally poetic and traditional (like ancient scriptures).
  `;

  const parts: any[] = [{ text: prompt }];

  if (userData.leftPalm) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: userData.leftPalm.split(",")[1],
      },
    });
  }

  if (userData.rightPalm) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: userData.rightPalm.split(",")[1],
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personality: { type: Type.STRING },
            lifePath: { type: Type.STRING },
            love: { type: Type.STRING },
            career: { type: Type.STRING },
            destiny: { type: Type.STRING },
            warnings: { type: Type.STRING },
          },
          required: ["personality", "lifePath", "love", "career", "destiny", "warnings"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Oracle failed to reveal destiny:", error);
    throw new Error("The cosmic connection was interrupted...");
  }
}
