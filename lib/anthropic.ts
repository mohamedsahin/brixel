import OpenAI from "openai";

let _client: OpenAI | null = null;

export function groq() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return _client;
}

export const CONCIERGE_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
