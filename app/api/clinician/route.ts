// ── MedMal Review Pro Clinician API ──
// GET /api/clinician?complaint=chest-pain
// Returns JSON with the 5-card clinician decision support data.

import { NextRequest, NextResponse } from "next/server";
import {
  getClinicianOutput,
  getComplaintList,
  searchComplaints,
} from "@/lib/clinician-mapper";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const complaint = searchParams.get("complaint");
  const query = searchParams.get("q");

  // If no complaint specified, return the list (optionally filtered by q)
  if (!complaint) {
    const list = query ? searchComplaints(query) : getComplaintList();
    return NextResponse.json({ complaints: list });
  }

  // Normalize complaint slug
  const slug = complaint
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  const output = getClinicianOutput(slug);

  if (!output) {
    return NextResponse.json(
      {
        error: "Complaint not found",
        message: `"${complaint}" is not a supported chief complaint.`,
        availableComplaints: getComplaintList(),
      },
      { status: 404 }
    );
  }

  return NextResponse.json(output);
}
