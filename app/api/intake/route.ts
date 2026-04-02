import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { createIntakeSubmission } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      email,
      phone,
      state,
      incidentDate,
      concernType,
      description,
      consent,
    } = body;

    // Validate required fields
    if (!firstName?.trim()) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      );
    }
    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }
    if (!state?.trim()) {
      return NextResponse.json(
        { error: "State is required" },
        { status: 400 }
      );
    }
    if (!concernType?.trim()) {
      return NextResponse.json(
        { error: "Type of concern is required" },
        { status: 400 }
      );
    }
    if (!description?.trim()) {
      return NextResponse.json(
        { error: "Please describe what happened" },
        { status: 400 }
      );
    }
    if (description.length > 500) {
      return NextResponse.json(
        { error: "Description must be 500 characters or fewer" },
        { status: 400 }
      );
    }
    if (!consent) {
      return NextResponse.json(
        { error: "You must acknowledge the disclaimer to submit" },
        { status: 400 }
      );
    }

    const id = uuid();
    createIntakeSubmission(
      id,
      firstName.trim(),
      email.trim(),
      phone?.trim() || null,
      state.trim(),
      incidentDate?.trim() || null,
      concernType.trim(),
      description.trim()
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[intake] Error creating submission:", error);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}
