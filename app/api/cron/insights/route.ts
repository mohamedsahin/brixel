import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Phase 3 — batch AI insights.
 * Protect with CRON_SECRET. Wire to a Vercel Cron schedule.
 * This stub shows the contract: pull anonymized journey + conversion data,
 * send to a frontier model via the Batch API, and store ranked, REVIEWABLE
 * suggestions for the owner to approve — never auto-applied.
 */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO (Phase 3):
  // 1. Aggregate anonymized Events + Lead outcomes (no PII).
  // 2. Submit a Batch API job to a frontier model.
  // 3. Persist returned suggestions as `Notification`/insight rows with status "proposed".
  // The owner reviews + approves in the admin panel before anything goes live.

  return NextResponse.json({ ok: true, note: "Insights stub — implement Phase 3 here." });
}
