// ── ChartReview Pro API ──
// POST /api/chartreview — submit a chart for pre-sign review
// Returns structured JSON with documentation review, risk flags, and suggestions.

import { NextRequest, NextResponse } from "next/server";
import { reviewChart } from "@/lib/chart-review";
import { getDb } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chartText, chiefComplaint, facilityType } = body;

    if (!chartText || typeof chartText !== "string" || chartText.trim().length < 20) {
      return NextResponse.json(
        { error: "Chart text is required and must be at least 20 characters." },
        { status: 400 }
      );
    }

    const result = await reviewChart(
      chartText.trim(),
      chiefComplaint?.trim() || undefined,
      facilityType?.trim() || undefined
    );

    // Save to database
    try {
      const db = getDb();
      const id = uuid();
      db.prepare(
        `INSERT INTO chart_reviews (id, chief_complaint, facility_type, chart_text, review_result, overall_grade, risk_flags_count)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(
        id,
        chiefComplaint || null,
        facilityType || null,
        chartText.trim(),
        JSON.stringify(result),
        result.overallGrade,
        result.riskFlags.length
      );
    } catch (dbError) {
      // Best-effort — don't fail the review if DB write fails
      console.error("[chartreview] DB write failed:", dbError);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[chartreview] API error:", error);
    return NextResponse.json(
      { error: "Failed to process chart review. Please try again." },
      { status: 500 }
    );
  }
}
