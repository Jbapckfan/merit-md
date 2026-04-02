import { NextRequest, NextResponse } from "next/server";
import { getCaseById, getCaseByShareToken, getUploadsByCase } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/analyze?id=<caseId> — get report for a case
// GET /api/analyze?share=<shareToken> — get report via share link
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("id");
  const shareToken = searchParams.get("share");

  if (shareToken) {
    // Public share access
    const caseData = getCaseByShareToken(shareToken);
    if (!caseData) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    const uploads = getUploadsByCase(caseData.id);
    return NextResponse.json({
      caseData: {
        ...caseData,
        // Omit sensitive data from shared view
        user_id: undefined,
        client_name: undefined,
      },
      uploads: uploads.map((u) => ({ filename: u.filename, mime_type: u.mime_type })),
    });
  }

  if (caseId) {
    // Authenticated access
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const caseData = getCaseById(caseId);
    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    if (caseData.user_id !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const uploads = getUploadsByCase(caseData.id);
    return NextResponse.json({ caseData, uploads });
  }

  return NextResponse.json({ error: "Missing id or share parameter" }, { status: 400 });
}
