#!/usr/bin/env npx tsx
/**
 * SEO Article Generator for MedMal Review
 *
 * Usage:
 *   npx tsx scripts/generate-articles.ts --topic "missed-mi" --audience "patient"
 *   npx tsx scripts/generate-articles.ts --topic "sepsis-delay" --audience "attorney"
 *   npx tsx scripts/generate-articles.ts --batch   # generates all planned articles
 *   npx tsx scripts/generate-articles.ts --list     # list all planned topics
 *
 * Requires: claude CLI tool available in PATH
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/* ─────────────────────────── config ─────────────────────────── */

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const TOPICS_FILE = path.join(process.cwd(), "content", "article-topics.json");
const KB_FILE = path.join(process.cwd(), "lib", "clinical-knowledge.ts");

/* ─────────────────────────── prompts ─────────────────────────── */

const PATIENT_PROMPT = (topic: string, kbContext: string) => `
Write a 1,500-2,000 word article for patients who suspect they received substandard medical care.

Topic: ${topic}

Write at an 8th grade reading level. Explain medical terms in parentheses. Include:
- What the standard of care requires
- Warning signs that care fell below standard
- What to do if you suspect a problem
- When to consult an attorney

Tone: empathetic, informative, not alarmist. Do not give legal advice.
Include this disclaimer at the end: "This article is for informational purposes only and does not constitute legal or medical advice."

SEO: include the target keyword naturally 3-5 times. Structure with H2/H3 headings, short paragraphs, and bullet points.

Write ONLY the article body in markdown format (no frontmatter). Start with the first H2 heading.

Clinical knowledge base context for accuracy:
${kbContext}
`.trim();

const ATTORNEY_PROMPT = (topic: string, kbContext: string) => `
Write a 2,000-3,000 word technical article for plaintiff medical malpractice attorneys.

Topic: ${topic}

Include:
- Current standard of care with specific guideline citations and dates
- Common deviation patterns
- Key evidence to look for in records
- Defense arguments to anticipate
- Expert witness considerations
- Relevant case law or regulatory references

Tone: authoritative, clinical, practice-oriented. Structure with clear headings, evidence tables where appropriate, and actionable takeaways.

Write ONLY the article body in markdown format (no frontmatter). Start with the first H2 heading.

Clinical knowledge base context for accuracy:
${kbContext}
`.trim();

/* ─────────────────────────── helpers ─────────────────────────── */

interface TopicEntry {
  title: string;
  slug: string;
  category: string;
  keywords: string[];
}

interface TopicsFile {
  patient: TopicEntry[];
  attorney: TopicEntry[];
}

function loadTopics(): TopicsFile {
  return JSON.parse(fs.readFileSync(TOPICS_FILE, "utf-8"));
}

function loadKnowledgeBase(): string {
  const kb = fs.readFileSync(KB_FILE, "utf-8");
  // Truncate to ~4000 chars to fit in prompt
  return kb.slice(0, 4000);
}

function articleExists(slug: string): boolean {
  return fs.existsSync(path.join(ARTICLES_DIR, `${slug}.md`));
}

function generateFrontmatter(
  topic: TopicEntry,
  audience: "patient" | "attorney"
): string {
  const today = new Date().toISOString().split("T")[0];
  const description =
    audience === "patient"
      ? `Learn about ${topic.title.toLowerCase()}. Written by a board-certified emergency physician for patients who suspect substandard medical care.`
      : `${topic.title}. Technical analysis for plaintiff medical malpractice attorneys with standard of care references, deviation patterns, and litigation strategy.`;

  return [
    "---",
    `title: "${topic.title}"`,
    `slug: "${topic.slug}"`,
    `audience: "${audience}"`,
    `category: "${topic.category}"`,
    `keywords: ${JSON.stringify(topic.keywords)}`,
    `description: "${description}"`,
    `date: "${today}"`,
    `author: "James Alford, MD"`,
    "---",
    "",
  ].join("\n");
}

