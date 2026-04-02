#!/usr/bin/env node

/**
 * generate-sample-reports.js
 *
 * Reads pre-generated analysis text files and renders professional
 * PDF reports for attorney sample downloads.
 *
 * Usage: node scripts/generate-sample-reports.js
 */

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/* ─────────────────────────── config ─────────────────────────── */

const CASES = [
  {
    inputFile: "/tmp/analysis-case1.txt",
    outputFile: "sample-report-ed-chest-pain.pdf",
    matterId: "MR-2026-" + crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 6),
    caseTitle: "Emergency Department Chest Pain — Missed STEMI",
    caseSummary:
      "52-year-old male presented to the emergency department with substernal chest pressure of 2 hours duration. " +
      "Patient had significant cardiac risk factors including hypertension, hyperlipidemia, type 2 diabetes, and active smoking history. " +
      "A single troponin was drawn (0.03 ng/mL, near the 0.04 cutoff) and no serial troponins were obtained despite a 4-hour ED stay. " +
      "Patient was diagnosed with musculoskeletal chest pain and discharged with ibuprofen. " +
      "Returned 14 hours later with STEMI, troponin of 8.4, and 95% LAD occlusion. Resultant ejection fraction of 35% (permanent cardiac damage).",
  },
  {
    inputFile: "/tmp/analysis-case2.txt",
    outputFile: "sample-report-sepsis-delayed-abx.pdf",
    matterId: "MR-2026-" + crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 6),
    caseTitle: "Sepsis with Delayed Antibiotic Administration",
    caseSummary:
      "Elderly female from assisted living facility presented to the ED with fever (101.8F), hypotension (BP 92/58), " +
      "tachycardia (HR 112), altered mental status, and cloudy malodorous urine. Classic sepsis presentation with " +
      "history of recurrent UTIs, CHF, and CKD. Despite meeting sepsis criteria on arrival, antibiotics were not " +
      "administered until 3.5 hours after presentation. Lactate resulted at 4.8 (severe sepsis range) at 00:10, " +
      "yet antibiotics were not given until 01:45. Patient deteriorated to septic shock with ARDS, requiring 6 days " +
      "of mechanical ventilation, 12 ICU days, and 21 total hospital days.",
  },
  {
    inputFile: "/tmp/analysis-case3.txt",
    outputFile: "sample-report-cauda-equina.pdf",
    matterId: "MR-2026-" + crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 6),
    caseTitle: "Missed Cauda Equina Syndrome",
    caseSummary:
      "45-year-old male with known L4-5 disc herniation presented with bilateral leg pain and numbness described as " +
      "'more severe' than prior episodes. Physical exam revealed bilateral positive straight leg raise at 30 degrees, " +
      "bilateral 4/5 hip flexor and dorsiflexion strength, bilateral diminished L5 sensation, and bilateral reduced " +
      "Achilles reflexes. Despite these classic cauda equina syndrome red flags, the physician documented 'no red flags' " +
      "and discharged the patient with an outpatient MRI scheduled for 2 weeks later. Patient returned 36 hours later " +
      "with complete cauda equina syndrome, underwent emergent decompression, but sustained permanent bowel/bladder " +
      "dysfunction and bilateral lower extremity weakness.",
  },
];

const OUTPUT_DIR = path.join(__dirname, "..", "public", "samples");

/* ─────────────────────────── colors ─────────────────────────── */

const COLORS = {
  headerBg: "#1a1a2e",
  headerText: "#ffffff",
  footerText: "#888888",
  bodyText: "#1a1a1a",
  mutedText: "#555555",
  sectionHeader: "#1a1a2e",
  disclaimerBg: "#f0f0f0",
  disclaimerBorder: "#cccccc",
  disclaimerText: "#444444",
  cardBg: "#fafafa",
  cardBorder: "#dddddd",
  severityCritical: "#dc2626",
  severityCriticalBg: "#fef2f2",
  severityMajor: "#ea580c",
  severityMajorBg: "#fff7ed",
  severityMinor: "#ca8a04",
  severityMinorBg: "#fefce8",
  severityHigh: "#ea580c",
  severityHighBg: "#fff7ed",
  severityModerate: "#ca8a04",
  severityModerateBg: "#fefce8",
  severityLow: "#65a30d",
  severityLowBg: "#f7fee7",
  accentBlue: "#2563eb",
  lightBorder: "#e5e7eb",
  scoreBoxBg: "#f8fafc",
  scoreBoxBorder: "#cbd5e1",
};

