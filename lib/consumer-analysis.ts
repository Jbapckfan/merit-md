// ── MedMal Review Pro Consumer Analysis Engine ──
// Plain-language malpractice pre-screening for individual patients.
// Uses the same clinical knowledge base but outputs at a 6th-grade reading level.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getKnowledgeForText } from "./clinical-knowledge";
import { getMedLegalContext } from "./medical-legal-expert";

const execFileAsync = promisify(execFile);

export interface ConsumerFinding {
  issue: string;
  explanation: string;
  severity: "serious" | "moderate" | "minor";
}

export interface ConsumerReport {
  verdict: "potential_issues" | "unclear" | "care_appears_appropriate";
  verdictLabel: string;
  score: number;
  whatWeFound: ConsumerFinding[];
  whatThisMeans: string;
  whatYouShouldDo: string[];
  questionsForLawyer: string[];
  analysisMode: "ai" | "demo";
}

function buildConsumerSystemPrompt(description: string, clinicalText: string): string {
  const combined = `${description}\n${clinicalText}`;
  const knowledgeContext = getKnowledgeForText(combined);
  const medLegalContext = getMedLegalContext(combined);

  return `You are a board-certified emergency medicine physician helping a patient understand whether they may have received substandard medical care.

The patient is NOT a lawyer or medical professional. Write at a 6TH GRADE READING LEVEL. Be empathetic but honest. Use simple, everyday language.

Rules:
- Explain every medical term in parentheses, e.g. "troponin (a blood test that checks for heart damage)"
- Never use legal jargon like "standard of care" — say "what your doctor should have done"
- Be direct: if you don't think they have a case, say so kindly
- If you DO think there are issues, be clear but not inflammatory
- Always recommend they talk to a lawyer if there are any real concerns
- Generate specific, tailored questions they should ask an attorney

When assessing the case, also evaluate the four things a lawyer needs to prove (explain in plain language):
1. DUTY — Did you have a doctor-patient relationship? (Usually yes if you went to the ER and were seen.)
2. MISTAKE — Did your doctor do something wrong, or fail to do something they should have? This is the big question.
3. CAUSE — Did the mistake actually cause your injury or make things worse? (Not just "they made a mistake" but "the mistake hurt me.")
4. HARM — What harm did you suffer? (Medical bills, lost work, pain, ongoing problems, etc.)

Include a plain-language summary of whether all four elements appear to be present. If one is weak or missing, explain which one and why — this helps the patient understand their situation honestly before talking to a lawyer.

${knowledgeContext}
${medLegalContext}

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "verdict": "potential_issues" | "unclear" | "care_appears_appropriate",
  "verdictLabel": "<a short, clear headline like 'We Found Potential Issues' or 'The Care Appears Appropriate'>",
  "score": <number 1-10, where 10 = most likely negligence>,
  "whatWeFound": [
    {
      "issue": "<plain-language description of the problem>",
      "explanation": "<why this matters, explained simply>",
      "severity": "serious" | "moderate" | "minor"
    }
  ],
  "whatThisMeans": "<1-2 paragraph plain-language explanation of the overall picture>",
  "fourElements": {
    "duty": "<plain-language explanation — was there a doctor-patient relationship?>",
    "mistake": "<plain-language explanation — did the doctor do something wrong?>",
    "cause": "<plain-language explanation — did the mistake cause the harm?>",
    "harm": "<plain-language explanation — what harm was suffered?>",
    "allFourPresent": true | false,
    "weakestElement": "<which element is weakest and why, in plain language>"
  },
  "whatYouShouldDo": ["<actionable step 1>", "<actionable step 2>", ...],
  "questionsForLawyer": ["<specific question tailored to their case>", ...]
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

export async function analyzeConsumerCase(
  description: string,
  clinicalText: string,
  facility?: string,
  outcomeType?: string,
  incidentDate?: string
): Promise<ConsumerReport> {
  try {
    const systemPrompt = buildConsumerSystemPrompt(description, clinicalText);

    const contextParts: string[] = [];
    contextParts.push(`## What the Patient Told Us\n${description}`);
    if (facility) contextParts.push(`## Where They Were Treated\n${facility}`);
    if (outcomeType) contextParts.push(`## Outcome\n${outcomeType}`);
    if (incidentDate) contextParts.push(`## When It Happened\n${incidentDate}`);
    if (clinicalText) contextParts.push(`## Uploaded Medical Records\n${clinicalText.slice(0, 60000)}`);

    const userMessage = contextParts.join("\n\n");
    const content = await callClaude(systemPrompt, userMessage);

    if (!content) {
      throw new Error("Empty response from Claude CLI");
    }

    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonStr.trim());

    const validVerdicts = ["potential_issues", "unclear", "care_appears_appropriate"];
    const verdict = validVerdicts.includes(parsed.verdict) ? parsed.verdict : "unclear";

    return {
      verdict: verdict as ConsumerReport["verdict"],
      verdictLabel: parsed.verdictLabel || getDefaultVerdictLabel(verdict),
      score: Math.min(10, Math.max(1, Number(parsed.score) || 5)),
      whatWeFound: (parsed.whatWeFound || []).map((f: Record<string, string>) => ({
        issue: f.issue || "",
        explanation: f.explanation || "",
        severity: (["serious", "moderate", "minor"].includes(f.severity) ? f.severity : "moderate") as ConsumerFinding["severity"],
      })),
      whatThisMeans: parsed.whatThisMeans || "",
      whatYouShouldDo: parsed.whatYouShouldDo || [],
      questionsForLawyer: parsed.questionsForLawyer || [],
      analysisMode: "ai",
    };
  } catch (error) {
    console.error("[consumer-analysis] Failed to analyze with AI, falling back to demo:", error);
    return getDemoConsumerReport();
  }
}

