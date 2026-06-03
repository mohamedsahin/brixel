import OpenAI from "openai";
import { prisma } from "./prisma";

export interface ArticleSection {
  h2: string;
  paragraphs: string[];
  list?: string[];
  callout?: string;
}

export interface ArticleContent {
  intro: string;
  sections: ArticleSection[];
  conclusion: string;
  ctaHeading: string;
  ctaText: string;
}

export interface GeneratedArticle {
  title: string;
  slug: string;
  focusKeyword: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  tags: string[];
  coverImageQuery: string;
  readingMins: number;
  content: ArticleContent;
}

const SYSTEM_PROMPT = `You are an expert SEO content writer for Brixel, a web design company based in the UAE that builds websites for small businesses.

Your goal: write articles that help UAE small business owners find Brixel on Google, understand why they need a professional website, and naturally reach out for a quote.

BRIXEL CONTEXT:
- Packages: Starter Website (from AED 4,500), Online Store (from AED 9,000), Pro Website (from AED 14,000), Custom App (from AED 20,000), Care Plan (from AED 400/month)
- USP: Friendly team, plain English, Arabic + English, WhatsApp support, same-day replies, 50% upfront payment
- Based in UAE, serving all emirates

TONE: Friendly, conversational, like advice from a knowledgeable friend — never corporate or jargon-heavy. Plain language throughout.

OUTPUT: Always return valid JSON exactly matching the schema. Nothing else.`;

// Broad topic space ensures ~2 years of unique daily articles without repetition
const TOPIC_AREAS = [
  "how to get a [business type] found on Google in [city]",
  "5 signs your [business type] website needs an upgrade",
  "how to accept online payments as a [business type] in UAE",
  "WhatsApp integration guide for [business type] websites UAE",
  "Arabic and English website guide for [business type] in UAE",
  "mobile-first website design for [business type] in UAE",
  "Tabby and Tamara payment integration for UAE online shops",
  "Instagram vs website: what [business type] in UAE really needs",
  "how [business type] in [city] can get more walk-ins with a website",
  "online booking system guide for [business type] in UAE",
  "website cost guide for small businesses in UAE [year]",
  "Google Business Profile vs website: UAE small business guide",
  "how to sell products online in [city]: complete guide",
  "website features every [business type] in UAE needs",
  "how a website helped [business type] in UAE grow 10x",
];

const CITIES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "RAK", "Al Ain", "Fujairah", "UAE"];
const BUSINESSES = [
  "beauty salon", "dental clinic", "restaurant", "bakery", "pharmacy", "gym", "nursery",
  "real estate agency", "photography studio", "legal consultancy", "tailoring shop",
  "pet shop", "spa", "car service centre", "courier company", "event planner",
  "interior design studio", "cleaning company", "tutoring centre",
];

