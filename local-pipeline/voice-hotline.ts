#!/usr/bin/env npx tsx
// ── MedMal Review — Voice Intake Hotline ──
// Twilio-based voice hotline that walks callers through intake questions,
// transcribes responses via Whisper, and saves to the intake database.
//
// Runs on Mac Mini at port 17500.
// Twilio webhook: POST /voice/incoming
//
// Usage: npx tsx local-pipeline/voice-hotline.ts

import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { writeFile, readFile, mkdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";

// ── Config ──

const PORT = Number(process.env.HOTLINE_PORT || 17500);
const BASE_URL = process.env.HOTLINE_BASE_URL || `http://localhost:${PORT}`;
const VOICEBOX_URL = process.env.VOICEBOX_URL || "http://localhost:17493";
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";

const TMP_DIR = join(process.env.HOME || "/tmp", ".merit-md", "hotline-audio");
const HAS_TWILIO = !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN);

// ── In-memory session store ──

interface CallSession {
  callSid: string;
  callerNumber: string;
  responses: Record<string, string>;
  audioFiles: string[];
  startedAt: number;
}

const sessions = new Map<string, CallSession>();

// ── Intake questions ──

const QUESTIONS: { key: string; text: string }[] = [
  {
    key: "state",
    text: "First, what state did your medical treatment take place in?",
  },
  {
    key: "when",
    text: "And approximately when did this happen — even a rough month and year is fine.",
  },
  {
    key: "facility",
    text: "What type of facility were you treated at? For example, an emergency room, a hospital, a surgical center, or a doctor's office.",
  },
  {
    key: "description",
    text: "Can you tell me briefly what happened? What went wrong with your care?",
  },
  {
    key: "outcome",
    text: "What has been the outcome so far? Are you still dealing with health issues from this?",
  },
  {
    key: "contact",
    text: "Last question — what is your first name and the best way to reach you? An email address or phone number works.",
  },
];

const GREETING =
  "Thank you for calling MedMal Review. I'm here to help you understand your options. I'm going to ask you a few questions about your experience. This call is confidential and does not create an attorney-client relationship. Let's start.";

function buildConfirmation(responses: Record<string, string>): string {
  const name = extractName(responses.contact || "");
  const parts: string[] = [];

  if (responses.state) parts.push(`treatment in ${responses.state}`);
  if (responses.when) parts.push(`around ${responses.when}`);
  if (responses.facility) parts.push(`at a ${responses.facility}`);
  if (responses.description) parts.push(`regarding ${responses.description}`);

  const summary = parts.length > 0 ? parts.join(", ") : "your medical experience";
  const nameGreeting = name ? `Thank you, ${name}.` : "Thank you.";

  return `${nameGreeting} Let me make sure I have this right. You're telling us about ${summary}. If an attorney in our network is interested in reviewing your situation, they will reach out within five business days. You can also visit our website at medmalreview.com for more information. Thank you for calling.`;
}

