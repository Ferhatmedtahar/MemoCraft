import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GOOGLE_CLIENT_AI;
    if (!apiKey) {
      throw new Error("GOOGLE_CLIENT_AI environment variable is not set");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export function resetGeminiClient(): void {
  client = null;
}

interface GeminiInteractionConfig {
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

export async function callGemini(
  prompt: string,
  config: GeminiInteractionConfig = {}
): Promise<string> {
  const ai = getGeminiClient();

  const interaction = await ai.interactions.create({
    model: config.model || "gemini-3.5-flash",
    input: prompt,
    generation_config: {
      max_output_tokens: config.maxOutputTokens ?? 2048,
      temperature: config.temperature ?? 0.4,
      top_p: config.topP ?? 0.8,
    },
  });

  if (!interaction.output_text) {
    throw new Error("Empty AI response");
  }

  return interaction.output_text;
}