export async function generateArticle(): Promise<GeneratedArticle> {
  // Fetch recent titles to avoid duplicate topics
  let recentTitles: string[] = [];
  try {
    const recent = await prisma.article.findMany({
      select: { title: true },
      orderBy: { createdAt: "desc" },
      take: 40,
    });
    recentTitles = recent.map((a) => a.title);
  } catch {}

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY!,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const avoidSection = recentTitles.length > 0
    ? `\n\nAVOID these recently covered topics (do not write anything similar):\n${recentTitles.map((t) => `- ${t}`).join("\n")}`
    : "";

  const prompt = `Generate a complete, SEO-optimized blog article for Brixel's website.

TOPIC SELECTION: Choose a specific, high-search-volume topic. Be creative — pick a unique combination of:
- UAE city: ${CITIES.join(", ")}
- Business type: ${BUSINESSES.join(", ")}
- Angle: tips, guide, comparison, cost breakdown, success story format, common mistakes, checklist
${avoidSection}

GREAT TOPIC EXAMPLES:
- "How to Get Your Dubai Beauty Salon Found on Google (2025 Guide)"
- "5 Website Mistakes Abu Dhabi Dental Clinics Keep Making"
- "WhatsApp Click-to-Chat for UAE Restaurants: Step-by-Step Guide"
- "How Much Does a Website Cost in UAE? Honest Breakdown for 2025"
- "Online Booking Systems for Sharjah Spas: What You Need to Know"

RETURN this exact JSON structure (no extra fields, no markdown, pure JSON):
{
  "title": "Compelling H1 title with focus keyword — 50-70 chars ideal",
  "slug": "url-slug-max-65-chars-lowercase-hyphens-only",
  "focusKeyword": "main 3-5 word search phrase",
  "metaTitle": "SEO title max 58 chars — end with | Brixel",
  "metaDescription": "Exactly 150-158 chars. Include focus keyword + clear benefit + soft CTA",
  "excerpt": "1-2 sentences. Summarises the article value clearly.",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "coverImageQuery": "2-4 word pexels search — generic (e.g. 'beauty salon interior', 'restaurant owner laptop')",
  "readingMins": 5,
  "content": {
    "intro": "80-120 words. Hook + problem statement. Focus keyword in first 50 words. Relatable to the target business owner.",
    "sections": [
      {
        "h2": "Section heading (include keyword variation)",
        "paragraphs": ["60-90 word paragraph", "60-90 word paragraph"],
        "list": ["Optional bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"],
        "callout": "Optional 1-2 sentence highlight box — a surprising stat or key insight"
      }
    ],
    "conclusion": "60-80 words. Reinforce main message, set up the CTA naturally.",
    "ctaHeading": "Action-oriented H2 — e.g. 'Ready to Get Your Salon Online?'",
    "ctaText": "60-80 words. Warm, friendly. Mention free quote, UAE team, WhatsApp. Naturally reference the most relevant Brixel package and its from-price."
  }
}

REQUIREMENTS:
- Exactly 4-5 sections
- Total ~800-950 words across all fields
- Focus keyword in: title, intro paragraph, 2+ H2 headings, metaDescription
- At least one section specifically mentions Brixel package(s) by name and price
- UAE-specific details: WhatsApp, Tabby/Tamara, Arabic+English where relevant
- Plain language — if you'd explain it differently to a non-technical person, do that
- No hype words: "revolutionary", "game-changing", "leverage", "seamless"`;

  const response = await client.chat.completions.create({
    model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    max_tokens: 4096,
    temperature: 0.85,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  const raw = response.choices[0].message.content ?? "{}";
  const article = JSON.parse(raw) as GeneratedArticle;

  // Sanitise + validate slug
  article.slug = (article.slug ?? article.title ?? "article")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  // Guard required fields
  if (!article.title) throw new Error("AI returned article without title");
  if (!article.content?.sections?.length) throw new Error("AI returned article without sections");

  // Clamp reading time
  article.readingMins = Math.max(3, Math.min(12, article.readingMins ?? 5));

  return article;
}

// Compute Pexels cover URL from a freeform query string
export function coverImageUrl(query: string, w = 900, h = 560): string {
  const encoded = encodeURIComponent(query.trim().toLowerCase());
  // Use a deterministic Pexels search CDN approach
  const seeds: Record<string, string> = {
    "beauty salon": "3065171",
    "dental clinic": "305565",
    "restaurant": "262978",
    "bakery": "1775043",
    "pharmacy": "3683098",
    "gym": "1552252",
    "real estate": "1396122",
    "photography": "1366957",
    "laptop office": "3184291",
    "small business": "3184465",
    "website design": "196644",
    "team meeting": "1181406",
    "mobile phone": "607812",
    "online shop": "264636",
    "coffee shop": "683039",
  };

  // Find the best matching seed
  const lower = query.toLowerCase();
  for (const [key, id] of Object.entries(seeds)) {
    if (lower.includes(key.split(" ")[0])) {
      return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1`;
    }
  }

  // Fallback: generic business photo
  return `https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1`;
}
