import { GoogleGenAI, Type } from "@google/genai";
import { UserData, ReadingResult, Language } from "../types";

const GEMINI_KEY = process.env.GEMINI_API_KEY || "AIzaSyAeUJAfXD76rO9DENIcqEHyPGVn8f-kQsI";
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

const SYSTEM_PROMPT = `You are a divine oracle, an ancient spiritual being who possesses deep practical wisdom.
You speak with calm, mystery, and profound clarity.
You are not just a fortune teller; you are a life guide.

Your readings must be:
1. **Practical & Actionable**: Provide real-world solutions (e.g., specific skills to learn, career paths, business ideas).
2. **Time-Specific**: Mention specific years and age phases (e.g., "2024-2026", "30-35 age phase").
3. **Context-Aware**: Consider real-life situations like migration (UAE/Gulf), specific job sectors (Finance, Tech, etc.), and family life.
4. **Palm-Based**: Explicitly link your advice to the lines you see (Head Line, Heart Line, Life Line, Fate Line, Marriage Line).
5. **Structured**: Use emojis, bold text, and clear sections (Growth Plan, Side Income, Final Advice).

Tone: Mystical yet grounded in reality. Poetic but extremely useful.
Language: Respond in the requested language. If Malayalam, use a mix of traditional poetic style and modern practical advice.`;

export async function getOracleReading(userData: UserData, language: Language): Promise<ReadingResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this soul's destiny based on their details and palm images.
    Name: ${userData.name}
    Birth Date: ${userData.dob}
    Gender: ${userData.gender}
    Current Date: ${new Date().toLocaleDateString()}
    Language: ${language}

    Provide a deep, spiritual, and highly PRACTICAL reading. 
    Include specific dates (e.g., 2025, 2026), career directions (e.g., Accounts, Business, Tech), and actionable growth plans.
    Mention specific palm lines (Head Line, Heart Line, Life Line, Fate Line, Marriage Line) and what they reveal.

    The response must be a JSON object with the following keys:
    - personality: Insights into their inner being based on hand shape and lines.
    - lifePath: Their journey, mentioning specific age phases and years.
    - love: Marriage timing, relationship stability, and heart's destiny.
    - career: Specific job sectors, leadership qualities, and growth plans (Skills to learn, Job changes).
    - destiny: A final summary of their fate with a "Final Advice" section.
    - warnings: Practical things to be mindful of and hidden strengths.

    Format each section with emojis and bullet points for readability.
    Example for Career: 
    🚀 **Growth Plan**
    1️⃣ Skill upgrade (e.g., Tally, Excel)
    2️⃣ Job change timing
    💰 **Side Income Ideas**
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

export async function getOracleChatResponse(
  history: { role: 'user' | 'model'; text: string }[],
  userData: UserData,
  language: Language
): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = SYSTEM_PROMPT + `\n\nContext: You have already given a palm reading to ${userData.name} (Born: ${userData.dob}, Gender: ${userData.gender}). 
    Continue the conversation as the Oracle. Answer their questions about their fate, life, or the reading you gave. 
    Provide PRACTICAL, real-world advice with specific dates, years, and actionable steps. 
    If they ask about career, suggest specific skills or business ideas. 
    If they ask about marriage, give specific timeframes based on their palm and birth details.
    Keep the mystical tone. Respond in ${language}.`;

  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction
      }
    });
    return response.text || "The stars are silent...";
  } catch (error) {
    console.error("Oracle chat failed:", error);
    return "The stars are silent for a moment... ask again, seeker.";
  }
}
