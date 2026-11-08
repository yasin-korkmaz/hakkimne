import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/mdx";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: `İşçi Hakları Rehberi | ${siteConfig.siteName}`,
  description:
    "4857 ve 1475 sayılı kanunlar kapsamında işçi hakları, haklı fesih halleri ve tazminat süreçlerine dair pratik ve güvenilir rehberler.",
  alternates: {
    canonical: "/rehber",
  },
  openGraph: {
    title: `İşçi Hakları Rehberi | ${siteConfig.siteName}`,
    description:
      "4857 ve 1475 sayılı kanunlar kapsamında işçi hakları, haklı fesih halleri ve tazminat süreçlerine dair pratik ve güvenilir rehberler.",
    url: `${siteConfig.siteUrl}/rehber`,
  },
  twitter: {
    card: "summary_large_image",
    title: `İşçi Hakları Rehberi | ${siteConfig.siteName}`,
    description:
      "4857 ve 1475 sayılı kanunlar kapsamında işçi hakları, haklı fesih halleri ve tazminat süreçlerine dair pratik ve güvenilir rehberler.",
  },
};

export default function RehberPage() {
  const posts = getAllPosts();
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Rehber", url: "/rehber" },
  ]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <JsonLd data={breadcrumbSchema} />

      {/* 1. Başlık ve Giriş Alanı */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          İşçi Hakları Rehberi
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          4857 ve 1475 sayılı kanunlar kapsamında işçi hakları, haklı fesih halleri ve
          tazminat süreçlerine dair pratik, mevzuata uygun ve güvenilir rehberler.
        </p>
      </section>

      {/* 2. MDX Rehber Yazıları Grid'i */}
      <section aria-label="Rehber Yazıları" className="w-full">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-500 text-sm">Henüz yayınlanmış bir rehber yazısı bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/rehber/${post.slug}`}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#1769E0] border border-blue-100">
                      {post.frontmatter.category || "Rehber"}
                    </span>
                    <time dateTime={post.frontmatter.date} className="text-xs text-slate-400 font-medium">
                      {post.frontmatter.date}
                    </time>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#1769E0] transition-colors leading-snug mb-2">
                    {post.frontmatter.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {post.frontmatter.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#1769E0] group-hover:translate-x-0.5 transition-transform">
                  <span>Rehberi Oku</span>
                  <span className="ml-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. Statik Mevzuat ve Formül Kartları */}
      <section className="flex flex-col gap-4 mt-4">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
          Temel Hesaplama Mantıkları
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Yıllık Ücretli İzin Rehberi</h3>
              <p className="text-xs text-slate-600 mt-1">
                4857 sayılı Kanun md. 53 ve 59 kapsamında kıdem kademeleri ve kullanılmayan izin ücreti formülleri.
              </p>
            </div>
            <Link
              href="/rehber/yillik-izin"
              className="inline-flex items-center text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Yıllık İzin Rehberini İncele →
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Fazla Mesai Hesaplama Rehberi</h3>
              <p className="text-xs text-slate-600 mt-1">
                4857 sayılı Kanun md. 41 kapsamında saatlik brüt ücret (Brüt/225) ve zamlı mesai hesaplama esasları.
              </p>
            </div>
            <Link
              href="/rehber/fazla-mesai"
              className="inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              Fazla Mesai Rehberini İncele →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
