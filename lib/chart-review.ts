// ── ChartReview Pro Analysis Engine ──
// Pre-sign chart review for emergency physicians.
// Uses clinical knowledge base + medical-legal expert knowledge to provide
// comprehensive documentation and risk review before chart signing.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getKnowledgeForText } from "./clinical-knowledge";
import { getMedLegalContext } from "./medical-legal-expert";

const execFileAsync = promisify(execFile);

// ── Types ──

export interface RiskFlag {
  issue: string;
  whyItMatters: string;
  suggestedFix: string;
  severity: "critical" | "major" | "minor";
}

export interface DocumentationItem {
  item: string;
  present: boolean;
  note: string;
}

export interface ChartReviewResult {
  overallGrade: string;
  overallScore: number;
  gradeSummary: string;
  documentationCompleteness: {
    score: number;
    items: DocumentationItem[];
    summary: string;
  };
  riskFlags: RiskFlag[];
  standardOfCare: {
    met: boolean;
    details: string;
    gaps: string[];
  };
  dispositionSafety: {
    safe: boolean;
    concerns: string[];
    summary: string;
  };
  suggestedAdditions: string[];
  cognitiveBiases: {
    detected: string[];
    suggestions: string[];
  };
  billingAlignment: {
    supported: boolean;
    currentLevel: string;
    supportedLevel: string;
    notes: string;
  };
  analysisMode: "ai" | "demo";
}

function buildChartReviewPrompt(chartText: string, chiefComplaint?: string): string {
  const knowledgeContext = getKnowledgeForText(
    chiefComplaint ? `${chiefComplaint}\n${chartText}` : chartText
  );
  const medLegalContext = getMedLegalContext(chartText);

  return `You are a panel of experts reviewing an emergency physician's chart note before they sign it. Your panel includes: a risk management officer, a hospital defense attorney, an ER physician specialist, and a medical documentation expert. Review the following chart note and provide actionable feedback to reduce medicolegal risk. Be specific — tell the physician exactly what to add, change, or remove. Format as structured sections.

Your review should cover:

1. DOCUMENTATION COMPLETENESS
- Is the MDM (medical decision making) thorough enough?
- Are pertinent negatives documented?
- Is the ROS (review of systems) consistent with the chief complaint?
- Are all critical actions documented with timing?
- Is the physical exam targeted and complete for this complaint?

2. STANDARD-OF-CARE ALIGNMENT
- Are you meeting guidelines for this chief complaint?
- Are appropriate workup elements ordered and resulted?
- Is risk stratification documented (HEART score, Wells, PERC, etc.)?

3. DISPOSITION SAFETY
- If this is a discharge, is it defensible?
- Are there any high-risk features being discharged?
- Would a peer reviewer question this disposition?

4. MEDICOLEGAL RISK FLAGS
- Identify phrases that hurt in court (e.g., "patient is a poor historian", "normal exam" without specifics)
- Missing defensive documentation
- Time gaps that create vulnerability
- Copy-forward errors or templated language that doesn't match the encounter

5. RETURN PRECAUTION QUALITY
- Are return precautions specific to this complaint?
- Are they legally defensible?
- Would a jury understand that the patient was warned?

6. COGNITIVE BIAS DETECTION
- Signs of anchoring (locked onto first diagnosis)
- Premature closure (stopped workup too early)
- Availability bias (recent similar case influencing judgment)
- Diagnosis momentum (accepting prior provider's diagnosis without re-evaluation)

7. BILLING/CODING ALIGNMENT
- Does the documented MDM support the billing level?
- Are the number of data points, complexity, and risk level documented?

${knowledgeContext}
${medLegalContext}

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "overallGrade": "<A|B|C|D|F>",
  "overallScore": <number 0-100>,
  "gradeSummary": "<1-2 sentence summary of the chart quality>",
  "documentationCompleteness": {
    "score": <number 0-100>,
    "items": [
      {
        "item": "<documentation element>",
        "present": <true|false>,
        "note": "<brief note about quality or what's missing>"
      }
    ],
    "summary": "<overall documentation assessment>"
  },
  "riskFlags": [
    {
      "issue": "<what's wrong or missing>",
      "whyItMatters": "<medicolegal risk explanation>",
      "suggestedFix": "<specific text or action to add>",
      "severity": "<critical|major|minor>"
    }
  ],
  "standardOfCare": {
    "met": <true|false>,
    "details": "<explanation of standard-of-care alignment>",
    "gaps": ["<specific gap 1>", "<specific gap 2>"]
  },
  "dispositionSafety": {
    "safe": <true|false>,
    "concerns": ["<concern 1>", "<concern 2>"],
    "summary": "<disposition safety assessment>"
  },
  "suggestedAdditions": [
    "<specific text the physician should add to their note>"
  ],
  "cognitiveBiases": {
    "detected": ["<bias 1 with explanation>"],
    "suggestions": ["<suggestion to mitigate bias>"]
  },
  "billingAlignment": {
    "supported": <true|false>,
    "currentLevel": "<apparent billing level>",
    "supportedLevel": "<level the documentation actually supports>",
    "notes": "<explanation>"
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
    maxBuffer: 10 * 1024 * 1024,
  });
  return stdout.trim();
}

function gradeToLetter(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export async function reviewChart(
  chartText: string,
  chiefComplaint?: string,
  facilityType?: string
): Promise<ChartReviewResult> {
  try {
    const systemPrompt = buildChartReviewPrompt(chartText, chiefComplaint);

    const contextParts: string[] = [];
    contextParts.push(`## Chart Note\n${chartText.slice(0, 60000)}`);
    if (chiefComplaint) contextParts.push(`## Chief Complaint\n${chiefComplaint}`);
    if (facilityType) contextParts.push(`## Facility Type\n${facilityType}`);

    const userMessage = contextParts.join("\n\n");
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

    const overallScore = Math.min(100, Math.max(0, Number(parsed.overallScore) || 50));

    return {
      overallGrade: parsed.overallGrade || gradeToLetter(overallScore),
      overallScore,
      gradeSummary: parsed.gradeSummary || "Review complete.",
      documentationCompleteness: {
        score: Math.min(100, Math.max(0, Number(parsed.documentationCompleteness?.score) || 50)),
        items: (parsed.documentationCompleteness?.items || []).map((item: Record<string, unknown>) => ({
          item: String(item.item || ""),
          present: Boolean(item.present),
          note: String(item.note || ""),
        })),
        summary: parsed.documentationCompleteness?.summary || "",
      },
      riskFlags: (parsed.riskFlags || []).map((f: Record<string, string>) => ({
        issue: f.issue || "",
        whyItMatters: f.whyItMatters || "",
        suggestedFix: f.suggestedFix || "",
        severity: (["critical", "major", "minor"].includes(f.severity) ? f.severity : "major") as RiskFlag["severity"],
      })),
      standardOfCare: {
        met: Boolean(parsed.standardOfCare?.met),
        details: parsed.standardOfCare?.details || "",
        gaps: parsed.standardOfCare?.gaps || [],
      },
      dispositionSafety: {
        safe: Boolean(parsed.dispositionSafety?.safe),
        concerns: parsed.dispositionSafety?.concerns || [],
        summary: parsed.dispositionSafety?.summary || "",
      },
      suggestedAdditions: parsed.suggestedAdditions || [],
      cognitiveBiases: {
        detected: parsed.cognitiveBiases?.detected || [],
        suggestions: parsed.cognitiveBiases?.suggestions || [],
      },
      billingAlignment: {
        supported: Boolean(parsed.billingAlignment?.supported),
        currentLevel: parsed.billingAlignment?.currentLevel || "",
        supportedLevel: parsed.billingAlignment?.supportedLevel || "",
        notes: parsed.billingAlignment?.notes || "",
      },
      analysisMode: "ai",
    };
  } catch (error) {
    console.error("[chart-review] Failed to analyze with AI, falling back to demo:", error);
    return getDemoChartReview();
  }
}

