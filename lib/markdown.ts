/* ─────────────────────────── Simple Markdown to HTML ─────────────────────────── */
// Converts a subset of markdown to HTML without external dependencies.
// Handles: headings, paragraphs, bold, italic, links, lists, blockquotes, hr, inline code.

export function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const html: string[] = [];
  let inList: "ul" | "ol" | null = null;
  let inBlockquote = false;

  function inline(text: string): string {
    return (
      text
        // bold
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.+?)__/g, "<strong>$1</strong>")
        // italic
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/_(.+?)_/g, "<em>$1</em>")
        // inline code
        .replace(/`(.+?)`/g, "<code>$1</code>")
        // links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    );
  }

  function closeList() {
    if (inList) {
      html.push(inList === "ul" ? "</ul>" : "</ol>");
      inList = null;
    }
  }

  function closeBlockquote() {
    if (inBlockquote) {
      html.push("</blockquote>");
      inBlockquote = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeList();
      closeBlockquote();
      const level = headingMatch[1].length;
      const id = headingMatch[2]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      html.push(`<h${level} id="${id}">${inline(headingMatch[2])}</h${level}>`);
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      closeList();
      closeBlockquote();
      html.push("<hr />");
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      closeList();
      if (!inBlockquote) {
        html.push("<blockquote>");
        inBlockquote = true;
      }
      html.push(`<p>${inline(line.slice(2))}</p>`);
      continue;
    } else if (inBlockquote && line.trim() === "") {
      closeBlockquote();
      continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(line)) {
      closeBlockquote();
      if (inList !== "ul") {
        closeList();
        html.push("<ul>");
        inList = "ul";
      }
      html.push(`<li>${inline(line.replace(/^[-*+]\s+/, ""))}</li>`);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      closeBlockquote();
      if (inList !== "ol") {
        closeList();
        html.push("<ol>");
        inList = "ol";
      }
      html.push(`<li>${inline(olMatch[1])}</li>`);
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      closeList();
      closeBlockquote();
      continue;
    }

    // Paragraph
    closeList();
    closeBlockquote();
    html.push(`<p>${inline(line)}</p>`);
  }

  closeList();
  closeBlockquote();

  return html.join("\n");
}
