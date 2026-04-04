import fs from "fs";
import path from "path";

/* ─────────────────────────── types ─────────────────────────── */

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  audience: "patient" | "attorney";
  category: string;
  keywords: string[];
  description: string;
  date: string;
  author: string;
}

export interface Article extends ArticleFrontmatter {
  content: string;
  excerpt: string;
}

/* ─────────────────────────── parser ─────────────────────────── */

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

function parseFrontmatter(raw: string): { frontmatter: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: raw };

  const fm: Record<string, unknown> = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: string | string[] = line.slice(colonIdx + 1).trim();

    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Handle array values like ["a", "b", "c"]
    if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
      try {
        value = JSON.parse(value);
      } catch {
        // leave as string
      }
    }

    fm[key] = value;
  }

  return { frontmatter: fm, content: match[2].trim() };
}

function extractExcerpt(content: string, maxLen = 180): string {
  // Skip headings, get first paragraph
  const lines = content.split("\n").filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("*"));
  const text = lines.join(" ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // strip markdown links
  return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + "..." : text;
}

/* ─────────────────────────── public API ─────────────────────────── */

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));

  const articles: Article[] = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
      const { frontmatter, content } = parseFrontmatter(raw);
      return {
        title: (frontmatter.title as string) || "",
        slug: (frontmatter.slug as string) || file.replace(".md", ""),
        audience: (frontmatter.audience as "patient" | "attorney") || "patient",
        category: (frontmatter.category as string) || "General",
        keywords: (frontmatter.keywords as string[]) || [],
        description: (frontmatter.description as string) || "",
        date: (frontmatter.date as string) || "",
        author: (frontmatter.author as string) || "James Alford, MD",
        content,
        excerpt: extractExcerpt(content),
      };
    })
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  return articles;
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles();
  return articles.find((a) => a.slug === slug) || null;
}

export function getArticlesByAudience(audience: "patient" | "attorney"): Article[] {
  return getAllArticles().filter((a) => a.audience === audience);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const all = getAllArticles().filter((a) => a.slug !== article.slug);

  // Score by shared keywords and same category
  const scored = all.map((a) => {
    let score = 0;
    if (a.category === article.category) score += 2;
    if (a.audience === article.audience) score += 1;
    for (const kw of a.keywords) {
      if (article.keywords.includes(kw)) score += 3;
    }
    return { article: a, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.article);
}