function extractName(contactInfo: string): string {
  // Try to pull a first name from the contact response
  const words = contactInfo.trim().split(/\s+/);
  if (words.length > 0 && words[0].length > 1) {
    // Capitalize first letter
    const name = words[0];
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  return "";
}

// ── Audio generation via Voicebox TTS ──

const audioCache = new Map<string, { path: string; buffer: Buffer }>();

async function generateAudio(text: string, id?: string): Promise<string> {
  const audioId = id || randomUUID();
  const filename = `${audioId}.wav`;
  const filepath = join(TMP_DIR, filename);

  try {
    const res = await fetch(`${VOICEBOX_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice: "tars",
        format: "wav",
      }),
    });

    if (!res.ok) {
      throw new Error(`Voicebox returned ${res.status}: ${await res.text()}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    await mkdir(TMP_DIR, { recursive: true });
    await writeFile(filepath, buffer);

    audioCache.set(audioId, { path: filepath, buffer });
    console.log(`[tts] Generated audio: ${filename} (${buffer.length} bytes)`);

    return audioId;
  } catch (err) {
    console.error(`[tts] Voicebox error, falling back to Twilio <Say>:`, err);
    return ""; // Empty string signals to use Twilio's built-in TTS
  }
}

// ── Whisper transcription ──

async function transcribeAudio(recordingUrl: string): Promise<string> {
  try {
    // Download recording from Twilio
    const url = recordingUrl.endsWith(".wav")
      ? recordingUrl
      : `${recordingUrl}.wav`;

    // Twilio requires auth for recording downloads
    const authHeader = HAS_TWILIO
      ? `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`
      : "";

    const res = await fetch(url, {
      headers: authHeader ? { Authorization: authHeader } : {},
    });

    if (!res.ok) {
      throw new Error(`Failed to download recording: ${res.status}`);
    }

    const audioBuffer = Buffer.from(await res.arrayBuffer());
    const tmpFile = join(TMP_DIR, `recording-${randomUUID()}.wav`);
    await mkdir(TMP_DIR, { recursive: true });
    await writeFile(tmpFile, audioBuffer);

    // Run Whisper CLI
    const result = execSync(
      `whisper "${tmpFile}" --model base --output_format txt --output_dir "${TMP_DIR}" 2>/dev/null`,
      { encoding: "utf-8", timeout: 30_000 }
    );

    // Read the transcription output
    const txtFile = tmpFile.replace(".wav", ".txt");
    let transcript: string;
    try {
      transcript = (await readFile(txtFile, "utf-8")).trim();
      // Clean up temp files
      await unlink(tmpFile).catch(() => {});
      await unlink(txtFile).catch(() => {});
    } catch {
      // If no output file, try to parse stdout
      transcript = result.trim();
    }

    console.log(`[whisper] Transcribed: "${transcript.slice(0, 80)}..."`);
    return transcript || "(no speech detected)";
  } catch (err) {
    console.error("[whisper] Transcription error:", err);
    return "(transcription failed)";
  }
}

// ── TwiML helpers ──

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function twimlSay(text: string, audioId?: string): string {
  if (audioId) {
    return `<Play>${escapeXml(BASE_URL)}/audio/${escapeXml(audioId)}</Play>`;
  }
  // Fallback: use Twilio's built-in TTS
  return `<Say voice="Polly.Joanna" language="en-US">${escapeXml(text)}</Say>`;
}

function twimlGatherWithSpeech(text: string, audioId: string, nextUrl: string): string {
  const playOrSay = audioId
    ? `<Play>${escapeXml(BASE_URL)}/audio/${escapeXml(audioId)}</Play>`
    : `<Say voice="Polly.Joanna" language="en-US">${escapeXml(text)}</Say>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" speechTimeout="auto" action="${escapeXml(nextUrl)}" method="POST">
    ${playOrSay}
  </Gather>
  <Redirect method="POST">${escapeXml(nextUrl)}</Redirect>
</Response>`;
}

function twimlRecord(text: string, audioId: string, nextUrl: string): string {
  const playOrSay = audioId
    ? `<Play>${escapeXml(BASE_URL)}/audio/${escapeXml(audioId)}</Play>`
    : `<Say voice="Polly.Joanna" language="en-US">${escapeXml(text)}</Say>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${playOrSay}
  <Record maxLength="120" action="${escapeXml(nextUrl)}" method="POST"
          playBeep="true" trim="trim-silence"
          transcribe="false" />
  <Redirect method="POST">${escapeXml(nextUrl)}</Redirect>
</Response>`;
}

// ── Database save ──

async function saveIntake(session: CallSession): Promise<string> {
  try {
    // Dynamic import to avoid Next.js bundling issues when run standalone
    const { createIntakeSubmission } = await import("../lib/db.js");
    const id = randomUUID();

    const name = extractName(session.responses.contact || "");
    const contactInfo = session.responses.contact || "";

    // Try to extract email from contact info
    const emailMatch = contactInfo.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : `voice-intake-${session.callerNumber}@hotline.medmalreview.com`;

    // Try to extract phone — use caller's number as fallback
    const phone = session.callerNumber || null;

    // Map free-text to a concern type
    const description = [
      session.responses.description || "",
      session.responses.outcome ? `Outcome: ${session.responses.outcome}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    createIntakeSubmission(
      id,
      name || "Voice Caller",
      email,
      phone,
      session.responses.state || "Unknown",
      session.responses.when || null,
      "other", // concern_type — voice callers describe in free text
      description || "Submitted via voice hotline"
    );

    console.log(`[db] Saved intake submission: ${id}`);
    return id;
  } catch (err) {
    console.error("[db] Failed to save intake:", err);
    return "";
  }
}

// ── SMS confirmation ──

async function sendConfirmationSms(to: string, submissionId: string): Promise<void> {
  if (!HAS_TWILIO || !TWILIO_PHONE_NUMBER) {
    console.log(`[sms] Would send confirmation to ${to} (Twilio not configured)`);
    return;
  }

  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const body = new URLSearchParams({
      To: to,
      From: TWILIO_PHONE_NUMBER,
      Body: `Thank you for contacting MedMal Review. Your intake (ref: ${submissionId.slice(0, 8)}) has been received. If an attorney in our network is interested in your case, they will reach out within 5 business days. Visit medmalreview.com for more info.`,
    });

    const res = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      throw new Error(`Twilio SMS error: ${res.status} ${await res.text()}`);
    }

    console.log(`[sms] Confirmation sent to ${to}`);
  } catch (err) {
    console.error("[sms] Failed to send confirmation:", err);
  }
}

// ── Parse URL-encoded body ──

function parseBody(raw: string): Record<string, string> {
  const params = new URLSearchParams(raw);
  const obj: Record<string, string> = {};
  params.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

// ── Route handlers ──

async function handleIncoming(
  body: Record<string, string>,
  res: ServerResponse
): Promise<void> {
  const callSid = body.CallSid || randomUUID();
  const callerNumber = body.From || "unknown";

  console.log(`[call] Incoming call from ${callerNumber} (sid: ${callSid})`);

  // Create session
  const session: CallSession = {
    callSid,
    callerNumber,
    responses: {},
    audioFiles: [],
    startedAt: Date.now(),
  };
  sessions.set(callSid, session);

  // Generate greeting + first question audio
  const greetingText = `${GREETING} ${QUESTIONS[0].text}`;
  const audioId = await generateAudio(greetingText, `greeting-${callSid.slice(0, 8)}`);

  const twiml = twimlRecord(
    greetingText,
    audioId,
    `${BASE_URL}/voice/gather/0`
  );

  res.writeHead(200, { "Content-Type": "application/xml" });
  res.end(twiml);
}

async function handleGather(
  step: number,
  body: Record<string, string>,
  res: ServerResponse
): Promise<void> {
  const callSid = body.CallSid || "";
  const session = sessions.get(callSid);

  if (!session) {
    console.error(`[gather] No session for CallSid: ${callSid}`);
    res.writeHead(200, { "Content-Type": "application/xml" });
    res.end(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Sorry, we lost track of your call. Please call back to try again.</Say>
  <Hangup/>
</Response>`);
    return;
  }

  // Transcribe the previous recording
  const recordingUrl = body.RecordingUrl || "";
  const speechResult = body.SpeechResult || "";

  let transcript = speechResult;
  if (!transcript && recordingUrl) {
    transcript = await transcribeAudio(recordingUrl);
  }

  // Save response for current question
  if (step < QUESTIONS.length) {
    session.responses[QUESTIONS[step].key] = transcript;
    console.log(`[gather] Step ${step} (${QUESTIONS[step].key}): "${transcript.slice(0, 80)}"`);
  }

  const nextStep = step + 1;

  // More questions to ask?
  if (nextStep < QUESTIONS.length) {
    const questionText = QUESTIONS[nextStep].text;
    const audioId = await generateAudio(
      questionText,
      `q${nextStep}-${callSid.slice(0, 8)}`
    );

    const twiml = twimlRecord(
      questionText,
      audioId,
      `${BASE_URL}/voice/gather/${nextStep}`
    );

    res.writeHead(200, { "Content-Type": "application/xml" });
    res.end(twiml);
    return;
  }

  // All questions answered — confirm and save
  await handleComplete(session, res);
}

async function handleComplete(
  session: CallSession,
  res: ServerResponse
): Promise<void> {
  console.log(`[complete] Finalizing call ${session.callSid}`);
  console.log("[complete] Responses:", JSON.stringify(session.responses, null, 2));

  // Save to database
  const submissionId = await saveIntake(session);

  // Build confirmation
  const confirmationText = buildConfirmation(session.responses);
  const audioId = await generateAudio(
    confirmationText,
    `confirm-${session.callSid.slice(0, 8)}`
  );

  const playOrSay = audioId
    ? `<Play>${escapeXml(BASE_URL)}/audio/${escapeXml(audioId)}</Play>`
    : `<Say voice="Polly.Joanna" language="en-US">${escapeXml(confirmationText)}</Say>`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${playOrSay}
  <Hangup/>
</Response>`;

  res.writeHead(200, { "Content-Type": "application/xml" });
  res.end(twiml);

  // Send SMS confirmation (non-blocking)
  if (session.callerNumber && session.callerNumber !== "unknown" && submissionId) {
    sendConfirmationSms(session.callerNumber, submissionId).catch(() => {});
  }

  // Clean up session after a delay
  setTimeout(() => {
    sessions.delete(session.callSid);
  }, 60_000);
}

async function handleAudio(
  audioId: string,
  res: ServerResponse
): Promise<void> {
  const cached = audioCache.get(audioId);
  if (cached) {
    res.writeHead(200, {
      "Content-Type": "audio/wav",
      "Content-Length": cached.buffer.length.toString(),
      "Cache-Control": "public, max-age=3600",
    });
    res.end(cached.buffer);
    return;
  }

  // Try to read from disk
  const filepath = join(TMP_DIR, `${audioId}.wav`);
  try {
    const buffer = await readFile(filepath);
    res.writeHead(200, {
      "Content-Type": "audio/wav",
      "Content-Length": buffer.length.toString(),
    });
    res.end(buffer);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Audio not found");
  }
}

function handleHealth(res: ServerResponse): void {
  const info = {
    status: "ok",
    service: "medmal-voice-hotline",
    port: PORT,
    twilio: HAS_TWILIO ? "configured" : "not configured (stub mode)",
    voicebox: VOICEBOX_URL,
    activeCalls: sessions.size,
    uptime: process.uptime(),
  };
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(info, null, 2));
}

// ── HTTP server ──

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url || "/", `http://localhost:${PORT}`);
  const method = req.method || "GET";
  const path = url.pathname;

  try {
    // Health check
    if (path === "/health" && method === "GET") {
      return handleHealth(res);
    }

    // Serve audio files
    if (path.startsWith("/audio/") && method === "GET") {
      const audioId = path.replace("/audio/", "");
      return await handleAudio(audioId, res);
    }

    // Twilio webhooks (POST)
    if (method === "POST") {
      const rawBody = await readRequestBody(req);
      const body = parseBody(rawBody);

      // Incoming call
      if (path === "/voice/incoming") {
        return await handleIncoming(body, res);
      }

      // Gather step responses
      const gatherMatch = path.match(/^\/voice\/gather\/(\d+)$/);
      if (gatherMatch) {
        const step = parseInt(gatherMatch[1], 10);
        return await handleGather(step, body, res);
      }

      // Direct complete endpoint
      if (path === "/voice/complete") {
        const callSid = body.CallSid || "";
        const session = sessions.get(callSid);
        if (session) {
          return await handleComplete(session, res);
        }
      }
    }

    // 404
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
  } catch (err) {
    console.error(`[server] Error handling ${method} ${path}:`, err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "internal server error" }));
  }
});