/* ─────────────────────────── parser ─────────────────────────── */

function parseAnalysis(text) {
  const result = {
    issues: [],
    negligenceScore: null,
    strongestClaims: [],
    defenseArguments: [],
    expertWitnesses: [],
    depositionQuestions: [],
    bottomLine: [],
    summaryOpinions: [],
  };

  // Extract issues — two formats:
  // Format A: ### Issue N: Title  (case 1 and 3)
  // Format B: table rows | # | Category | Severity | Description | Evidence |  (case 2)

  const issueBlocks = text.split(/### Issue \d+[:\s]*/);
  if (issueBlocks.length > 1) {
    // Format A
    issueBlocks.shift(); // remove text before first issue
    for (const block of issueBlocks) {
      const issue = parseIssueBlock(block);
      if (issue) result.issues.push(issue);
    }
  } else {
    // Format B: table-based issues
    const tableRows = text.match(/\|\s*\d+\s*\|.+\|/g);
    if (tableRows) {
      for (const row of tableRows) {
        const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
        if (cells.length >= 5) {
          result.issues.push({
            title: cells[1].replace(/\*\*/g, ""),
            category: cells[1].replace(/\*\*/g, ""),
            severity: cells[2].replace(/\*\*/g, ""),
            description: cells[3].replace(/\*\*/g, ""),
            evidence: cells[4].replace(/\*\*/g, ""),
            standard: "",
          });
        }
      }
    }
  }

  // Extract negligence score
  const scoreMatch = text.match(/Negligence (?:Probability )?Score[:\s]*\*?\*?(\d+)\s*\/\s*10/i);
  if (scoreMatch) result.negligenceScore = parseInt(scoreMatch[1]);

  // Extract strongest claims (two formats: "**title** — detail" or "**title.** detail")
  const claimsSection = extractSection(text, "Strongest Claims");
  if (claimsSection) {
    // Format A: **title** — detail
    const claimsA = claimsSection.match(/\d+\.\s+\*\*(.+?)\*\*\s*[—\-]+\s*(.+?)(?=\n\n\d+\.|\n---|\n##|$)/gs);
    // Format B: **title.** detail  (or **title** detail with period inside bold)
    const claimsB = claimsSection.match(/\d+\.\s+\*\*(.+?)\*\*\s+(.+?)(?=\n\n\d+\.|\n---|\n##|$)/gs);
    const claims = claimsA || claimsB;
    if (claims) {
      for (const claim of claims) {
        // Try format A first
        let m = claim.match(/\d+\.\s+\*\*(.+?)\*\*\s*[—\-]+\s*(.+)/s);
        if (!m) {
          // Try format B
          m = claim.match(/\d+\.\s+\*\*(.+?)\*\*\s+(.+)/s);
        }
        if (m) result.strongestClaims.push({ title: m[1].trim().replace(/\.$/, ""), detail: m[2].trim().replace(/\*\*/g, "") });
      }
    }
  }

  // Extract defense arguments / weaknesses
  const defenseSection = extractSection(text, "(?:Anticipated )?Defense Arguments|Weaknesses");
  if (defenseSection) {
    // Parse table rows: split lines and extract pipe-delimited cells
    const lines = defenseSection.split("\n").filter((l) => l.trim().startsWith("|"));
    for (const line of lines) {
      // Skip header and separator rows
      if (line.includes("---") || (line.includes("Argument") && line.includes("Rebuttal"))) continue;
      if (line.includes("Defense Argument") && line.includes("Plaintiff Rebuttal")) continue;
      const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
      if (cells.length >= 2) {
        result.defenseArguments.push({
          argument: cells[0].replace(/\*\*/g, "").replace(/^[""]|[""]$/g, "").trim(),
          rebuttal: cells[1].replace(/\*\*/g, "").replace(/^[""]|[""]$/g, "").trim(),
        });
      }
    }
    // numbered list format (case 1 numbered defense args)
    if (result.defenseArguments.length === 0) {
      const numbered = defenseSection.match(/\d+\.\s+[""](.+?)[""](?:\s*\n|$)/g);
      if (numbered) {
        for (const n of numbered) {
          const m = n.match(/\d+\.\s+[""](.+?)[""]/);
          if (m) result.defenseArguments.push({ argument: m[1].trim(), rebuttal: "" });
        }
      }
    }
  }

  // Rebuttal framework (case 1 style)
  const rebuttalMatch = text.match(/\*\*Rebuttal framework:\*\*\s*(.+?)(?=\n---|\n##)/s);
  if (rebuttalMatch && result.defenseArguments.some((d) => !d.rebuttal)) {
    // Attach as a single combined rebuttal
    const rebuttalText = rebuttalMatch[1].replace(/\*\*/g, "").trim();
    result.defenseArguments.push({ argument: "Rebuttal Framework", rebuttal: rebuttalText });
  }

  // Extract expert witnesses
  const expertSection = extractSection(text, "(?:Recommended )?Expert Witness");
  if (expertSection) {
    // table format
    const expertRows = expertSection.match(/\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|/g);
    if (expertRows) {
      for (const row of expertRows) {
        if (row.includes("Specialty") && row.includes("Purpose")) continue;
        if (row.includes("---")) continue;
        const m = row.match(/\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|/);
        if (m) result.expertWitnesses.push({ specialty: m[1].trim(), purpose: m[2].trim() });
      }
    }
    // numbered list format
    const expertList = expertSection.match(/\d+\.\s+\*\*(.+?)\*\*\s*[—\-]\s*(.+?)(?=\n\d+\.|\n---|\n##|$)/gs);
    if (expertList && result.expertWitnesses.length === 0) {
      for (const item of expertList) {
        const m = item.match(/\d+\.\s+\*\*(.+?)\*\*\s*[—\-]\s*(.+)/s);
        if (m) result.expertWitnesses.push({ specialty: m[1].trim(), purpose: m[2].trim().replace(/\*\*/g, "") });
      }
    }
  }

  // Extract deposition questions
  const depoSection = extractSection(text, "(?:Key |Suggested )?Deposition Questions");
  if (depoSection) {
    const questions = depoSection.match(/\d+\.\s+(?:\*\*)?[""](.+?)[""](?:\*\*)?/g);
    if (questions) {
      for (const q of questions) {
        const m = q.match(/\d+\.\s+(?:\*\*)?[""](.+?)[""](?:\*\*)?/);
        if (m) result.depositionQuestions.push(m[1].trim());
      }
    }
  }

  // Extract bottom line / summary opinions
  const bottomSection = extractSection(text, "Bottom Line|Summary (?:Opinion|Assessment)");
  if (bottomSection) {
    const paras = bottomSection.match(/\*\*(.+?)\*\*\s*(.+?)(?=\n\n\*\*|\n---|\n##|$)/gs);
    if (paras) {
      for (const p of paras) {
        const m = p.match(/\*\*(.+?)[:\*]*\*\*\s*(.+)/s);
        if (m) result.bottomLine.push({ label: m[1].trim().replace(/:$/, ""), text: m[2].trim().replace(/\*\*/g, "") });
      }
    }
  }

  // Extract summary assessment text (case 2 style)
  const summaryAssess = extractSection(text, "SUMMARY ASSESSMENT");
  if (summaryAssess) {
    const cleaned = summaryAssess.replace(/\*\*/g, "").replace(/\n{2,}/g, "\n").trim();
    if (cleaned && result.bottomLine.length === 0) {
      result.bottomLine.push({ label: "Summary Assessment", text: cleaned });
    }
  }

  return result;
}

function parseIssueBlock(block) {
  const lines = block.split("\n");
  const title = lines[0]?.trim().replace(/^\|.*$/, "").replace(/\*\*/g, "").trim() || "Untitled Issue";

  const issue = {
    title: title.split("\n")[0],
    category: "",
    severity: "",
    description: "",
    evidence: "",
    standard: "",
  };

  // Extract from table rows
  const categoryMatch = block.match(/\*\*Category\*\*\s*\|\s*(.+?)(?:\s*\||\n)/);
  if (categoryMatch) issue.category = categoryMatch[1].replace(/\*\*/g, "").trim();

  const severityMatch = block.match(/\*\*Severity\*\*\s*\|\s*\*?\*?(.+?)\*?\*?\s*(?:\||\n)/);
  if (severityMatch) issue.severity = severityMatch[1].replace(/\*\*/g, "").trim();

  const deviationMatch = block.match(/\*\*(?:Deviation|Description)\*\*\s*\|\s*(.+?)(?=\n\|\s*\*\*|\n---|\n###)/s);
  if (deviationMatch) issue.description = deviationMatch[1].replace(/\*\*/g, "").replace(/\s*\|\s*$/, "").trim();

  const evidenceMatch = block.match(/\*\*Evidence\*\*\s*\|\s*(.+?)(?=\n\|\s*\*\*|\n---|\n###)/s);
  if (evidenceMatch) issue.evidence = evidenceMatch[1].replace(/\*\*/g, "").replace(/\s*\|\s*$/, "").trim();

  const standardMatch = block.match(/\*\*(?:Standard|Standard of Care)\*\*\s*\|\s*(.+?)(?=\n\|\s*\*\*|\n---|\n###|\n\n)/s);
  if (standardMatch) issue.standard = standardMatch[1].replace(/\*\*/g, "").replace(/\s*\|\s*$/, "").trim();

  // Handle non-table "Description" field (case 3 uses pipe-less format sometimes)
  if (!issue.description) {
    const descAlt = block.match(/\*\*Description\*\*\s*\|\s*(.+?)(?=\n\|\s*\*\*)/s);
    if (descAlt) issue.description = descAlt[1].replace(/\*\*/g, "").replace(/\s*\|\s*$/, "").trim();
  }

  // Also grab any extra commentary below the table (like "This is the single most damaging finding...")
  const extraMatch = block.match(/\n\n\*\*(.+?)\*\*/);
  if (extraMatch && !issue.description.includes(extraMatch[1])) {
    issue.description += "\n\n" + extraMatch[1];
  }

  return issue;
}

function extractSection(text, headerPattern) {
  if (!text) return null;
  try {
    const regex = new RegExp(`###?\\s+${headerPattern}[^\\n]*\\n([\\s\\S]*?)(?=\\n###?\\s|\\n---\\n##|$)`, "i");
    const match = text.match(regex);
    return match && match[1] ? match[1].trim() : null;
  } catch (e) {
    return null;
  }
}

/* ─────────────────────────── pdf rendering ─────────────────────────── */

function generatePDF(caseConfig, analysisData, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: 90, bottom: 80, left: 60, right: 60 },
      bufferPages: true,
      info: {
        Title: `MedMal Review Pro - ${caseConfig.caseTitle}`,
        Author: "MedMal Review Pro",
        Subject: "Confidential Attorney Work Product",
        Creator: "MedMal Review Pro Report Generator",
      },
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - 120; // 60px margins each side
    const reportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // ── Helper: check page space and add new page if needed ──
    function ensureSpace(needed) {
      if (doc.y + needed > doc.page.height - 90) {
        doc.addPage();
        return true;
      }
      return false;
    }

    // ── Helper: wrap text in a colored rounded rect ──
    function drawCard(opts) {
      const { x, y, width, bgColor, borderColor, padding = 12, render } = opts;
      const startY = y + padding;
      doc.x = x + padding;
      doc.y = startY;

      // Render content to measure height
      const contentStartY = startY;
      render(x + padding, startY, width - padding * 2);
      const contentHeight = doc.y - contentStartY + padding;

      // Draw background behind content
      doc
        .save()
        .roundedRect(x, y, width, contentHeight, 4)
        .fill(bgColor);

      if (borderColor) {
        doc
          .roundedRect(x, y, width, contentHeight, 4)
          .lineWidth(0.75)
          .stroke(borderColor);
      }
      doc.restore();

      // Re-render content on top of background
      doc.x = x + padding;
      doc.y = startY;
      render(x + padding, startY, width - padding * 2);

      doc.y += padding;
      return contentHeight;
    }

    // ── Helper: severity badge ──
    function drawSeverityBadge(severity, x, y) {
      const normalizedSeverity = severity.toLowerCase().replace(/[^a-z-]/g, "");
      let bgColor, textColor, label;

      if (normalizedSeverity.includes("critical")) {
        bgColor = COLORS.severityCriticalBg;
        textColor = COLORS.severityCritical;
        label = "CRITICAL";
      } else if (normalizedSeverity.includes("major") || normalizedSeverity.includes("high")) {
        bgColor = COLORS.severityMajorBg;
        textColor = COLORS.severityMajor;
        label = severity.toUpperCase();
      } else if (normalizedSeverity.includes("moderate")) {
        bgColor = COLORS.severityModerateBg;
        textColor = COLORS.severityModerate;
        label = "MODERATE";
      } else if (normalizedSeverity.includes("minor") || normalizedSeverity.includes("low")) {
        bgColor = COLORS.severityMinorBg;
        textColor = COLORS.severityMinor;
        label = severity.toUpperCase();
      } else {
        bgColor = "#f0f0f0";
        textColor = "#666666";
        label = severity.toUpperCase();
      }

      const badgeWidth = doc.fontSize(8).widthOfString(label) + 16;
      doc
        .save()
        .roundedRect(x, y, badgeWidth, 16, 3)
        .fill(bgColor);
      doc
        .roundedRect(x, y, badgeWidth, 16, 3)
        .lineWidth(0.5)
        .stroke(textColor);
      doc
        .fontSize(8)
        .font("Helvetica-Bold")
        .fillColor(textColor)
        .text(label, x, y + 3.5, { width: badgeWidth, align: "center" });
      doc.restore();

      return badgeWidth;
    }

    // ── Helper: section title ──
    function sectionTitle(title) {
      ensureSpace(30);
      doc.y += 6;
      doc
        .fontSize(12)
        .font("Times-Bold")
        .fillColor(COLORS.sectionHeader)
        .text(title.toUpperCase(), 60);
      doc.y += 1;
      doc
        .moveTo(60, doc.y)
        .lineTo(60 + contentWidth, doc.y)
        .lineWidth(1)
        .stroke(COLORS.accentBlue);
      doc.y += 6;
    }

    // ── Helper: sub-section title ──
    function subSectionTitle(title) {
      ensureSpace(20);
      doc.y += 2;
      doc
        .fontSize(9)
        .font("Times-Bold")
        .fillColor(COLORS.sectionHeader)
        .text(title, 60);
      doc.y += 3;
    }

    // ── Helper: body text ──
    function bodyText(text, opts = {}) {
      const { indent = 0, fontSize = 9, font = "Times-Roman", color = COLORS.bodyText } = opts;
      doc
        .fontSize(fontSize)
        .font(font)
        .fillColor(color)
        .text(text, 60 + indent, doc.y, { width: contentWidth - indent, lineGap: 2 });
      doc.y += 2;
    }

    // ══════════════════════════════════════════
    //  PAGE 1: COVER / DISCLAIMER / SUMMARY
    // ══════════════════════════════════════════

    // Title block
    doc.y = 100;
    doc
      .fontSize(22)
      .font("Times-Bold")
      .fillColor(COLORS.sectionHeader)
      .text("Medical Malpractice Merit Analysis", 60, doc.y, { width: contentWidth });

    doc.y += 4;
    doc
      .fontSize(11)
      .font("Times-Roman")
      .fillColor(COLORS.mutedText)
      .text(caseConfig.caseTitle, 60, doc.y, { width: contentWidth });

    doc.y += 4;
    doc
      .fontSize(9)
      .font("Times-Roman")
      .fillColor(COLORS.mutedText)
      .text(`Matter ID: ${caseConfig.matterId}  |  Date: ${reportDate}`, 60, doc.y);

    doc.y += 4;
    doc
      .moveTo(60, doc.y)
      .lineTo(60 + contentWidth, doc.y)
      .lineWidth(0.5)
      .stroke(COLORS.lightBorder);
    doc.y += 10;

    // Disclaimer box
    const disclaimerText =
      "IMPORTANT: This report identifies potential issues for attorney review. It does not constitute legal advice, " +
      "medical advice, or an expert medical opinion. All findings require independent verification by qualified " +
      "professionals. This document is prepared for attorney use in evaluating potential claims and is intended " +
      "as attorney work product.";

    const disclaimerY = doc.y;
    doc
      .save()
      .roundedRect(60, disclaimerY, contentWidth, 80, 4)
      .fill(COLORS.disclaimerBg);
    doc
      .roundedRect(60, disclaimerY, contentWidth, 80, 4)
      .lineWidth(0.75)
      .stroke(COLORS.disclaimerBorder);
    doc.restore();

    doc
      .fontSize(8)
      .font("Helvetica-Bold")
      .fillColor(COLORS.mutedText)
      .text("DISCLAIMER", 72, disclaimerY + 10, { width: contentWidth - 24 });
    doc
      .fontSize(9)
      .font("Times-Roman")
      .fillColor(COLORS.disclaimerText)
      .text(disclaimerText, 72, disclaimerY + 24, { width: contentWidth - 24, lineGap: 2 });

    doc.y = disclaimerY + 92;

    // Case summary
    sectionTitle("Case Summary");
    bodyText(caseConfig.caseSummary);

    // Negligence score box
    if (analysisData.negligenceScore !== null) {
      doc.y += 8;
      ensureSpace(70);
      const scoreY = doc.y;
      const scoreBoxWidth = contentWidth;

      doc
        .save()
        .roundedRect(60, scoreY, scoreBoxWidth, 56, 4)
        .fill(COLORS.scoreBoxBg);
      doc
        .roundedRect(60, scoreY, scoreBoxWidth, 56, 4)
        .lineWidth(0.75)
        .stroke(COLORS.scoreBoxBorder);
      doc.restore();

      // Score number
      const scoreColor =
        analysisData.negligenceScore >= 7
          ? COLORS.severityCritical
          : analysisData.negligenceScore >= 5
          ? COLORS.severityMajor
          : COLORS.severityMinor;

      doc
        .fontSize(28)
        .font("Helvetica-Bold")
        .fillColor(scoreColor)
        .text(`${analysisData.negligenceScore}/10`, 80, scoreY + 8, { continued: false });

      doc
        .fontSize(10)
        .font("Times-Bold")
        .fillColor(COLORS.sectionHeader)
        .text("Negligence Probability Score", 140, scoreY + 12);
      doc
        .fontSize(9)
        .font("Times-Roman")
        .fillColor(COLORS.mutedText)
        .text(
          analysisData.negligenceScore >= 7
            ? "High merit — strong case for the plaintiff"
            : analysisData.negligenceScore >= 5
            ? "Moderate merit — case warrants further investigation"
            : "Lower merit — significant defense arguments exist",
          140,
          scoreY + 28
        );

      doc.y = scoreY + 68;
    }

    // ══════════════════════════════════════════
    //  ISSUES IDENTIFIED
    // ══════════════════════════════════════════

    sectionTitle("Issues Identified");

    for (let i = 0; i < analysisData.issues.length; i++) {
      const issue = analysisData.issues[i];
      ensureSpace(80);

      // Issue header with number and severity badge on same line
      doc
        .fontSize(10)
        .font("Times-Bold")
        .fillColor(COLORS.sectionHeader);
      doc.text(`Issue ${i + 1}: ${issue.title}`, 60, doc.y, { continued: false });

      // Category + severity on one line
      doc.y += 2;
      if (issue.severity) {
        const badgeWidth = drawSeverityBadge(issue.severity, 60, doc.y);
        if (issue.category) {
          doc
            .fontSize(8)
            .font("Helvetica")
            .fillColor(COLORS.mutedText)
            .text(issue.category, 60 + badgeWidth + 8, doc.y + 3, { continued: false });
        }
        doc.y += 20;
      } else if (issue.category) {
        doc
          .fontSize(8)
          .font("Helvetica")
          .fillColor(COLORS.mutedText)
          .text(issue.category, 60, doc.y, { continued: false });
        doc.y += 4;
      }

      // Description
      if (issue.description) {
        subSectionTitle("Deviation from Standard of Care");
        bodyText(issue.description, { indent: 6 });
      }

      // Evidence
      if (issue.evidence) {
        ensureSpace(30);
        subSectionTitle("Evidence from Records");
        bodyText(issue.evidence, { indent: 6, color: COLORS.mutedText });
      }

      // Standard of care
      if (issue.standard) {
        ensureSpace(30);
        subSectionTitle("Standard of Care Reference");
        bodyText(issue.standard, { indent: 6, font: "Times-Italic" });
      }

      // Separator
      doc.y += 4;
      if (i < analysisData.issues.length - 1) {
        doc
          .moveTo(80, doc.y)
          .lineTo(60 + contentWidth - 20, doc.y)
          .lineWidth(0.25)
          .stroke(COLORS.lightBorder);
        doc.y += 6;
      }
    }

    // ══════════════════════════════════════════
    //  STRONGEST CLAIMS
    // ══════════════════════════════════════════

    if (analysisData.strongestClaims.length > 0) {
      sectionTitle("Strongest Claims");

      for (let i = 0; i < analysisData.strongestClaims.length; i++) {
        const claim = analysisData.strongestClaims[i];
        ensureSpace(40);
        doc
          .fontSize(9)
          .font("Times-Bold")
          .fillColor(COLORS.sectionHeader)
          .text(`${i + 1}. ${claim.title}`, 60, doc.y, { width: contentWidth });
        doc.y += 2;
        bodyText(claim.detail, { indent: 12 });
        doc.y += 3;
      }
    }

    // ══════════════════════════════════════════
    //  DEFENSE CONSIDERATIONS
    // ══════════════════════════════════════════

    if (analysisData.defenseArguments.length > 0) {
      sectionTitle("Defense Considerations");

      bodyText(
        "The following arguments are likely to be raised by the defense. Each is presented with a recommended rebuttal strategy.",
        { color: COLORS.mutedText, font: "Times-Italic" }
      );
      doc.y += 2;

      for (const da of analysisData.defenseArguments) {
        ensureSpace(40);
        doc
          .fontSize(9)
          .font("Times-Bold")
          .fillColor(COLORS.bodyText)
          .text("Defense: ", 60, doc.y, { continued: true })
          .font("Times-Roman")
          .text(da.argument, { width: contentWidth - 10 });
        doc.y += 1;
        if (da.rebuttal) {
          doc
            .fontSize(9)
            .font("Times-Bold")
            .fillColor(COLORS.accentBlue)
            .text("Rebuttal: ", 72, doc.y, { continued: true })
            .font("Times-Roman")
            .fillColor(COLORS.bodyText)
            .text(da.rebuttal, { width: contentWidth - 22 });
        }
        doc.y += 5;
      }
    }

    // ══════════════════════════════════════════
    //  EXPERT WITNESS RECOMMENDATIONS
    // ══════════════════════════════════════════

    if (analysisData.expertWitnesses.length > 0) {
      sectionTitle("Expert Witness Recommendations");

      for (const ew of analysisData.expertWitnesses) {
        ensureSpace(30);
        doc
          .fontSize(9)
          .font("Times-Bold")
          .fillColor(COLORS.sectionHeader)
          .text(ew.specialty, 60, doc.y, { width: contentWidth });
        doc.y += 1;
        bodyText(ew.purpose, { indent: 6, color: COLORS.mutedText });
        doc.y += 3;
      }
    }

    // ══════════════════════════════════════════
    //  SUGGESTED DEPOSITION QUESTIONS
    // ══════════════════════════════════════════

    if (analysisData.depositionQuestions.length > 0) {
      sectionTitle("Suggested Deposition Questions");

      bodyText(
        "The following questions are designed to establish the standard of care, the deviation, and the causal link between the deviation and the patient's harm.",
        { color: COLORS.mutedText, font: "Times-Italic" }
      );
      doc.y += 2;

      for (let i = 0; i < analysisData.depositionQuestions.length; i++) {
        ensureSpace(20);
        doc
          .fontSize(9)
          .font("Times-Roman")
          .fillColor(COLORS.bodyText)
          .text(`${i + 1}.  `, 60, doc.y, { continued: true })
          .font("Times-Italic")
          .text(`"${analysisData.depositionQuestions[i]}"`, { width: contentWidth - 20 });
        doc.y += 4;
      }
    }

    // ══════════════════════════════════════════
    //  RECOMMENDED NEXT STEPS
    // ══════════════════════════════════════════

    sectionTitle("Recommended Next Steps");

    const nextSteps = [
      "Retain expert witnesses in the specialties identified above for formal case review and opinion letters.",
      "Obtain complete medical records from all treating facilities, including nursing notes, monitoring strips, and ancillary documentation.",
      "Preserve all electronic health record audit trails and metadata, including access logs and amendment history.",
      "Commission a life care plan to quantify future medical needs and associated costs.",
      "Evaluate economic damages including lost wages, reduced earning capacity, and future medical expenses.",
      "Consider early mediation if liability is strong and damages are well-documented.",
      "Prepare a chronological timeline of events for use in deposition preparation and trial exhibits.",
    ];

    for (let i = 0; i < nextSteps.length; i++) {
      ensureSpace(18);
      doc
        .fontSize(9)
        .font("Times-Roman")
        .fillColor(COLORS.bodyText)
        .text(`${i + 1}.  ${nextSteps[i]}`, 60, doc.y, { width: contentWidth, lineGap: 1 });
      doc.y += 3;
    }

    // ══════════════════════════════════════════
    //  BOTTOM LINE / SUMMARY
    // ══════════════════════════════════════════

    if (analysisData.bottomLine.length > 0) {
      sectionTitle("Summary Opinions");

      for (const bl of analysisData.bottomLine) {
        ensureSpace(40);
        doc
          .fontSize(9)
          .font("Times-Bold")
          .fillColor(COLORS.sectionHeader)
          .text(bl.label, 60, doc.y, { width: contentWidth });
        doc.y += 2;
        bodyText(bl.text, { indent: 0 });
        doc.y += 4;
      }
    }

    // ══════════════════════════════════════════
    //  HEADERS & FOOTERS (applied to all pages)
    // ══════════════════════════════════════════

    const pages = doc.bufferedPageRange();
    for (let i = pages.start; i < pages.start + pages.count; i++) {
      doc.switchToPage(i);

      // Header
      doc.save();
      doc
        .rect(0, 0, pageWidth, 55)
        .fill(COLORS.headerBg);

      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor(COLORS.headerText)
        .text("MedMal Review Pro", 60, 14, { width: contentWidth });

      doc
        .fontSize(7)
        .font("Helvetica")
        .fillColor("#aaaaaa")
        .text("Confidential Attorney Work Product", 60, 28, { continued: false });

      // Right-aligned header info
      doc
        .fontSize(7)
        .font("Helvetica")
        .fillColor("#aaaaaa")
        .text(`Matter: ${caseConfig.matterId}`, 60, 14, { width: contentWidth, align: "right" })
        .text(reportDate, 60, 24, { width: contentWidth, align: "right" });

      // Header bottom line
      doc
        .moveTo(0, 55)
        .lineTo(pageWidth, 55)
        .lineWidth(0.5)
        .stroke(COLORS.accentBlue);

      doc.restore();

      // Footer
      doc.save();
      const footerY = doc.page.height - 45;

      doc
        .moveTo(60, footerY)
        .lineTo(pageWidth - 60, footerY)
        .lineWidth(0.25)
        .stroke(COLORS.lightBorder);

      doc
        .fontSize(7)
        .font("Helvetica")
        .fillColor(COLORS.footerText)
        .text(
          "Confidential -- Attorney Work Product -- Do Not Distribute",
          60,
          footerY + 8,
          { width: contentWidth, align: "center" }
        );

      doc
        .fontSize(7)
        .font("Helvetica")
        .fillColor(COLORS.footerText)
        .text(`Page ${i + 1} of ${pages.count}`, 60, footerY + 20, {
          width: contentWidth,
          align: "center",
        });

      doc.restore();
    }

    doc.end();

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
}

/* ─────────────────────────── main ─────────────────────────── */

async function main() {
  console.log("Generating sample reports...\n");

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const caseConfig of CASES) {
    const inputPath = caseConfig.inputFile;
    const outputPath = path.join(OUTPUT_DIR, caseConfig.outputFile);

    // Read analysis text
    if (!fs.existsSync(inputPath)) {
      console.error(`  SKIP: ${inputPath} not found`);
      continue;
    }

    const rawText = fs.readFileSync(inputPath, "utf-8");
    const analysisData = parseAnalysis(rawText);

    console.log(`  Parsing: ${inputPath}`);
    console.log(`    Issues found: ${analysisData.issues.length}`);
    console.log(`    Score: ${analysisData.negligenceScore}/10`);
    console.log(`    Expert witnesses: ${analysisData.expertWitnesses.length}`);
    console.log(`    Deposition questions: ${analysisData.depositionQuestions.length}`);

    // Generate PDF
    await generatePDF(caseConfig, analysisData, outputPath);

    const stats = fs.statSync(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`    Output: ${outputPath} (${sizeKB} KB)\n`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
