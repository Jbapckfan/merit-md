import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import {
  createPatientCase,
  getPatientCaseById,
  updatePatientCaseReport,
  createUpload,
  getUploadsByCase,
} from "@/lib/db";
import { extractTextFromPdf, extractTextFromImage, getFileType, isSupportedFile } from "@/lib/pdf-extract";
import { analyzeConsumerCase } from "@/lib/consumer-analysis";

const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

// GET /api/patient?id=<caseId> — retrieve patient report
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("id");

  if (!caseId) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  const patientCase = getPatientCaseById(caseId);
  if (!patientCase) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const uploads = getUploadsByCase(patientCase.id);

  return NextResponse.json({
    patientCase,
    uploads: uploads.map((u) => ({ filename: u.filename, mime_type: u.mime_type })),
  });
}

// POST /api/patient — create patient case
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const description = formData.get("description") as string;
    const email = formData.get("email") as string;
    const incidentDate = formData.get("incidentDate") as string | null;
    const facility = formData.get("facility") as string | null;
    const outcomeType = formData.get("outcomeType") as string | null;
    const tier = formData.get("tier") as string | null;
    const files = formData.getAll("files") as File[];

    if (!description) {
      return NextResponse.json({ error: "Please describe what happened" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
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

    // Create the patient case
    const caseId = uuid();
    createPatientCase(
      caseId,
      email,
      description,
      incidentDate || undefined,
      facility || undefined,
      outcomeType || undefined,
      tier || "quick"
    );

    // Process uploaded files
    const allExtractedText: string[] = [];

    for (const file of files) {
      if (!isSupportedFile(file.type)) {
        continue;
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

    // Run consumer analysis
    const clinicalText = allExtractedText.join("\n\n");

    try {
      const report = await analyzeConsumerCase(
        description,
        clinicalText,
        facility || undefined,
        outcomeType || undefined,
        incidentDate || undefined
      );
      updatePatientCaseReport(caseId, "complete", report.score, JSON.stringify(report));
    } catch (err) {
      console.error("[patient] Analysis failed:", err);
      updatePatientCaseReport(caseId, "error", null, null);
    }

    return NextResponse.json({ success: true, caseId });
  } catch (error) {
    console.error("[patient] Error creating case:", error);
    return NextResponse.json({ error: "Failed to create case" }, { status: 500 });
  }
}
