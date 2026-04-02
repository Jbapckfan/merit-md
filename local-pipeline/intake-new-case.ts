#!/usr/bin/env npx tsx
// ── MedMal Review Pro — New Case Intake CLI ──
// Interactive CLI to create a new case directory with intake.json.
//
// Usage: npx tsx local-pipeline/intake-new-case.ts

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createInterface } from "node:readline";

const CASES_DIR = join(process.env.HOME || "~", ".merit-md", "cases");

function prompt(rl: ReturnType<typeof createInterface>, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function main() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n== MedMal Review Pro — New Case Intake ==\n");

  const matterId = await prompt(rl, "  Matter ID: ");
  if (!matterId) {
    console.error("ERROR: Matter ID is required.");
    rl.close();
    process.exit(1);
  }

  const firmName = await prompt(rl, "  Firm name: ");
  const patientInitials = await prompt(rl, "  Patient initials: ");
  const state = await prompt(rl, "  State (2-letter code): ");
  const incidentDate = await prompt(rl, "  Incident date (YYYY-MM-DD): ");
  const summary = await prompt(rl, "  Brief summary: ");

  rl.close();

  // Create case directory
  const caseDir = join(CASES_DIR, matterId);
  const recordsDir = join(caseDir, "records");

  await mkdir(recordsDir, { recursive: true });

  // Write intake.json
  const intake = {
    matterId,
    firmName: firmName || "Unknown",
    patientInitials: patientInitials || "XX",
    state: state.toUpperCase() || "XX",
    incidentDate: incidentDate || "unknown",
    summary: summary || "No summary provided.",
  };

  const intakePath = join(caseDir, "intake.json");
  await writeFile(intakePath, JSON.stringify(intake, null, 2), "utf-8");

  console.log(`\nCreated: ${caseDir}/`);
  console.log(`Place records in: ${recordsDir}/`);
  console.log(`Then run: npx tsx local-pipeline/process-case.ts ${caseDir}`);
  console.log("");
}

main().catch((err) => {
  console.error("[FATAL]", err);
  process.exit(1);
});