function getDefaultVerdictLabel(verdict: string): string {
  switch (verdict) {
    case "potential_issues":
      return "We Found Potential Issues";
    case "care_appears_appropriate":
      return "The Care Appears Appropriate";
    default:
      return "More Information Needed";
  }
}

function getDemoConsumerReport(): ConsumerReport {
  return {
    verdict: "potential_issues",
    verdictLabel: "We Found Potential Issues",
    score: 7,
    whatWeFound: [
      {
        issue: "Your doctor should have run a second blood test to check for heart damage, but records show only one was done.",
        explanation: "When someone comes in with chest pain, doctors are supposed to check a blood marker called troponin (a test that shows if your heart muscle is being damaged) at least twice -- once when you arrive and again a few hours later. A single test can miss a heart attack that's just starting. This is a well-known rule that most emergency doctors follow.",
        severity: "serious",
      },
      {
        issue: "The discharge papers you received didn't include specific warning signs to watch for.",
        explanation: "When you leave the emergency room, your paperwork should list the exact symptoms that mean you need to come back right away. Your records show only generic instructions were given, without anything specific to your situation. This means you may not have known what to look out for after going home.",
        severity: "moderate",
      },
      {
        issue: "There was a long wait before a doctor saw you, even though you were marked as high priority.",
        explanation: "Your chart shows you were classified as needing quick attention (Priority Level 2), which usually means a doctor should see you within 10-15 minutes. But it took 47 minutes before anyone examined you. While wait times vary, this is longer than what guidelines recommend for someone with your symptoms.",
        severity: "minor",
      },
    ],
    whatThisMeans:
      "Based on what we found in your records, there are some real concerns about the care you received. The biggest issue is the missing second blood test -- this is something most emergency medicine experts would consider below the expected level of care. Combined with the incomplete discharge instructions, these findings suggest it would be worth talking to a malpractice attorney.\n\nThat said, this is a preliminary screening, not a legal opinion. An attorney and a medical expert would need to review your full records to give you a definitive answer.",
    whatYouShouldDo: [
      "Talk to a medical malpractice attorney -- many offer free initial consultations",
      "Gather all your medical records from the hospital visit (you have a legal right to these)",
      "Write down a detailed timeline of what happened while it's fresh in your memory",
      "Keep records of any ongoing medical treatments or expenses related to this incident",
      "Do not post about your case on social media",
    ],
    questionsForLawyer: [
      "Was the hospital required to run a second troponin test before sending me home?",
      "Does the 47-minute wait time before being seen qualify as a delay in treatment?",
      "Are the generic discharge instructions considered a breach of the standard of care?",
      "What is the statute of limitations for filing a malpractice claim in my state?",
      "Would you take this case on contingency (meaning I don't pay unless we win)?",
    ],
    analysisMode: "demo",
  };
}
