import { GoogleGenAI } from '@google/genai';

export const DEFAULT_GEMINI_CONFIG = {
  temperature: 0.0,
  topP: 0.2,
  topK: 20,
  responseMimeType: "application/json" as const,
};

let geminiClientInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!geminiClientInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Environment variable GEMINI_API_KEY is required to instantiate Gemini service.');
    }
    geminiClientInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClientInstance;
}

export interface GeminiRequestOptions {
  model?: string;
  systemInstruction?: string;
  responseSchema?: any;
}

const resolveModelName = (model?: string): string => {
  if (model) return model;
  return 'gemini-3.1-pro-preview';
};

const buildGeminiConfig = (options: GeminiRequestOptions): Record<string, any> => {
  const config: Record<string, any> = { ...DEFAULT_GEMINI_CONFIG };
  if (options.systemInstruction) config.systemInstruction = options.systemInstruction;
  if (options.responseSchema) config.responseSchema = options.responseSchema;
  return config;
};

const parseGeminiJson = <T>(rawText: string): T => {
  try {
    return JSON.parse(rawText) as T;
  } catch {
    throw new Error(`Failed to decode deterministic JSON response from Gemini: ${rawText}`);
  }
};

const getResponseText = (response: any): string => {
  if (!response) return '{}';
  if (typeof response.text !== 'string') return '{}';
  return response.text;
};

export async function generateDeterministicJson<T = any>(
  prompt: string | any[],
  options: GeminiRequestOptions = {}
): Promise<{ data: T; rawText: string }> {
  const client = getGeminiClient();
  const modelName = resolveModelName(options.model);
  const config = buildGeminiConfig(options);

  const response = await client.models.generateContent({
    model: modelName,
    contents: prompt,
    config,
  });

  const rawText = getResponseText(response);
  const data = parseGeminiJson<T>(rawText);
  return { data, rawText };
}