function getDemoChartReview(): ChartReviewResult {
  return {
    overallGrade: "C",
    overallScore: 68,
    gradeSummary: "This is a DEMO review generated without AI analysis. In production with Claude CLI available, ChartReview Pro performs a comprehensive pre-sign analysis. The following sample findings illustrate the type of feedback provided.",
    documentationCompleteness: {
      score: 65,
      items: [
        { item: "Chief Complaint", present: true, note: "Documented but could be more specific" },
        { item: "HPI (History of Present Illness)", present: true, note: "Missing onset timing and associated symptoms" },
        { item: "Review of Systems", present: true, note: "Only 2 systems reviewed — consider expanding for this complaint" },
        { item: "Physical Exam", present: true, note: "Cardiac and pulmonary documented, missing abdominal and neuro" },
        { item: "MDM (Medical Decision Making)", present: false, note: "No explicit MDM section — differential diagnosis not documented" },
        { item: "Risk Stratification Score", present: false, note: "No HEART score or other risk tool documented" },
        { item: "Pertinent Negatives", present: false, note: "Critical gap — no pertinent negatives documented for chest pain" },
        { item: "Return Precautions", present: true, note: "Generic template — not complaint-specific" },
      ],
      summary: "Documentation has significant gaps that create medicolegal vulnerability. Missing MDM and pertinent negatives are the most critical deficiencies.",
    },
    riskFlags: [
      {
        issue: "No pertinent negatives documented for chest pain workup",
        whyItMatters: "In chest pain litigation, plaintiff attorneys focus on what wasn't documented. 'If it wasn't documented, it wasn't done.' Pertinent negatives prove you considered and ruled out dangerous conditions.",
        suggestedFix: "Add: 'Pertinent negatives: No diaphoresis, no radiation to jaw/arm, no exertional component, no prior cardiac history, no family history of premature CAD, no cocaine use, no recent immobilization.'",
        severity: "critical",
      },
      {
        issue: "Phrase 'patient appears well' without objective findings",
        whyItMatters: "Subjective appearance assessments are demolished in court. A patient can 'appear well' and be having an MI. Defense needs objective data points.",
        suggestedFix: "Replace with specific vitals and exam findings: 'Patient alert, oriented, in no acute distress. VS stable with HR 78, BP 132/84, SpO2 99% RA. Cardiac exam: RRR, no murmurs/gallops.'",
        severity: "major",
      },
      {
        issue: "No HEART score documented for chest pain evaluation",
        whyItMatters: "Risk stratification tools are the standard of care for chest pain evaluation. Without a documented score, you cannot defend your disposition decision if the patient bounces back with an MI.",
        suggestedFix: "Add: 'HEART score calculated: H(istory)=1, E(CG)=0, A(ge)=1, R(isk factors)=1, T(roponin)=0. Total=3 (low risk). Per HEART pathway, safe for discharge with outpatient follow-up.'",
        severity: "critical",
      },
      {
        issue: "Discharge instructions are generic template",
        whyItMatters: "In court, generic discharge instructions suggest the physician did not tailor care to this patient. Specific return precautions demonstrate informed shared decision-making.",
        suggestedFix: "Add specific return precautions: 'Return immediately for: worsening or recurring chest pain, shortness of breath, dizziness/lightheadedness, sweating with chest discomfort, arm/jaw pain, or any new symptoms that concern you. Follow up with your primary care physician within 48 hours for repeat troponin and stress test consideration.'",
        severity: "major",
      },
    ],
    standardOfCare: {
      met: false,
      details: "The chart does not demonstrate adherence to ACC/AHA chest pain evaluation guidelines. Missing risk stratification and incomplete workup documentation create vulnerability.",
      gaps: [
        "No HEART score or equivalent risk stratification tool documented",
        "Serial troponin plan not documented (or reason serial not needed)",
        "EKG interpretation lacks specific findings — 'normal EKG' is insufficient",
        "No documentation of shared decision-making regarding disposition",
      ],
    },
    dispositionSafety: {
      safe: false,
      concerns: [
        "Low-risk classification not supported by documented risk stratification",
        "No clear follow-up plan with timeline",
        "Return precautions are generic, not complaint-specific",
        "No documentation of patient understanding of discharge plan",
      ],
      summary: "Discharge may be clinically appropriate, but the documentation does not support a defensible disposition. If this patient returns with an MI, the chart as written will be difficult to defend.",
    },
    suggestedAdditions: [
      "HEART score: H=1, E=0, A=1, R=1, T=0. Total=3 (low risk). Discussed with patient — low risk for MACE at 30 days per HEART pathway.",
      "Pertinent negatives: No diaphoresis, no radiation, no exertional component, no prior cardiac history, no family history of premature CAD.",
      "EKG interpretation: Normal sinus rhythm, rate 76, normal axis, no ST changes, no T-wave inversions, no Q waves. Compared to prior if available.",
      "Troponin 0.01 at [time]. Discussed serial troponin option — patient prefers outpatient follow-up given low HEART score. Shared decision-making documented.",
      "Specific return precautions provided and patient verbalized understanding: Return for worsening chest pain, SOB, diaphoresis, arm/jaw pain, syncope.",
      "Follow-up plan: PCP within 48 hours for consideration of stress testing. Patient agrees to plan.",
    ],
    cognitiveBiases: {
      detected: [
        "Possible anchoring on 'musculoskeletal chest pain' — the note jumps to this diagnosis without documenting how cardiac causes were excluded",
        "Possible premature closure — limited differential documented despite chest pain being a high-risk chief complaint",
      ],
      suggestions: [
        "Document your differential explicitly: 'Differential includes ACS, PE, aortic dissection, pneumothorax, pericarditis, GERD, MSK. ACS ruled out by [reasoning]. PE low probability by [reasoning].'",
        "Include a brief statement of why you are confident in your diagnosis: 'Most consistent with MSK etiology given reproducible pain on palpation, negative cardiac workup, and low HEART score.'",
      ],
    },
    billingAlignment: {
      supported: false,
      currentLevel: "Level 4 (99284)",
      supportedLevel: "Level 3 (99283)",
      notes: "The documented MDM complexity does not support a Level 4 charge. To justify Level 4, document moderate complexity decision-making: multiple diagnoses considered, moderate data reviewed (labs, imaging, EKG), and moderate risk of morbidity. Currently missing explicit MDM narrative.",
    },
    analysisMode: "demo",
  };
}
