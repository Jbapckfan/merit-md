import { getAllArticles } from "@/lib/articles";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Medical Malpractice Resources | MedMal Review Blog",
  description:
    "Expert medical-legal articles for patients and attorneys. Written by board-certified emergency physicians. Understand standard of care, common deviations, and your rights.",
  keywords: [
    "medical malpractice blog",
    "malpractice resources",
    "medical negligence articles",
    "standard of care",
    "patient rights",
    "attorney resources",
  ],
  openGraph: {
    title: "Medical Malpractice Resources | MedMal Review Blog",
    description:
      "Expert medical-legal articles written by board-certified emergency physicians.",
    type: "website",
    siteName: "MedMal Review",
  },
};

/* ─────────────────────────── filter component ─────────────────────────── */

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-merit-accent text-white"
          : "bg-merit-card border border-merit-border text-merit-text-muted hover:text-merit-text hover:border-merit-border-hover"
      }`}
    >
      {children}
    </Link>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function BlogPage({
  searchParams,
}: {
  searchParams: { audience?: string };
}) {
  const allArticles = getAllArticles();
  const filter = searchParams.audience as "patient" | "attorney" | undefined;
  const articles = filter
    ? allArticles.filter((a) => a.audience === filter)
    : allArticles;

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="border-b border-merit-border bg-merit-card/30">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <h1 className="text-3xl md:text-5xl font-bold text-merit-text mb-4">
              Medical Malpractice Resources
            </h1>
            <p className="text-merit-text-muted text-lg max-w-2xl leading-relaxed">
              Expert medical-legal articles written by board-certified emergency
              physicians. Understand standard of care, common deviations, and
              your rights.
            </p>
          </div>
        </section>

        {/* Filter + Articles */}
        <section className="max-w-5xl mx-auto px-6 py-12">
          {/* Audience filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            <FilterLink href="/blog" active={!filter}>
              All Articles
            </FilterLink>
            <FilterLink
              href="/blog?audience=patient"
              active={filter === "patient"}
            >
              For Patients
            </FilterLink>
            <FilterLink
              href="/blog?audience=attorney"
              active={filter === "attorney"}
            >
              For Attorneys
            </FilterLink>
          </div>

          {/* Article grid */}
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-merit-text-muted text-lg">
                No articles published yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group bg-merit-card border border-merit-border rounded-2xl p-6 hover:border-merit-border-hover transition-all duration-300"
                >
                  {/* Category + Audience badges */}
                  <div className="flex items-center gap-2 mb-3">
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
                  <h2 className="text-lg font-semibold text-merit-text group-hover:text-merit-accent transition-colors mb-2 leading-snug">
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-merit-text-muted text-sm leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-merit-text-muted/60">
                    <span>{article.author}</span>
                    <span>
                      {new Date(article.date + "T00:00:00").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
