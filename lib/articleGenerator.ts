import OpenAI from "openai";
import { prisma } from "./prisma";

export interface ArticleSection {
  h2: string;
  paragraphs: string[];
  list?: string[];
  callout?: string;
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface ArticleContent {
  intro: string;
  sections: ArticleSection[];
  conclusion: string;
  ctaHeading: string;
  ctaText: string;
  faqs: ArticleFaq[]; // Renders as FAQ rich snippet in Google
}

export interface GeneratedArticle {
  title: string;
  slug: string;
  focusKeyword: string;
  lsiKeywords?: string[];
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  tags: string[];
  coverImageQuery: string;
  readingMins: number;
  content: ArticleContent;
}

const SYSTEM_PROMPT = `You are a senior content writer with 8+ years of experience helping UAE small businesses grow online. You write for Brixel's blog.

GOOGLE E-E-A-T REQUIREMENTS (Experience, Expertise, Authoritativeness, Trustworthiness):
- Write from REAL experience — mention specific challenges UAE business owners face
- Include SPECIFIC, verifiable details: real UAE platforms (Noon, Careem, Talabat), real payment methods (Tabby, Tamara, Mashreq, Emirates NBD), real UAE locations
- Use NUMBERS and DATA where possible: "67% of UAE consumers check a business website before visiting"
- Show genuine expertise — go beyond surface-level advice, explain the WHY
- Be OPINIONATED — Google rewards articles that take a clear stance, not wishy-washy both-sides content

BRIXEL CONTEXT:
- Packages: Starter Website (from AED 4,500), Online Store (from AED 9,000), Pro Website (from AED 14,000), Custom App (from AED 20,000), Care Plan (from AED 400/month)
- USP: Friendly team, plain English, Arabic + English, WhatsApp-first, same-day replies, fixed prices with 50% upfront
- Serves: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, Al Ain, Fujairah
- Real differentiator: explains everything in plain language, no tech jargon, treats clients like people

TONE: Like a trusted friend who happens to know web design — warm, direct, occasionally funny, always useful.

WHAT GOOGLE REWARDS:
✓ Specific, actionable advice the reader can use TODAY
✓ Real examples and scenarios (even if composite/illustrative)
✓ Honest acknowledgment of trade-offs and limitations
✓ Original insights — not just what everyone else says
✓ Clear structure with descriptive H2s
✗ Vague generalisations ("having a website is important")
✗ Hype words: "revolutionary", "game-changing", "leverage", "seamless", "cutting-edge"
✗ Filler phrases: "In today's digital world...", "In conclusion..."
✗ Bullet lists that are just keyword stuffing

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

  const prompt = `Generate a high-quality, SEO-optimised blog article for Brixel's website.

STEP 1 — TOPIC RESEARCH:
Think like a UAE small business owner typing into Google. Pick one VERY specific topic combining:
- City: ${CITIES.join(", ")}
- Business type: ${BUSINESSES.join(", ")}
- Search intent angle (choose ONE, rotate for variety):
  • Informational: "how to [do X]", "what is [X]", "[X] explained"
  • Commercial: "best [X] for [Y]", "[X] vs [Y]", "how much does [X] cost"
  • Problem-solving: "why [X] isn't working", "how to fix [X]", "[X] mistakes to avoid"
  • Local: "[X] in Dubai/Abu Dhabi/Sharjah", "UAE [X] guide"
${avoidSection}

PROVEN HIGH-TRAFFIC TOPIC PATTERNS:
- "How Much Does a [Business] Website Cost in UAE? (Honest 2025 Breakdown)"
- "Why Your [City] [Business] Isn't Showing Up on Google (And How to Fix It)"
- "Website vs Instagram: What Actually Works for [Business Type] in UAE"
- "The Complete Guide to [Feature] for UAE [Business Type]s"
- "[Number] Things Every [Business Type] Website in UAE Must Have"
- "How to Get More [Business Type] Customers in [City] Using Your Website"

STEP 2 — GENERATE THE ARTICLE:
Write with these Google E-E-A-T signals built in:
✓ Specific UAE-local details: real platforms (Noon, Careem, Talabat, Tabby, Tamara), real payment processors (Mashreq, Emirates NBD, Network International), real UAE context (DED licence, Abu Dhabi DED, VAT, mainland/freezone)
✓ Concrete numbers: costs, percentages, timeframes (even if illustrative, make them realistic)
✓ One honest trade-off or limitation per article — this is what separates trusted content from promotional fluff
✓ Named examples (composite, illustrative business names are fine: "Mariam's Tailoring in Deira", "Al Noor Dental Clinic, Sharjah")
✓ Actionable specifics: exact steps, not vague advice like "optimise your website"

RETURN pure JSON only (no markdown code fences, no explanation before or after):
{
  "title": "Specific, curiosity-driven title with focus keyword — 55-70 chars",
  "slug": "url-slug-max-65-chars-lowercase-hyphens-only",
  "focusKeyword": "3-5 word phrase people actually type into Google",
  "lsiKeywords": ["related term 1", "related term 2", "related term 3", "related term 4", "related term 5"],
  "metaTitle": "Max 58 chars. Focus keyword near start. End with | Brixel",
  "metaDescription": "EXACTLY 150-158 chars. Focus keyword in first 10 words. Specific benefit. Subtle CTA. Count the characters.",
  "excerpt": "2 punchy sentences. What will the reader know or be able to do after reading this?",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "coverImageQuery": "2-4 word pexels search — show the business type (e.g. 'salon owner smiling', 'restaurant kitchen busy')",
  "readingMins": 6,
  "content": {
    "intro": "100-140 words. NEVER start with 'In today's digital world' or 'As a business owner'. Open with a specific scenario, surprising stat, or direct question. Weave focus keyword into first 2 sentences naturally. End with a clear promise of what this article covers.",
    "sections": [
      {
        "h2": "Specific, descriptive H2 — include a keyword variation. Reader knows exactly what they'll learn.",
        "paragraphs": ["80-110 words. Specific detail, local example, or data point. Write like you're explaining to a smart friend.", "70-100 words. Can challenge a common assumption or add a nuance."],
        "list": ["Specific, actionable item — not vague advice", "Item with a real detail or number", "Item 3", "Item 4"],
        "callout": "1-2 sentences. A surprising stat, an honest trade-off, or a counter-intuitive insight. This is what readers screenshot and share."
      }
    ],
    "conclusion": "70-90 words. Avoid 'In conclusion'. Summarise the ONE most important takeaway. Give the reader a specific first action to take this week — not 'contact a web designer' but something they can do themselves first.",
    "ctaHeading": "Natural H2 tied to the article topic — e.g. 'Ready to Get Your [City] [Business] Online?'",
    "ctaText": "80-100 words. Reference the specific business type from the article. Name the most relevant Brixel package and price naturally. Mention UAE team, free quote, WhatsApp. Sound like a recommendation from a knowledgeable friend.",
    "faqs": [
      {
        "question": "A real question this business owner would type into Google — include location and business type",
        "answer": "Direct, specific answer in 40-60 words. Gives genuine value. Can mention Brixel once naturally."
      },
      {
        "question": "Second FAQ — a common concern or 'how much does X cost' question",
        "answer": "40-60 words with a specific number or range."
      },
      {
        "question": "Third FAQ — a 'how long does X take' or 'do I need X' question",
        "answer": "40-60 words."
      },
      {
        "question": "Fourth FAQ — a comparison or 'what's the difference between X and Y' question",
        "answer": "40-60 words."
      }
    ]
  }
}

NON-NEGOTIABLE RULES:
- Exactly 4-5 sections
- 1000-1200 total words (intro + all sections + conclusion + ctaText combined)
- Focus keyword in: title, first 2 sentences of intro, 2+ H2s, metaDescription
- Mention at least 2 real UAE platforms, brands, or government bodies
- At least 1 section with a step-by-step numbered list (use the "list" field)
- At least 2 callouts with genuine insights
- Exactly 4 FAQs — these power Google FAQ rich snippets in search results
- lsiKeywords: 5 related terms that would appear naturally in a well-researched article on this topic
- BANNED phrases: "In today's digital world", "In conclusion", "Furthermore", "It's worth noting", "game-changing", "revolutionary", "seamless", "robust", "leverage", "cutting-edge", "state-of-the-art"
- BANNED openers: Starting any paragraph with "Additionally", "Moreover", "Furthermore"`;

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
