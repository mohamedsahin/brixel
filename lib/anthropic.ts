import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function anthropic() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

// Confirm the current Sonnet tier on Anthropic's pricing page before launch.
export const CONCIERGE_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";