function generateArticle(topic: TopicEntry, audience: "patient" | "attorney"): void {
  if (articleExists(topic.slug)) {
    console.log(`  SKIP: ${topic.slug} (already exists)`);
    return;
  }

  console.log(`  Generating: ${topic.title} [${audience}]`);

  const kbContext = loadKnowledgeBase();
  const prompt =
    audience === "patient"
      ? PATIENT_PROMPT(topic.title, kbContext)
      : ATTORNEY_PROMPT(topic.title, kbContext);

  // Write prompt to temp file to avoid shell escaping issues
  const tmpPrompt = path.join(ARTICLES_DIR, `.tmp-prompt-${Date.now()}.txt`);
  fs.writeFileSync(tmpPrompt, prompt);

  try {
    // Call Claude CLI to generate the article
    const body = execSync(
      `cat "${tmpPrompt}" | claude --print --dangerously-skip-permissions`,
      {
        encoding: "utf-8",
        timeout: 120_000,
        maxBuffer: 1024 * 1024,
      }
    ).trim();

    const frontmatter = generateFrontmatter(topic, audience);
    const fullArticle = frontmatter + body + "\n";

    fs.writeFileSync(path.join(ARTICLES_DIR, `${topic.slug}.md`), fullArticle);
    console.log(`  DONE: ${topic.slug}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ERROR generating ${topic.slug}: ${msg}`);
  } finally {
    if (fs.existsSync(tmpPrompt)) fs.unlinkSync(tmpPrompt);
  }
}

/* ─────────────────────────── CLI ─────────────────────────── */

function main() {
  const args = process.argv.slice(2);

  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  }

  // --list: show all topics
  if (args.includes("--list")) {
    const topics = loadTopics();
    console.log("\n=== Patient Topics (25) ===\n");
    topics.patient.forEach((t, i) => console.log(`  ${i + 1}. ${t.title} [${t.slug}]`));
    console.log("\n=== Attorney Topics (25) ===\n");
    topics.attorney.forEach((t, i) => console.log(`  ${i + 1}. ${t.title} [${t.slug}]`));
    console.log(`\n${topics.patient.length + topics.attorney.length} total topics\n`);
    return;
  }

  // --batch: generate all
  if (args.includes("--batch")) {
    const topics = loadTopics();
    console.log("\nBatch generating all articles...\n");

    let generated = 0;
    let skipped = 0;

    for (const topic of topics.patient) {
      if (articleExists(topic.slug)) {
        skipped++;
        continue;
      }
      generateArticle(topic, "patient");
      generated++;
    }

    for (const topic of topics.attorney) {
      if (articleExists(topic.slug)) {
        skipped++;
        continue;
      }
      generateArticle(topic, "attorney");
      generated++;
    }

    console.log(`\nDone. Generated: ${generated}, Skipped: ${skipped}\n`);
    return;
  }

  // --topic + --audience: single article
  const topicIdx = args.indexOf("--topic");
  const audienceIdx = args.indexOf("--audience");

  if (topicIdx === -1 || audienceIdx === -1) {
    console.log(`
Usage:
  npx tsx scripts/generate-articles.ts --topic "missed-mi" --audience "patient"
  npx tsx scripts/generate-articles.ts --topic "sepsis-delay" --audience "attorney"
  npx tsx scripts/generate-articles.ts --batch
  npx tsx scripts/generate-articles.ts --list
`);
    process.exit(1);
  }

  const topicQuery = args[topicIdx + 1]?.toLowerCase();
  const audience = args[audienceIdx + 1]?.toLowerCase() as "patient" | "attorney";

  if (!["patient", "attorney"].includes(audience)) {
    console.error("ERROR: --audience must be 'patient' or 'attorney'");
    process.exit(1);
  }

  const topics = loadTopics();
  const pool = audience === "patient" ? topics.patient : topics.attorney;

  // Find topic by slug or partial title match
  const topic = pool.find(
    (t) =>
      t.slug === topicQuery ||
      t.slug.includes(topicQuery) ||
      t.title.toLowerCase().includes(topicQuery)
  );

  if (!topic) {
    console.error(`ERROR: No ${audience} topic matching "${topicQuery}"`);
    console.error("Run with --list to see available topics.");
    process.exit(1);
  }

  generateArticle(topic, audience);
}

main();
