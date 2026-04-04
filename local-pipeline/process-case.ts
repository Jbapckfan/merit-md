#!/usr/bin/env npx tsx
// ── MedMal Review Pro — Local Case Processing Pipeline ──
// Main entry point. Takes a case directory and runs the full analysis.
//
// Usage: npx tsx local-pipeline/process-case.ts /path/to/case-dir
//
// Case directory structure:
//   case-dir/
//     records/        — PDF files, images, text files
//     intake.json     — { matterId, firmName, patientInitials, state, incidentDate, summary }
//
// Output:
//   case-dir/
//     extracted/      — extracted text from each record
//     analysis.json   — structured analysis result
//     memo.md         — formatted issue-spotting memo
//     memo.pdf        — PDF version of the memo

import { readFile, writeFile, access, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

import { extractAllText, concatenateWithAttribution, saveExtracted } from "./extract-text";
import { generateMemo } from "./generate-memo";
import type { IntakeData, AnalysisResult } from "./generate-memo";

// Knowledge base imports — relative to project root
import { getKnowledgeForText, detectCategories } from "../lib/clinical-knowledge";
import { getMedLegalContext } from "../lib/medical-legal-expert";
import { getStateLaw, getStateLawSummary, detectStatesInText } from "../lib/state-law-engine";

// ── Helpers ──

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function severityLabel(s: string): "CRITICAL" | "MAJOR" | "MINOR" {
  const normalized = s.toUpperCase();
  if (normalized === "CRITICAL") return "CRITICAL";
  if (normalized === "MINOR") return "MINOR";
  return "MAJOR";
}

// ── Build the analysis prompt ──

function buildAnalysisPrompt(
  clinicalText: string,
  intake: IntakeData,
): string {
  // Detect clinical categories and build knowledge context
  const knowledgeContext = getKnowledgeForText(clinicalText);
  const medLegalContext = getMedLegalContext(clinicalText);

  // Inject state-specific law
  const stateCode = intake.state.trim().toUpperCase();
  const stateLaw = getStateLaw(stateCode);
  let stateContext = "";
  if (stateLaw) {
    stateContext = "\n\n## JURISDICTION-SPECIFIC LAW\n" + getStateLawSummary(stateCode);
  } else {
    // Try to detect states from the text itself
    const detected = detectStatesInText(clinicalText);
    if (detected.length > 0) {
      stateContext = "\n\n## JURISDICTION-SPECIFIC LAW\n" +
        detected.map((s) => getStateLawSummary(s.stateCode)).join("\n\n---\n\n");
    }
  }

  return `You are an experienced emergency medicine physician AND medical-legal expert reviewing clinical records for potential medical malpractice. You have deep expertise in both the clinical standard of care and the litigation framework.

Your task: Perform a comprehensive issue-spotting analysis of the medical records provided. This analysis is for attorney use in evaluating case merit.

For each potential issue, provide detailed analysis including:
- A descriptive title
- Severity classification (CRITICAL, MAJOR, MINOR)
- Category (Missed Diagnosis, Delayed Treatment, Documentation Gap, Protocol Violation, Medication Error, EMTALA Issue)
- What happened (the deviation)
- Specific record evidence with source attribution
- The applicable standard of care with guideline citation and publication date
- What a reasonable physician should have done
- How defense would likely respond
- What additional information would strengthen or weaken the finding

Also provide:
- A narrative case summary
- State-specific legal context assessment
- Defense vulnerability analysis (overall posture, key arguments, weaknesses)
- Recommended next steps for the attorney
- Expert witness recommendations (specialty, qualifications, role)
- Specific deposition questions for the treating physician
${knowledgeContext}
${medLegalContext}
${stateContext}

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "caseSummary": "<narrative case summary>",
  "issues": [
    {
      "title": "<descriptive issue title>",
      "severity": "CRITICAL|MAJOR|MINOR",
      "category": "<category>",
      "description": "<what happened>",
      "evidence": "<specific record quotes with source attribution>",
      "standardOfCare": "<guideline citation with publication date>",
      "shouldHaveDone": "<what a reasonable physician would have done>",
      "defenseConsiderations": "<how defense would respond>",
      "uncertainty": "<what additional info would help>"
    }
  ],
  "stateContext": {
    "jurisdiction": "<state>",
    "statuteOfLimitations": "<X years, discovery rule info>",
    "damageCaps": "<current amounts with statute>",
    "certificateOfMerit": "<required/not required + details>",
    "comparativeFault": "<rule type>",
    "asOfDate": "<date>"
  },
  "defenseVulnerability": {
    "overallPosture": "<assessment>",
    "keyArguments": ["<defense argument 1>", "..."],
    "weaknesses": ["<defense weakness 1>", "..."]
  },
  "nextSteps": ["<action item 1>", "..."],
  "expertWitness": "<specialty, qualifications, role recommendation>",
  "depositionQuestions": ["<question 1>", "..."]
}`;
}

// ── Run Claude CLI ──

async function callClaude(systemPrompt: string, clinicalText: string): Promise<string> {
  const userMessage = clinicalText.slice(0, 80_000); // stay within context limits

  // Write system prompt to a file (knowledge base is too large for shell args)
  const sysPromptFile = join(tmpdir(), `merit-md-sys-${Date.now()}.txt`);
  await writeFile(sysPromptFile, systemPrompt, "utf-8");

  // Write user message to a file too (pipe via stdin)
  const userPromptFile = join(tmpdir(), `merit-md-user-${Date.now()}.txt`);
  await writeFile(userPromptFile, `## CLINICAL RECORDS\n\n${userMessage}`, "utf-8");

  console.log(`  [claude] System prompt: ${(systemPrompt.length / 1024).toFixed(0)}KB`);
  console.log(`  [claude] Clinical text: ${(userMessage.length / 1024).toFixed(0)}KB`);
  console.log("  [claude] Calling Claude CLI...");
  const startTime = Date.now();

  // Read user prompt content for direct -p argument
  const userPromptContent = await readFile(userPromptFile, "utf-8");

  return new Promise((resolve, reject) => {
    const proc = spawn("claude", [
      "-p", userPromptContent,
      "--system-prompt-file", sysPromptFile,
      "--output-format", "text",
      "--max-turns", "5",
    ], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    const chunks: Buffer[] = [];
    const errChunks: Buffer[] = [];

    proc.stdout.on("data", (chunk: Buffer) => chunks.push(chunk));
    proc.stderr.on("data", (chunk: Buffer) => errChunks.push(chunk));

    // Set a generous timeout — complex analysis can take a few minutes
    const timer = setTimeout(() => {
      proc.kill("SIGTERM");
      reject(new Error("Claude CLI timed out after 8 minutes"));
    }, 480_000);

    proc.on("close", async (code: number | null) => {
      clearTimeout(timer);

      // Clean up temp files
      const { unlink } = await import("node:fs/promises");
      try { await unlink(sysPromptFile); } catch { /* ignore */ }
      try { await unlink(userPromptFile); } catch { /* ignore */ }

      const stdout = Buffer.concat(chunks).toString("utf-8").trim();
      const stderr = Buffer.concat(errChunks).toString("utf-8").trim();

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      if (code !== 0 && code !== null) {
        console.error(`  [claude] stderr: ${stderr}`);
        reject(new Error(`Claude CLI exited with code ${code}: ${stderr}`));
        return;
      }

      if (!stdout) {
        console.error(`  [claude] stderr: ${stderr}`);
        reject(new Error(`Claude CLI returned empty output. stderr: ${stderr}`));
        return;
      }

      console.log(`  [claude] Response received in ${elapsed}s (${(stdout.length / 1024).toFixed(0)}KB)`);
      resolve(stdout);
    });

    proc.on("error", (err: Error) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

// ── Parse Claude's response into structured analysis ──

function parseAnalysisResponse(raw: string, intake: IntakeData): AnalysisResult {
  // Extract JSON from potential markdown code blocks
  let jsonStr = raw;
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  // Try to find JSON object boundaries if extraction failed
  if (!jsonStr.trim().startsWith("{")) {
    const firstBrace = jsonStr.indexOf("{");
    const lastBrace = jsonStr.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
    }
  }

  const parsed = JSON.parse(jsonStr.trim());

  const today = new Date().toISOString().split("T")[0];

  return {
    caseSummary: parsed.caseSummary || intake.summary || "No summary available.",
    issues: (parsed.issues || []).map((issue: Record<string, string>) => ({
      title: issue.title || "Untitled Issue",
      severity: severityLabel(issue.severity || "MAJOR"),
      category: issue.category || "Documentation Gap",
      description: issue.description || "",
      evidence: issue.evidence || "",
      standardOfCare: issue.standardOfCare || "",
      shouldHaveDone: issue.shouldHaveDone || "",
      defenseConsiderations: issue.defenseConsiderations || "",
      uncertainty: issue.uncertainty || "",
    })),
    stateContext: {
      jurisdiction: parsed.stateContext?.jurisdiction || intake.state,
      statuteOfLimitations: parsed.stateContext?.statuteOfLimitations || "See state law engine",
      damageCaps: parsed.stateContext?.damageCaps || "See state law engine",
      certificateOfMerit: parsed.stateContext?.certificateOfMerit || "See state law engine",
      comparativeFault: parsed.stateContext?.comparativeFault || "See state law engine",
      asOfDate: parsed.stateContext?.asOfDate || today,
    },
    defenseVulnerability: {
      overallPosture: parsed.defenseVulnerability?.overallPosture || "Not assessed.",
      keyArguments: parsed.defenseVulnerability?.keyArguments || [],
      weaknesses: parsed.defenseVulnerability?.weaknesses || [],
    },
    nextSteps: parsed.nextSteps || [],
    expertWitness: parsed.expertWitness || "Board-certified emergency medicine physician with active clinical practice.",
    depositionQuestions: parsed.depositionQuestions || [],
    legalAssessment: parsed.legalAssessment || undefined,
  };
}

// ── Main Pipeline ──

async function main() {
  const caseDir = process.argv[2];

  if (!caseDir) {
    console.error("Usage: npx tsx local-pipeline/process-case.ts /path/to/case-dir");
    process.exit(1);
  }

  console.log(`\n== MedMal Review Pro — Local Processing Pipeline ==`);
  console.log(`Case directory: ${caseDir}\n`);

  // 1. Read intake.json
  const intakePath = join(caseDir, "intake.json");
  if (!await fileExists(intakePath)) {
    console.error(`ERROR: intake.json not found at ${intakePath}`);
    console.error("Create intake.json with: { matterId, firmName, patientInitials, state, incidentDate, summary }");
    process.exit(1);
  }

  const intake: IntakeData = JSON.parse(await readFile(intakePath, "utf-8"));
  console.log(`[intake] Matter: ${intake.matterId}`);
  console.log(`[intake] Firm: ${intake.firmName}`);
  console.log(`[intake] Patient: ${intake.patientInitials}`);
  console.log(`[intake] State: ${intake.state}`);
  console.log(`[intake] Incident: ${intake.incidentDate}\n`);

  // 2. Extract text from records
  const recordsDir = join(caseDir, "records");
  if (!await fileExists(recordsDir)) {
    console.error(`ERROR: records/ directory not found at ${recordsDir}`);
    console.error("Place medical records (PDF, images, text files) in the records/ directory.");
    process.exit(1);
  }

  console.log("[step 1] Extracting text from records...");
  const segments = await extractAllText(recordsDir);
  console.log(`  Found ${segments.length} text segment(s) from records.\n`);

  // Save extracted text
  const extractedDir = join(caseDir, "extracted");
  await saveExtracted(segments, extractedDir);
  console.log(`  Saved extracted text to ${extractedDir}/\n`);

  // 3. Concatenate with source attribution
  const clinicalText = concatenateWithAttribution(segments);

  // 4. Detect clinical categories
  const categories = detectCategories(clinicalText);
  console.log(`[step 2] Detected clinical categories: ${categories.join(", ") || "none"}`);

  // 5. Detect state for jurisdiction
  const stateCode = intake.state.trim().toUpperCase();
  const stateLaw = getStateLaw(stateCode);
  if (stateLaw) {
    console.log(`[step 3] State law loaded: ${stateLaw.state} (${stateLaw.stateCode})`);
  } else {
    console.warn(`[step 3] WARNING: No state law data for "${intake.state}" — analysis will proceed without jurisdiction-specific context.`);
  }

  // 6. Build prompt and run Claude
  console.log("\n[step 4] Running AI analysis...");
  const prompt = buildAnalysisPrompt(clinicalText, intake);

  let analysis: AnalysisResult;
  try {
    const rawResponse = await callClaude(prompt, clinicalText);

    // Save raw response for debugging
    await writeFile(join(caseDir, "raw-response.txt"), rawResponse, "utf-8");

    // 7. Parse response
    console.log("[step 5] Parsing analysis response...");
    analysis = parseAnalysisResponse(rawResponse, intake);
    console.log(`  Found ${analysis.issues.length} issue(s):`);
    for (const issue of analysis.issues) {
      console.log(`    [${issue.severity}] ${issue.title}`);
    }
  } catch (error) {
    console.error("\n[ERROR] AI analysis failed:", error);
    console.error("Check that 'claude' CLI is installed and authenticated.");
    process.exit(1);
  }

  // 8. Save structured analysis
  const analysisPath = join(caseDir, "analysis.json");
  await writeFile(analysisPath, JSON.stringify(analysis, null, 2), "utf-8");
  console.log(`\n[step 6] Saved analysis to ${analysisPath}`);

  // 9. Generate memo
  console.log("[step 7] Generating memo...");
  const { mdPath, pdfPath } = await generateMemo({
    intake,
    segments,
    analysis,
    outputDir: caseDir,
  });

  // Done
  console.log(`\n== Processing Complete ==`);
  console.log(`  Analysis: ${analysisPath}`);
  console.log(`  Memo (MD): ${mdPath}`);
  console.log(`  Memo (PDF): ${pdfPath}`);
  console.log(`  Extracted text: ${extractedDir}/`);
  console.log(`  Raw AI response: ${join(caseDir, "raw-response.txt")}`);
  console.log("");
}

main().catch((err) => {
  console.error("\n[FATAL]", err);
  process.exit(1);
});
