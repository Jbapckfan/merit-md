// ── MedMal Review Pro — Memo Generator ──
// Takes structured analysis output and generates:
//   - memo.md  (markdown)
//   - memo.pdf (via pdfkit)

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createWriteStream } from "node:fs";
import type { ExtractedSegment } from "./extract-text";

// Re-export for convenience
export type { ExtractedSegment };

export interface IntakeData {
  matterId: string;
  firmName: string;
  patientInitials: string;
  state: string;
  incidentDate: string;
  summary: string;
}

export interface AnalysisIssue {
  title: string;
  severity: "CRITICAL" | "MAJOR" | "MINOR";
  category: string;
  description: string;
  evidence: string;
  standardOfCare: string;
  shouldHaveDone: string;
  defenseConsiderations: string;
  uncertainty: string;
}

export interface AnalysisResult {
  caseSummary: string;
  issues: AnalysisIssue[];
  stateContext: {
    jurisdiction: string;
    statuteOfLimitations: string;
    damageCaps: string;
    certificateOfMerit: string;
    comparativeFault: string;
    asOfDate: string;
  };
  defenseVulnerability: {
    overallPosture: string;
    keyArguments: string[];
    weaknesses: string[];
  };
  nextSteps: string[];
  expertWitness: string;
  depositionQuestions: string[];
  legalAssessment?: {
    dutyEstablished: string;
    breachIdentified: string;
    causationSupported: string;
    damagesSeverity: number;
    damagesDescription: string;
    certificateOfMerit: string;
    keyDefenseArguments: string[];
    depositionQuestions: string[];
  };
}

interface MemoInput {
  intake: IntakeData;
  segments: ExtractedSegment[];
  analysis: AnalysisResult;
  outputDir: string;
}

const FOUNDER_NAME = "James Alford";
const DIVIDER = "\u2501".repeat(45); // ━ repeated

function formatDate(): string {
  return new Date().toISOString().split("T")[0];
}

function buildMarkdown(input: MemoInput): string {
  const { intake, segments, analysis } = input;
  const today = formatDate();

  // Build document inventory
  const sourceMap = new Map<string, number>();
  for (const seg of segments) {
    const current = sourceMap.get(seg.source) || 0;
    sourceMap.set(seg.source, Math.max(current, seg.page));
  }
  const inventory = Array.from(sourceMap.entries())
    .map(([source, maxPage]) => `  - ${source} (${maxPage} page${maxPage > 1 ? "s" : ""})`)
    .join("\n");

  // Build issues section
  const issuesSection = analysis.issues
    .map((issue, i) => {
      return `  **Issue #${i + 1}: ${issue.title}**
  Severity: ${issue.severity}
  Category: ${issue.category}

  What happened:
  ${issue.description}

  Record evidence:
  ${issue.evidence}

  Standard of care:
  ${issue.standardOfCare}

  What should have occurred:
  ${issue.shouldHaveDone}

  Defense considerations:
  ${issue.defenseConsiderations}

  Uncertainty:
  ${issue.uncertainty}`;
    })
    .join("\n\n");

  // Build next steps
  const nextSteps = analysis.nextSteps
    .map((step, i) => `${i + 1}. ${step}`)
    .join("\n");

  // Build deposition questions
  const depositionQs = analysis.depositionQuestions
    .map((q, i) => `${i + 1}. ${q}`)
    .join("\n");

  // Build defense arguments
  const defenseArgs = analysis.defenseVulnerability.keyArguments
    .map((a) => `  - ${a}`)
    .join("\n");
  const defenseWeaknesses = analysis.defenseVulnerability.weaknesses
    .map((w) => `  - ${w}`)
    .join("\n");

  return `CONFIDENTIAL — ATTORNEY WORK PRODUCT

MedMal Review Pro
Issue-Spotting Analysis

Matter: ${intake.matterId}
Date: ${today}
State: ${intake.state}
Prepared by: ${FOUNDER_NAME}, MD, Board-Certified Emergency Medicine

IMPORTANT DISCLAIMER:
This report identifies potential issues for attorney review. It does not
constitute legal advice, medical advice, or an expert medical opinion.
All findings require independent verification by qualified professionals.

${DIVIDER}

DOCUMENT INVENTORY
${inventory}

CASE SUMMARY
${analysis.caseSummary}

ISSUES IDENTIFIED

${issuesSection}

STATE-SPECIFIC LEGAL CONTEXT
  Jurisdiction: ${analysis.stateContext.jurisdiction}
  Statute of limitations: ${analysis.stateContext.statuteOfLimitations}
  Damage caps: ${analysis.stateContext.damageCaps}
  Certificate of merit: ${analysis.stateContext.certificateOfMerit}
  Comparative fault rule: ${analysis.stateContext.comparativeFault}
  As of: ${analysis.stateContext.asOfDate}

DEFENSE VULNERABILITY ANALYSIS
${analysis.defenseVulnerability.overallPosture}

Key defense arguments anticipated:
${defenseArgs}

Weaknesses in the defense position:
${defenseWeaknesses}

RECOMMENDED NEXT STEPS
${nextSteps}

EXPERT WITNESS RECOMMENDATIONS
${analysis.expertWitness}

SUGGESTED DEPOSITION QUESTIONS
${depositionQs}

${DIVIDER}
This analysis was prepared using MedMal Review Pro's clinical knowledge
base and legal framework. All medical standards reference published
guidelines as of ${today}. All legal references reflect law as of ${today}.
Independent verification is required.
`;
}

