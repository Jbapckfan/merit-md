// ── MedMal Review Pro — Local Text Extraction ──
// Extracts text from PDFs, images, and text files in a case records directory.
// Each extracted segment tracks its source filename and page number.

import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface ExtractedSegment {
  source: string;
  page: number;
  text: string;
}

const PDF_EXTENSIONS = [".pdf"];
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".tiff", ".tif", ".webp", ".bmp"];
const TEXT_EXTENSIONS = [".txt", ".text", ".md", ".csv", ".rtf"];

async function extractFromPdf(filePath: string, filename: string): Promise<ExtractedSegment[]> {
  try {
    const pdfParse = (await import("pdf-parse")).default;
    const buffer = await readFile(filePath);
    const data = await pdfParse(buffer);

    const segments: ExtractedSegment[] = [];

    // pdf-parse returns all text as one block; split by form feeds if present
    const pages = data.text.split("\f").filter((p: string) => p.trim());

    if (pages.length > 1) {
      for (let i = 0; i < pages.length; i++) {
        segments.push({
          source: filename,
          page: i + 1,
          text: pages[i].trim(),
        });
      }
    } else {
      // Single block — treat as page 1
      segments.push({
        source: filename,
        page: 1,
        text: data.text.trim(),
      });
    }

    return segments;
  } catch (error) {
    console.error(`  [extract] PDF extraction failed for ${filename}:`, error);
    return [{
      source: filename,
      page: 1,
      text: `[PDF text extraction failed for ${filename} — manual review may be needed]`,
    }];
  }
}

async function extractFromImage(filePath: string, filename: string): Promise<ExtractedSegment[]> {
  // Check if tesseract is available
  try {
    await execFileAsync("which", ["tesseract"]);
  } catch {
    console.warn(`  [extract] WARNING: tesseract not found — skipping OCR for ${filename}`);
    return [{
      source: filename,
      page: 1,
      text: `[Image file ${filename} — OCR not available. Install tesseract for image text extraction.]`,
    }];
  }

  try {
    const { stdout } = await execFileAsync("tesseract", [filePath, "stdout"], {
      timeout: 60_000,
    });
    return [{
      source: filename,
      page: 1,
      text: stdout.trim() || `[Image file ${filename} — OCR produced no text]`,
    }];
  } catch (error) {
    console.error(`  [extract] OCR failed for ${filename}:`, error);
    return [{
      source: filename,
      page: 1,
      text: `[OCR extraction failed for ${filename} — manual review may be needed]`,
    }];
  }
}

async function extractFromText(filePath: string, filename: string): Promise<ExtractedSegment[]> {
  try {
    const text = await readFile(filePath, "utf-8");
    return [{
      source: filename,
      page: 1,
      text: text.trim(),
    }];
  } catch (error) {
    console.error(`  [extract] Failed to read ${filename}:`, error);
    return [{
      source: filename,
      page: 1,
      text: `[Failed to read text file ${filename}]`,
    }];
  }
}

function getFileCategory(filename: string): "pdf" | "image" | "text" | "unknown" {
  const ext = extname(filename).toLowerCase();
  if (PDF_EXTENSIONS.includes(ext)) return "pdf";
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  if (TEXT_EXTENSIONS.includes(ext)) return "text";
  return "unknown";
}

/**
 * Extract text from all files in a records directory.
 * Returns an array of extracted segments with source attribution.
 */
export async function extractAllText(recordsDir: string): Promise<ExtractedSegment[]> {
  const files = await readdir(recordsDir);
  const segments: ExtractedSegment[] = [];

  // Sort files for consistent ordering
  const sortedFiles = files.filter((f) => !f.startsWith(".")).sort();

  for (const filename of sortedFiles) {
    const filePath = join(recordsDir, filename);
    const category = getFileCategory(filename);

    console.log(`  [extract] Processing ${filename} (${category})`);

    switch (category) {
      case "pdf":
        segments.push(...await extractFromPdf(filePath, filename));
        break;
      case "image":
        segments.push(...await extractFromImage(filePath, filename));
        break;
      case "text":
        segments.push(...await extractFromText(filePath, filename));
        break;
      default:
        console.warn(`  [extract] Skipping unsupported file: ${filename}`);
        segments.push({
          source: filename,
          page: 1,
          text: `[Unsupported file format: ${filename}]`,
        });
        break;
    }
  }

  return segments;
}

/**
 * Concatenate extracted segments into a single string with source attribution.
 */
export function concatenateWithAttribution(segments: ExtractedSegment[]): string {
  return segments
    .map((s) => `[Source: ${s.source}, page ${s.page}]\n${s.text}`)
    .join("\n\n---\n\n");
}

/**
 * Save extracted segments to individual files in an output directory.
 */
export async function saveExtracted(segments: ExtractedSegment[], outputDir: string): Promise<void> {
  await mkdir(outputDir, { recursive: true });

  for (const segment of segments) {
    const safeName = segment.source.replace(/[^a-zA-Z0-9._-]/g, "_");
    const outFile = join(outputDir, `${safeName}_page${segment.page}.txt`);
    const content = `[Source: ${segment.source}, page ${segment.page}]\n\n${segment.text}`;
    await writeFile(outFile, content, "utf-8");
  }

  // Also save a combined file
  const combined = concatenateWithAttribution(segments);
  await writeFile(join(outputDir, "_combined.txt"), combined, "utf-8");
}
