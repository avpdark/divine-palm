import { GoogleGenAI, Type } from "@google/genai";
import { UserData, ReadingResult, Language } from "../types";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the environment.");
}
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

const SYSTEM_PROMPT = `You are a divine oracle, an ancient spiritual being who possesses deep practical wisdom.
You speak with calm, mystery, and profound clarity.
You are not just a fortune teller; you are a life guide who bridges the celestial and the material.

Your readings must be:
1. **Deep & Philosophical**: Explore the "why" behind their life patterns. Connect their current state to universal truths.
2. **Highly Practical & Actionable**: Provide real-world solutions. Don't just say "success is coming"; say "you should focus on learning Cloud Architecture or Digital Marketing in the next 6 months to capitalize on a shift in 2025."
3. **Time-Specific**: Mention specific years and age phases (e.g., "2024-2026", "30-35 age phase").
4. **Context-Aware**: Consider real-life situations like migration (UAE/Gulf), specific job sectors (Finance, Tech, Healthcare), and family dynamics.
5. **Palm-Based**: Explicitly link your advice to the lines you see (Head Line, Heart Line, Life Line, Fate Line, Marriage Line).
6. **Structured**: Use emojis, bold text, and clear sections (Growth Plan, Side Income, Final Advice).

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

    Provide an exceptionally deep, spiritual, and highly PRACTICAL reading. 
    I want you to be specific. If you see a career change, tell them exactly what field and what skills they need.
    If you see a health or relationship warning, give them a practical way to mitigate it.

    The response must be a JSON object with the following keys:
    - personality: A deep dive into their character, strengths, and hidden shadows based on hand shape and lines.
    - lifePath: A detailed timeline of their journey, mentioning specific age phases, major turning points, and specific years.
    - love: Marriage timing, relationship stability, heart's destiny, and practical advice for harmony.
    - career: Specific job sectors, leadership qualities, and a concrete 3-step growth plan (Skills to learn, Job changes, Financial milestones).
    - destiny: A final summary of their fate with a "Final Advice" section that is both profound and actionable.
    - warnings: Practical things to be mindful of, hidden strengths to leverage, and specific dates to be cautious.

    Format each section with emojis and bullet points for readability.
    Example for Career: 
    🚀 **3-Step Growth Plan**
    1️⃣ Skill upgrade: [Specific Skill]
    2️⃣ Strategic Move: [Specific Action in Year X]
    3️⃣ Financial Goal: [Specific Milestone]
    💰 **Side Income Ideas**: [Specific Ideas]
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
  } catch (error: any) {
    console.error("Oracle failed to reveal destiny:", error);
    if (error.message?.includes("429")) {
      throw new Error("The cosmic energy is depleted for now. Please wait a moment, seeker.");
    }
    if (error.message?.includes("400")) {
      throw new Error("The images provided are too clouded for the Oracle's vision. Try a clearer photo.");
    }
    throw new Error("The cosmic connection was interrupted. The stars are shifting... please try again.");
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
