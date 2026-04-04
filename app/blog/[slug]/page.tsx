import { getAllArticles, getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { markdownToHtml } from "@/lib/markdown";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ─────────────────────────── static params ─────────────────────────── */

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

/* ─────────────────────────── metadata ─────────────────────────── */

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | MedMal Review`,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      siteName: "MedMal Review",
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

/* ─────────────────────────── share buttons ─────────────────────────── */

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://medmalreview.com/blog/${slug}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex items-center gap-3">
      <span className="text-merit-text-muted text-sm">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-merit-text-muted hover:text-merit-accent transition"
        aria-label="Share on Twitter"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-merit-text-muted hover:text-merit-accent transition"
        aria-label="Share on LinkedIn"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
    </div>
  );
}

/* ─────────────────────────── structured data ─────────────────────────── */

function ArticleJsonLd({ article }: { article: ReturnType<typeof getArticleBySlug> }) {
  if (!article) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: "Board-Certified Emergency Medicine Physician",
    },
    publisher: {
      "@type": "Organization",
      name: "MedMal Review",
      url: "https://medmalreview.com",
    },
    datePublished: article.date,
    keywords: article.keywords.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://medmalreview.com/blog/${article.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = getRelatedArticles(article);
  const htmlContent = markdownToHtml(article.content);

  return (
    <>
      <ArticleJsonLd article={article} />
      <Header />
      <main className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* ── Article ── */}
            <article className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-merit-text-muted mb-8">
                <Link href="/blog" className="hover:text-merit-text transition">
                  Blog
                </Link>
                <span>/</span>
                <span className="text-merit-text-muted/60 truncate">
                  {article.title}
                </span>
              </nav>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    article.audience === "patient"
                      ? "bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20"
                      : "bg-merit-accent/10 text-merit-accent border border-merit-accent/20"
                  }`}
                >
                  {article.audience === "patient"
                    ? "For Patients"
                    : "For Attorneys"}
                </span>
                <span className="text-xs text-merit-text-muted">
                  {article.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-merit-text mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Author + Date */}
              <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-8 border-b border-merit-border">
                <div>
                  <p className="text-merit-text font-medium text-sm">
                    {article.author}
                  </p>
                  <p className="text-merit-text-muted text-xs">
                    Board-Certified Emergency Medicine
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <time className="text-merit-text-muted text-sm">
                    {new Date(article.date + "T00:00:00").toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <ShareButtons title={article.title} slug={article.slug} />
                </div>
              </div>

              {/* Content */}
              <div
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:text-merit-text prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-merit-text-muted prose-p:leading-relaxed
                  prose-strong:text-merit-text
                  prose-a:text-merit-accent prose-a:no-underline hover:prose-a:underline
                  prose-li:text-merit-text-muted
                  prose-blockquote:border-l-merit-accent prose-blockquote:bg-merit-card/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                  prose-code:text-merit-accent prose-code:bg-merit-card prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-hr:border-merit-border"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* CTA */}
              <div className="mt-12 p-8 bg-merit-card border border-merit-border rounded-2xl">
                {article.audience === "patient" ? (
                  <>
                    <h3 className="text-xl font-bold text-merit-text mb-2">
                      Have Questions About Your Medical Care?
                    </h3>
                    <p className="text-merit-text-muted text-sm mb-6 leading-relaxed">
                      If you believe you or a loved one received substandard medical care,
                      we can connect you with a vetted malpractice attorney in your area
                      -- completely free.
                    </p>
                    <Link
                      href="/patient"
                      className="inline-block bg-[#d97706] hover:bg-[#b45309] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                    >
                      Request a Free Attorney Review
                    </Link>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-merit-text mb-2">
                      Need a Clinical Analysis of Medical Records?
                    </h3>
                    <p className="text-merit-text-muted text-sm mb-6 leading-relaxed">
                      Get AI-powered medical-legal analysis built by board-certified
                      emergency physicians. Identify standard-of-care deviations,
                      causation issues, and defense vulnerabilities in minutes.
                    </p>
                    <Link
                      href="/attorney"
                      className="inline-block bg-merit-accent hover:bg-merit-accent-hover text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                    >
                      Start a Case Analysis
                    </Link>
                  </>
                )}
              </div>
            </article>

            {/* ── Sidebar ── */}
            <aside className="lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-8">
                {/* Related articles */}
                {related.length > 0 && (
                  <div>
                    <h3 className="text-merit-text font-semibold text-sm mb-4 uppercase tracking-wider">
                      Related Articles
                    </h3>
                    <div className="space-y-4">
                      {related.map((r) => (
                        <Link
                          key={r.slug}
                          href={`/blog/${r.slug}`}
                          className="block group"
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                r.audience === "patient"
                                  ? "bg-[#d97706]"
                                  : "bg-merit-accent"
                              }`}
                            />
                            <div>
                              <p className="text-merit-text text-sm font-medium group-hover:text-merit-accent transition leading-snug">
                                {r.title}
                              </p>
                              <p className="text-merit-text-muted/60 text-xs mt-1">
                                {r.category}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick links */}
                <div className="p-5 bg-merit-card border border-merit-border rounded-xl">
                  <h3 className="text-merit-text font-semibold text-sm mb-3">
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/patient"
                      className="block text-merit-text-muted hover:text-merit-text text-sm transition"
                    >
                      Free Attorney Matching
                    </Link>
                    <Link
                      href="/attorney"
                      className="block text-merit-text-muted hover:text-merit-text text-sm transition"
                    >
                      Medical Record Analysis
                    </Link>
                    <Link
                      href="/clinician"
                      className="block text-merit-text-muted hover:text-merit-text text-sm transition"
                    >
                      Free Clinical Tools
                    </Link>
                    <Link
                      href="/blog"
                      className="block text-merit-text-muted hover:text-merit-text text-sm transition"
                    >
                      All Articles
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
