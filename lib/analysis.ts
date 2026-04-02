// ── MedMal Review Pro Analysis Engine ──
// Sends clinical text to Claude CLI for malpractice merit assessment.
// Falls back to a demo report when claude CLI is not available.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getKnowledgeForText } from "./clinical-knowledge";
import { getMedLegalContext } from "./medical-legal-expert";
import { detectStatesInText, getStateLawSummary } from "./state-law-engine";

const execFileAsync = promisify(execFile);

export interface Finding {
  category: string;
  severity: "critical" | "major" | "minor";
  description: string;
  evidence: string;
  shouldHaveDone: string;
}

export interface MeritReport {
  score: number;
  summary: string;
  findings: Finding[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  analysisMode: "ai" | "demo";
}

function buildSystemPrompt(clinicalText: string): string {
  const knowledgeContext = getKnowledgeForText(clinicalText);
  const medLegalContext = getMedLegalContext(clinicalText);

  // Detect state references and inject jurisdiction-specific law
  const detectedStates = detectStatesInText(clinicalText);
  const stateContext = detectedStates.length > 0
    ? "\n\n## JURISDICTION-SPECIFIC LAW\nThe following state-specific medical malpractice laws are relevant to this case. Apply these when assessing damages, statute of limitations, expert requirements, and procedural hurdles.\n\n" +
      detectedStates.map((s) => getStateLawSummary(s.stateCode)).join("\n\n---\n\n")
    : "";

  return `You are an experienced emergency medicine physician AND medical-legal expert reviewing clinical records for potential medical malpractice. You have deep expertise in both the clinical standard of care and the litigation framework. Analyze the following medical records and produce a structured merit assessment.

For each potential issue found, provide:
1. Category (missed diagnosis, delayed treatment, documentation gap, protocol violation, EMTALA issue)
2. Severity (critical, major, minor)
3. Description of the deviation from standard of care
4. Supporting evidence from the records
5. What SHOULD have been done

Then provide an overall assessment:
- Issue Density Rating (1-10, where 10 = highest density of identified issues across severity levels)
- Summary of most significant identified issues
- Weaknesses in the case
- Recommended next steps for the attorney

Be thorough but honest. If the care was appropriate, say so clearly.

After clinical analysis, also assess:
- Which elements of malpractice (duty, breach, causation, damages) are supported by the evidence
- Estimated damages severity on a 1-9 scale (1 = temporary minor injury, 9 = death)
- Whether a Certificate of Merit would likely be issued based on these findings
- Key defense arguments the opposing side would raise
- Suggested deposition questions for the treating physician
${knowledgeContext}
${medLegalContext}
${stateContext}

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "score": <number 1-10>,
  "summary": "<string>",
  "findings": [
    {
      "category": "<missed diagnosis|delayed treatment|documentation gap|protocol violation|EMTALA issue|medication error|procedural complication>",
      "severity": "<critical|major|minor>",
      "description": "<string>",
      "evidence": "<string>",
      "shouldHaveDone": "<string>"
    }
  ],
  "strengths": ["<string>"],
  "weaknesses": ["<string>"],
  "recommendations": ["<string>"],
  "legalAssessment": {
    "dutyEstablished": "<yes|no|unclear> — brief explanation",
    "breachIdentified": "<yes|no|unclear> — brief explanation",
    "causationSupported": "<yes|no|unclear> — brief explanation",
    "damagesSeverity": <number 1-9>,
    "damagesDescription": "<string>",
    "certificateOfMerit": "<likely|unlikely|borderline> — brief explanation",
    "keyDefenseArguments": ["<string>"],
    "depositionQuestions": ["<string>"]
  }
}`;
}

async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const { stdout } = await execFileAsync("claude", [
    "-p", userPrompt,
    "--system-prompt", systemPrompt,
    "--output-format", "text",
    "--max-turns", "1",
  ], {
    timeout: 120_000,
    maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large responses
  });
  return stdout.trim();
}

