import { NextResponse } from "next/server";
import type OpenAI from "openai";
import { groq, CONCIERGE_MODEL } from "@/lib/anthropic";
import { buildSystemPrompt, captureLeadTool, type CapturedLead } from "@/lib/conciergePrompt";
import { getPackages } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { chatSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { notifyOwner, leadEmailHtml } from "@/lib/email";
import { PACKAGES } from "@/lib/packages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }
  const { sessionId, messages } = parsed.data;

  const rl = rateLimit(`chat:${sessionId}:${clientIp(req)}`, 30, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many messages. Please slow down." }, { status: 429 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { reply: "Our chat helper is just waking up — please tap the green WhatsApp button or call us and the team will help right away!", captured: false },
      { status: 200 },
    );
  }

  const packages = await getPackages();
  const system = buildSystemPrompt(packages);
  const client = groq();

  const apiMessages: OpenAI.ChatCompletionMessageParam[] = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  try {
    let res = await client.chat.completions.create({
      model: CONCIERGE_MODEL,
      max_tokens: 600,
      messages: [{ role: "system", content: system }, ...apiMessages],
      tools: [captureLeadTool],
    });

    let captured = false;
    let reply = "";

    const rawToolCall = res.choices[0].message.tool_calls?.[0];
    const toolCall = rawToolCall as OpenAI.ChatCompletionMessageToolCall | undefined;

    if (toolCall && "function" in toolCall && toolCall.function.name === "capture_lead") {
      const lead = JSON.parse(toolCall.function.arguments) as CapturedLead;
      await persistLead(sessionId, lead, messages);
      captured = true;

      const followUpMessages: OpenAI.ChatCompletionMessageParam[] = [
        ...apiMessages,
        { role: "assistant", content: null, tool_calls: [toolCall] },
        { role: "tool", tool_call_id: toolCall.id, content: "Saved. The team has been notified." },
      ];

      res = await client.chat.completions.create({
        model: CONCIERGE_MODEL,
        max_tokens: 400,
        messages: [{ role: "system", content: system }, ...followUpMessages],
        tools: [captureLeadTool],
      });

      reply = res.choices[0].message.content?.trim() ?? "Got it!";
    } else {
      reply = res.choices[0].message.content?.trim() ?? "Got it!";
    }

    return NextResponse.json({ reply: reply || "Got it!", captured });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json(
      { reply: "Sorry, I had a tiny hiccup! 😅 Please tap the green WhatsApp button or call us and the team will help right away.", captured: false },
      { status: 200 },
    );
  }
}

async function persistLead(sessionId: string, lead: CapturedLead, transcript: { role: string; content: string }[]) {
  try {
    const pkgKey = lead.recommended_package ?? null;
    const created = await prisma.lead.create({
      data: {
        name: lead.name,
        phone: lead.phone,
        email: lead.email || null,
        packageKey: pkgKey,
        message: lead.summary || null,
        source: "concierge",
        preferredContact: "WhatsApp",
        temperature: lead.temperature,
        aiSummary: lead.summary || null,
        status: "New",
      },
    });

    await prisma.conversation.upsert({
      where: { sessionId },
      update: {
        leadId: created.id,
        messages: transcript,
        recommendedPackage: pkgKey,
        classification: lead.temperature,
      },
      create: {
        sessionId,
        leadId: created.id,
        messages: transcript,
        recommendedPackage: pkgKey,
        classification: lead.temperature,
      },
    });

    await prisma.notification.create({
      data: {
        type: lead.temperature === "hot" ? "hot_lead" : "enquiry",
        payload: { name: lead.name, pkg: pkgKey },
      },
    });

    await prisma.event.create({ data: { sessionId, type: "enquiry" } });

    const pkgName = PACKAGES.find((p) => p.key === pkgKey)?.name;
    await notifyOwner({
      subject: `${lead.temperature === "hot" ? "🔥 Hot lead" : "New lead"} — ${lead.name}`,
      html: leadEmailHtml({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        packageName: pkgName,
        message: lead.summary,
        source: "concierge",
        temperature: lead.temperature,
      }),
    });
  } catch (err) {
    console.error("[persistLead]", err);
  }
}
