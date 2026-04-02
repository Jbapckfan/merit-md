// ── ChartReview Pro Feedback API ──
// POST /api/chartreview/feedback — track thumbs up/down on reviews
// Best-effort logging — never fails the client.

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedback, timestamp } = body;

    if (feedback !== "up" && feedback !== "down") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Log feedback — expand to DB storage later
    console.log(`[chartreview/feedback] ${feedback} at ${new Date(timestamp).toISOString()}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // never fail the client
  }
}