export async function analyzeCase(
  caseSummary: string,
  clinicalText: string
): Promise<MeritReport> {
  try {
    const systemPrompt = buildSystemPrompt(clinicalText);
    const userMessage = `## Case Summary\n${caseSummary}\n\n## Clinical Records\n${clinicalText.slice(0, 60000)}`;

    const content = await callClaude(systemPrompt, userMessage);

    if (!content) {
      throw new Error("Empty response from Claude CLI");
    }

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonStr.trim());

    return {
      score: Math.min(10, Math.max(1, Number(parsed.score) || 5)),
      summary: parsed.summary || "Analysis complete.",
      findings: (parsed.findings || []).map((f: Record<string, string>) => ({
        category: f.category || "documentation gap",
        severity: (["critical", "major", "minor"].includes(f.severity) ? f.severity : "major") as Finding["severity"],
        description: f.description || "",
        evidence: f.evidence || "",
        shouldHaveDone: f.shouldHaveDone || "",
      })),
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      recommendations: parsed.recommendations || [],
      analysisMode: "ai",
    };
  } catch (error) {
    console.error("[analysis] Failed to analyze with AI, falling back to demo:", error);
    return getDemoReport();
  }
}

function getDemoReport(): MeritReport {
  return {
    score: 7,
    summary:
      "This is a DEMO report generated without AI analysis. In production with Claude CLI available, MedMal Review Pro performs a thorough clinical review of the uploaded records. The following sample findings illustrate the type of analysis provided.",
    findings: [
      {
        category: "missed diagnosis",
        severity: "critical",
        description:
          "Serial troponin measurements were not obtained despite presenting complaint of chest pain with radiation. Single troponin at presentation is insufficient to rule out acute coronary syndrome per ACC/AHA guidelines.",
        evidence:
          "Initial troponin I: 0.04 ng/mL (borderline). No repeat troponin found in records at 3 or 6 hour intervals.",
        shouldHaveDone:
          "Serial troponins at 0, 3, and 6 hours per ACC/AHA chest pain evaluation protocol. With borderline initial value, observation admission was indicated.",
      },
      {
        category: "documentation gap",
        severity: "major",
        description:
          "Discharge instructions lack specific return precautions related to the presenting complaint. Generic discharge template used without customization.",
        evidence:
          "Discharge paperwork shows pre-printed return instructions with no chest-pain-specific warnings documented.",
        shouldHaveDone:
          "Specific return precautions including: worsening chest pain, shortness of breath, diaphoresis, syncope. Documentation of patient verbalization of understanding.",
      },
      {
        category: "protocol violation",
        severity: "major",
        description:
          "Sepsis screening protocol not activated despite two SIRS criteria being met (temp 38.4C, HR 112). No lactate ordered.",
        evidence:
          "Vital signs at 14:32 show T 38.4, HR 112, RR 20, BP 98/62. No sepsis bundle documentation found.",
        shouldHaveDone:
          "SEP-1 bundle initiation within 3 hours: blood cultures x2, lactate level, broad-spectrum antibiotics, 30 mL/kg crystalloid if lactate >= 4 or hypotension present.",
      },
      {
        category: "delayed treatment",
        severity: "minor",
        description:
          "Time from door to physician evaluation was 47 minutes for a patient triaged as ESI Level 2.",
        evidence:
          "Triage time: 09:12. First physician contact documented at 09:59.",
        shouldHaveDone:
          "ESI Level 2 patients should be evaluated within 10-15 minutes of arrival per departmental standards.",
      },
    ],
    strengths: [
      "Multiple deviations from standard of care identified across different categories",
      "Critical finding regarding serial troponins provides strong negligence argument",
      "Sepsis screening failure is well-documented in current literature as below standard",
      "Documentation gaps support pattern of inadequate care",
    ],
    weaknesses: [
      "This is a demo report — actual strengths depend on uploaded records",
      "Patient outcome and causation analysis requires full record review",
      "Damages assessment not yet performed",
    ],
    recommendations: [
      "Obtain complete medical records including nursing notes, lab results, and imaging",
      "Engage a board-certified emergency medicine expert for formal opinion",
      "Request hospital sepsis screening and chest pain protocols for comparison",
      "Evaluate statute of limitations timeline and preserve all evidence",
      "Consider consulting cardiology expert regarding troponin interpretation",
    ],
    analysisMode: "demo",
  };
}
