import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enquirySchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { notifyOwner, leadEmailHtml } from "@/lib/email";
import { PACKAGES } from "@/lib/packages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const rl = rateLimit(`enquiry:${clientIp(req)}`, 8, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  try {
    const lead = await prisma.lead.create({
      data: {
        name: d.name,
        business: d.business || null,
        phone: d.phone,
        email: d.email || null,
        packageKey: d.packageKey || null,
        message: d.message || null,
        source: "form",
        preferredContact: d.preferredContact,
        status: "New",
      },
    });

    await prisma.notification.create({
      data: { type: "enquiry", payload: { name: d.name, pkg: d.packageKey || null } },
    });
    await prisma.event.create({ data: { type: "enquiry" } });

    const pkgName = PACKAGES.find((p) => p.key === d.packageKey)?.name;
    await notifyOwner({
      subject: `New enquiry — ${d.name}`,
      html: leadEmailHtml({
        name: d.name,
        phone: d.phone,
        email: d.email,
        business: d.business,
        packageName: pkgName,
        message: d.message,
        source: "form",
      }),
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error("[/api/enquiries]", err);
    return NextResponse.json({ error: "Something went wrong saving your enquiry." }, { status: 500 });
  }
}