// ── Start ──

async function start(): Promise<void> {
  await mkdir(TMP_DIR, { recursive: true });

  server.listen(PORT, () => {
    console.log("");
    console.log("== MedMal Review — Voice Intake Hotline ==");
    console.log("");
    console.log(`  Server:     http://localhost:${PORT}`);
    console.log(`  Health:     http://localhost:${PORT}/health`);
    console.log(`  Voicebox:   ${VOICEBOX_URL}`);
    console.log(`  Twilio:     ${HAS_TWILIO ? "configured" : "NOT configured (stub mode)"}`);
    console.log("");
    console.log("  Webhook endpoints:");
    console.log(`    POST ${BASE_URL}/voice/incoming     — initial call handler`);
    console.log(`    POST ${BASE_URL}/voice/gather/:step — step responses`);
    console.log(`    POST ${BASE_URL}/voice/complete     — final save`);
    console.log(`    GET  ${BASE_URL}/audio/:id          — TTS audio files`);
    console.log("");

    if (!HAS_TWILIO) {
      console.log("  [WARN] TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN not set.");
      console.log("         Running in stub mode — webhooks work but no real calls.");
      console.log("         Set env vars and configure Twilio webhook to go live.");
      console.log("");
    }
  });
}

start().catch((err) => {
  console.error("[FATAL]", err);
  process.exit(1);
});
