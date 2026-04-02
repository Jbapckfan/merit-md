// ── Merit-MD Analysis Engine ──
// Sends clinical text to LLM for malpractice merit assessment.
// Falls back to a demo report when no API key is configured.

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

const SYSTEM_PROMPT = `You are an experienced emergency medicine physician reviewing clinical records for potential medical malpractice. Analyze the following medical records and produce a structured merit assessment.

For each potential issue found, provide:
1. Category (missed diagnosis, delayed treatment, documentation gap, protocol violation, EMTALA issue)
2. Severity (critical, major, minor)
3. Description of the deviation from standard of care
4. Supporting evidence from the records
5. What SHOULD have been done

Then provide an overall assessment:
- Negligence Probability Score (1-10, where 10 = clear negligence)
- Summary of strongest claims
- Weaknesses in the case
- Recommended next steps for the attorney

Be thorough but honest. If the care was appropriate, say so clearly.

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "score": <number 1-10>,
  "summary": "<string>",
  "findings": [
    {
      "category": "<missed diagnosis|delayed treatment|documentation gap|protocol violation|EMTALA issue>",
      "severity": "<critical|major|minor>",
      "description": "<string>",
      "evidence": "<string>",
      "shouldHaveDone": "<string>"
    }
  ],
  "strengths": ["<string>"],
  "weaknesses": ["<string>"],
  "recommendations": ["<string>"]
}`;

export async function analyzeCase(
  caseSummary: string,
  clinicalText: string
): Promise<MeritReport> {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;

  if (!apiKey) {
    console.log("[analysis] No NVIDIA_NIM_API_KEY set — using demo report");
    return getDemoReport();
  }

  try {
    const userMessage = `## Case Summary\n${caseSummary}\n\n## Clinical Records\n${clinicalText.slice(0, 30000)}`;

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "nvidia/llama-3.1-nemotron-ultra-253b-v1",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[analysis] NIM API error:", response.status, errText);
      throw new Error(`NIM API returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from NIM API");
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
      "This is a DEMO report generated without AI analysis. In production with an API key configured, Merit-MD performs a thorough clinical review of the uploaded records. The following sample findings illustrate the type of analysis provided.",
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