async function generatePdf(markdown: string, outputPath: string): Promise<void> {
  const PDFDocument = (await import("pdfkit")).default;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: 72, bottom: 72, left: 72, right: 72 },
      info: {
        Title: "MedMal Review Pro — Issue-Spotting Analysis",
        Author: FOUNDER_NAME,
        Subject: "Medical Malpractice Case Analysis",
      },
    });

    const stream = createWriteStream(outputPath);
    doc.pipe(stream);

    // Parse markdown into sections and render
    const lines = markdown.split("\n");
    let inHeader = true;

    for (const line of lines) {
      if (line === DIVIDER) {
        doc.moveDown(0.5);
        doc
          .strokeColor("#333333")
          .lineWidth(1)
          .moveTo(72, doc.y)
          .lineTo(540, doc.y)
          .stroke();
        doc.moveDown(0.5);
        continue;
      }

      // Title lines (first block before divider)
      if (inHeader) {
        if (line.startsWith("CONFIDENTIAL")) {
          doc.fontSize(8).fillColor("#cc0000").text(line, { align: "center" });
          doc.moveDown(0.5);
          continue;
        }
        if (line === "MedMal Review Pro") {
          doc.fontSize(18).fillColor("#000000").text(line, { align: "center" });
          continue;
        }
        if (line === "Issue-Spotting Analysis") {
          doc.fontSize(14).fillColor("#333333").text(line, { align: "center" });
          doc.moveDown(0.5);
          inHeader = false;
          continue;
        }
      }

      // Section headers (ALL CAPS lines)
      if (/^[A-Z][A-Z\s-]+$/.test(line.trim()) && line.trim().length > 3) {
        doc.moveDown(0.5);
        doc.fontSize(12).fillColor("#000000").font("Helvetica-Bold").text(line.trim());
        doc.moveDown(0.3);
        doc.font("Helvetica");
        continue;
      }

      // Issue sub-headers (bold markers)
      if (line.trim().startsWith("**Issue #")) {
        doc.moveDown(0.3);
        const cleanLine = line.replace(/\*\*/g, "").trim();
        doc.fontSize(11).fillColor("#000000").font("Helvetica-Bold").text(cleanLine);
        doc.font("Helvetica");
        continue;
      }

      // Field labels (Severity:, Category:, etc.)
      const fieldMatch = line.trim().match(/^(Severity|Category|What happened|Record evidence|Standard of care|What should have occurred|Defense considerations|Uncertainty|Jurisdiction|Statute of limitations|Damage caps|Certificate of merit|Comparative fault rule|As of|Matter|Date|State|Prepared by):\s*(.*)/);
      if (fieldMatch) {
        doc.fontSize(10).fillColor("#000000");
        doc.font("Helvetica-Bold").text(fieldMatch[1] + ": ", { continued: true });
        doc.font("Helvetica").text(fieldMatch[2] || "");
        continue;
      }

      // Numbered items
      if (/^\d+\.\s/.test(line.trim())) {
        doc.fontSize(10).fillColor("#000000").text(line.trim(), { indent: 18 });
        continue;
      }

      // Bullet items
      if (line.trim().startsWith("- ") || line.trim().startsWith("  - ")) {
        doc.fontSize(10).fillColor("#000000").text(line.trim(), { indent: 18 });
        continue;
      }

      // IMPORTANT DISCLAIMER block
      if (line.startsWith("IMPORTANT DISCLAIMER:")) {
        doc.fontSize(9).fillColor("#666666").font("Helvetica-Oblique").text(line.trim());
        doc.font("Helvetica");
        continue;
      }

      // Empty lines
      if (line.trim() === "") {
        doc.moveDown(0.3);
        continue;
      }

      // Regular text
      doc.fontSize(10).fillColor("#000000").text(line.trim());
    }

    doc.end();

    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));
  });
}

/**
 * Generate memo.md and memo.pdf from analysis results.
 */
export async function generateMemo(input: MemoInput): Promise<{ mdPath: string; pdfPath: string }> {
  const markdown = buildMarkdown(input);

  const mdPath = join(input.outputDir, "memo.md");
  const pdfPath = join(input.outputDir, "memo.pdf");

  // Write markdown
  await writeFile(mdPath, markdown, "utf-8");
  console.log(`  [memo] Wrote ${mdPath}`);

  // Generate PDF
  await generatePdf(markdown, pdfPath);
  console.log(`  [memo] Wrote ${pdfPath}`);

  return { mdPath, pdfPath };
}
