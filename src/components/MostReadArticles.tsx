import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";

/**
 * MostReadArticles.tsx — En Çok Okunan Rehber Yazıları Bileşeni
 * 4857 sayılı İş Kanunu ve 1475 sayılı Kanun md. 14 rehber içeriklerini listeler.
 * Server Component olarak çalışır; ilk 3 makaleyi grid kartları olarak sunar.
 */
export default function MostReadArticles() {
  const posts = getAllPosts().slice(0, 3);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="most-read-heading"
      className="w-full max-w-6xl mx-auto mt-4 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769E0] mb-1">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Mevzuat & İçtihat Rehberi</span>
          </div>
          <h2
            id="most-read-heading"
            className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
          >
            İşçi Hakları Rehberi (En Çok Okunanlar)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Haklı fesih, kıdem ve ihbar süreçlerine dair pratik ve güvenilir içerikler
          </p>
        </div>
        <Link
          href="/rehber"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769E0] hover:text-[#123C68] transition-colors"
        >
          <span>Tüm Rehberi İncele</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/rehber/${post.slug}`}
            className="group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#1769E0] border border-blue-100">
                  {post.frontmatter.category || "Kıdem Tazminatı"}
                </span>
                <time
                  dateTime={post.frontmatter.date}
                  className="text-xs text-slate-400 font-medium"
                >
                  {post.frontmatter.date}
                </time>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#1769E0] transition-colors leading-snug mb-2 line-clamp-2">
                {post.frontmatter.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {post.frontmatter.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#1769E0] group-hover:translate-x-0.5 transition-transform">
              <span>Rehberi Oku</span>
              <span className="ml-1" aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 sm:hidden text-center">
        <Link
          href="/rehber"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769E0] hover:text-[#123C68]"
        >
          <span>Tüm Rehberi İncele</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
