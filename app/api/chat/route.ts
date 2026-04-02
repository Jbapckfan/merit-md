// ── Merit-MD Chat API ──
// POST /api/chat — streaming Q&A about a case using Claude CLI

import { NextRequest } from "next/server";
import { spawn } from "node:child_process";
import { getSession } from "@/lib/auth";
import {
  getCaseById,
  getUploadsByCase,
  getMessagesByCase,
  createCaseMessage,
} from "@/lib/db";
import { getKnowledgeForText, buildKnowledgeContext, detectCategories, CLINICAL_KNOWLEDGE } from "@/lib/clinical-knowledge";

interface ChatRequestBody {
  caseId: string;
  message: string;
}

function buildChatSystemPrompt(
  reportJson: string,
  clinicalText: string,
  caseSummary: string,
): string {
  // Get ALL knowledge categories for the chat context (full knowledge base)
  const detectedCategories = detectCategories(clinicalText + " " + caseSummary);
  const knowledgeContext = buildKnowledgeContext(detectedCategories);

  // Also include a summary of ALL available categories for broader questions
  const allCategories = Object.keys(CLINICAL_KNOWLEDGE.standardsOfCare)
    .map((k) => k.replace(/([A-Z])/g, " $1").toLowerCase().trim())
    .join(", ");

  return `You are an expert medical-legal consultant — a board-certified emergency medicine physician with extensive experience as both a plaintiff and defense expert witness in medical malpractice cases.

You are helping an attorney understand a specific case that has already been analyzed. Below is the full context:

## CASE SUMMARY
${caseSummary}

## ANALYSIS REPORT
${reportJson}

## CLINICAL RECORDS (excerpted)
${clinicalText.slice(0, 40000)}

${knowledgeContext}

## AVAILABLE CLINICAL DOMAINS
You have deep knowledge of standards of care for: ${allCategories}.
You also have expertise in EMTALA requirements, documentation standards, and defense-side analysis frameworks.

## YOUR ROLE
- Answer the attorney's follow-up questions about this case with clinical precision
- Provide specific, actionable guidance grounded in evidence-based medicine and case law
- When discussing what an expert witness might say, distinguish between plaintiff and defense perspectives
- Cite specific guidelines, studies, and clinical policies where relevant
- If asked about deposition questions, provide specific, pointed questions with the clinical reasoning behind each
- If asked about additional records to request, explain WHY each record matters for the case
- Be honest about weaknesses in the case — attorneys need accurate assessments, not cheerleading
- Use plain language when explaining medical concepts, but include proper medical terminology

Always maintain the perspective of a physician reviewing for legal merit. Do not provide medical advice for patient care.`;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { caseId, message } = body;

  if (!caseId || !message) {
    return new Response(JSON.stringify({ error: "caseId and message are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Verify case ownership
  const caseData = getCaseById(caseId);
  if (!caseData) {
    return new Response(JSON.stringify({ error: "Case not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (caseData.user_id !== session.userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (caseData.status !== "complete" || !caseData.report_json) {
    return new Response(JSON.stringify({ error: "Case analysis not complete" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get uploads for clinical text
  const uploads = getUploadsByCase(caseId);
  const clinicalText = uploads
    .filter((u) => u.extracted_text)
    .map((u) => `--- ${u.filename} ---\n${u.extracted_text}`)
    .join("\n\n");

  // Build conversation history
  const history = getMessagesByCase(caseId);
  const conversationHistory = history
    .map((m) => `${m.role === "user" ? "Attorney" : "Consultant"}: ${m.content}`)
    .join("\n\n");

  // Save user message
  createCaseMessage(caseId, "user", message);

  // Build prompts
  const systemPrompt = buildChatSystemPrompt(
    caseData.report_json,
    clinicalText,
    caseData.case_summary,
  );

  let userPrompt = message;
  if (conversationHistory) {
    userPrompt = `## Previous Conversation\n${conversationHistory}\n\n## Current Question\n${message}`;
  }

  // Spawn claude CLI for streaming
  const claude = spawn("claude", [
    "-p", userPrompt,
    "--system-prompt", systemPrompt,
    "--output-format", "stream-json",
    "--max-turns", "1",
  ], {
    timeout: 120_000,
  });

  // Stream the response
  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    start(controller) {
      claude.stdout.on("data", (data: Buffer) => {
        const text = data.toString();
        // stream-json outputs one JSON object per line
        const lines = text.split("\n").filter((l: string) => l.trim());
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            // Claude stream-json format: { type: "content_block_delta", delta: { text: "..." } }
            // or: { type: "result", result: "..." }
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              fullResponse += parsed.delta.text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`));
            } else if (parsed.type === "result" && typeof parsed.result === "string") {
              // Final result — if we haven't captured text from deltas, use this
              if (!fullResponse) {
                fullResponse = parsed.result;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: parsed.result })}\n\n`));
              }
            }
          } catch {
            // Not valid JSON — might be partial text output, treat as raw text
            if (line.trim() && !fullResponse) {
              fullResponse += line;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: line })}\n\n`));
            }
          }
        }
      });

      claude.stderr.on("data", (data: Buffer) => {
        console.error("[chat] Claude CLI stderr:", data.toString());
      });

      claude.on("close", (code: number | null) => {
        if (code !== 0 && !fullResponse) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Analysis failed. Please try again." })}\n\n`)
          );
        }
        // Save assistant response
        if (fullResponse) {
          createCaseMessage(caseId, "assistant", fullResponse);
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      });

      claude.on("error", (err: Error) => {
        console.error("[chat] Claude CLI spawn error:", err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "Failed to start analysis. Is Claude CLI available?" })}\n\n`)
        );
        controller.close();
      });
    },
    cancel() {
      claude.kill("SIGTERM");
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// GET /api/chat?caseId=<id> — get chat history for a case
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId");
  if (!caseId) {
    return new Response(JSON.stringify({ error: "caseId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const caseData = getCaseById(caseId);
  if (!caseData) {
    return new Response(JSON.stringify({ error: "Case not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (caseData.user_id !== session.userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = getMessagesByCase(caseId);
  return new Response(JSON.stringify({ messages }), {
    headers: { "Content-Type": "application/json" },
  });
}
