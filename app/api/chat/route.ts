import { NextResponse } from "next/server";
import { anthropic, CONCIERGE_MODEL } from "@/lib/anthropic";
import { buildSystemPrompt, captureLeadTool, type CapturedLead } from "@/lib/conciergePrompt";
import { getPackages } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { chatSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { notifyOwner, leadEmailHtml } from "@/lib/email";
import { PACKAGES } from "@/lib/packages";
import type Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Rate limit per session + IP (the concierge is the most abuse-prone route).
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

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { reply: "Our chat helper is just waking up — please tap the green WhatsApp button or call us and the team will help right away!", captured: false },
      { status: 200 },
    );
  }

  const packages = await getPackages();
  const system = buildSystemPrompt(packages);

  const apiMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const client = anthropic();

    // First turn — system block is marked cacheable (it repeats every call).
    let res = await client.messages.create({
      model: CONCIERGE_MODEL,
      max_tokens: 600,
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      tools: [captureLeadTool as Anthropic.Tool],
      messages: apiMessages,
    });

    let captured = false;

    // If Bricky called capture_lead, persist it and feed back a tool_result
    // so the model can write its closing reply.
    const toolUse = res.content.find((c) => c.type === "tool_use") as Anthropic.ToolUseBlock | undefined;
    if (toolUse && toolUse.name === "capture_lead") {
      const lead = toolUse.input as CapturedLead;
      await persistLead(sessionId, lead, messages);
      captured = true;

      apiMessages.push({ role: "assistant", content: res.content });
      apiMessages.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: "Saved. The team has been notified.",
          },
        ],
      });

      res = await client.messages.create({
        model: CONCIERGE_MODEL,
        max_tokens: 400,
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        tools: [captureLeadTool as Anthropic.Tool],
        messages: apiMessages,
      });
    }

    const reply = res.content
      .filter((c): c is Anthropic.TextBlock => c.type === "text")
      .map((c) => c.text)
      .join("\n")
      .trim();

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
    // Don't let persistence failure break the chat reply.
    console.error("[persistLead]", err);
  }
}
