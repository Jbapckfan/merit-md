import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { getSession } from "@/lib/auth";
import {
  createCase,
  getCasesByUser,
  createUpload,
  getUploadsByCase,
  updateCaseReport,
} from "@/lib/db";
import { extractTextFromPdf, extractTextFromImage, getFileType, isSupportedFile } from "@/lib/pdf-extract";
import { analyzeCase } from "@/lib/analysis";

const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cases = getCasesByUser(session.userId);
  return NextResponse.json({ cases });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const caseSummary = formData.get("caseSummary") as string;
    const clientName = formData.get("clientName") as string | null;
    const incidentDate = formData.get("incidentDate") as string | null;
    const files = formData.getAll("files") as File[];

    if (!caseSummary) {
      return NextResponse.json({ error: "Case summary is required" }, { status: 400 });
    }

    // Validate file sizes
    let totalSize = 0;
    for (const file of files) {
      totalSize += file.size;
    }
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: "Total file size exceeds 50MB limit" },
        { status: 400 }
      );
    }

    // Create the case
    const caseId = uuid();
    createCase(
      caseId,
      session.userId,
      caseSummary,
      clientName || undefined,
      incidentDate || undefined
    );

    // Process uploaded files
    const allExtractedText: string[] = [];

    for (const file of files) {
      if (!isSupportedFile(file.type)) {
        continue; // Skip unsupported files
      }

      const uploadId = uuid();
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileType = getFileType(file.type);

      let extractedText = "";
      if (fileType === "pdf") {
        extractedText = await extractTextFromPdf(buffer);
      } else if (fileType === "image") {
        extractedText = extractTextFromImage();
      } else if (fileType === "text") {
        extractedText = buffer.toString("utf-8");
      }

      createUpload(uploadId, caseId, file.name, file.type, file.size, extractedText);

      if (extractedText) {
        allExtractedText.push(`--- ${file.name} ---\n${extractedText}`);
      }
    }

    // Run analysis (async — update case when done)
    const clinicalText = allExtractedText.join("\n\n");

    // For MVP, run synchronously so the user gets the result immediately
    try {
      const report = await analyzeCase(caseSummary, clinicalText);
      const shareToken = uuid();
      updateCaseReport(caseId, "complete", report.score, JSON.stringify(report), shareToken);
    } catch (err) {
      console.error("[cases] Analysis failed:", err);
      updateCaseReport(caseId, "error", null, null, null);
    }

    return NextResponse.json({ success: true, caseId });
  } catch (error) {
    console.error("[cases] Error creating case:", error);
    return NextResponse.json({ error: "Failed to create case" }, { status: 500 });
  }
}
