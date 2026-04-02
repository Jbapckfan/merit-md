export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    // pdf-parse has issues with some import patterns in Next.js
    // Use dynamic require as a workaround
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (error) {
    console.error("PDF extraction error:", error);
    return "[PDF text extraction failed — manual review may be needed]";
  }
}

export function extractTextFromImage(): string {
  // In a production app, this would use OCR (Tesseract, Google Vision, etc.)
  // For MVP, we note that image OCR is not yet implemented
  return "[Image uploaded — OCR extraction not yet available in MVP. Please also upload text or PDF versions of records.]";
}

export function isSupportedFile(mimeType: string): boolean {
  const supported = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/webp",
    "text/plain",
  ];
  return supported.includes(mimeType);
}

export function getFileType(mimeType: string): "pdf" | "image" | "text" | "unknown" {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "text/plain") return "text";
  return "unknown";
}
