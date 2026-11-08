import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import MdxComponents from "@/components/MdxComponents";
import { siteConfig } from "@/config/site";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/jsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * generateStaticParams — Statik SSG için tüm slug parametrelerini üretir.
 * output: 'export' modunda tüm dinamik rehber sayfalarının derleme anında oluşturulmasını sağlar.
 */
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * generateMetadata — Dinamik SEO etiketlerini üretir.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Rehber Bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${post.frontmatter.title} | ${siteConfig.siteName}`,
    description: post.frontmatter.description,
    alternates: {
      canonical: `/rehber/${post.slug}`,
    },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      url: `${siteConfig.siteUrl}/rehber/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    },
  };
}

/**
 * RehberPostPage — %100 Server Component MDX İçerik Sayfası
 * MDXRemote ve MdxComponents ile hibrit zengin rehber ve otomatik Article Schema render eder.
 */
export default async function RehberPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Schema.org Article Zengin İçerik Verisi
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    author: {
      "@type": "Person",
      name: "Yasin Korkmaz",
    },
    publisher: {
      "@type": "Organization",
      name: "HakkımNedir",
    },
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Rehber", url: "/rehber" },
    { name: post.frontmatter.title, url: `/rehber/${post.slug}` },
  ]);

  return (
    <article className="max-w-3xl mx-auto py-12 px-4 md:px-0 w-full">
      {/* Schema.org Yapılandırılmış Verileri */}
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Geri Dönüş Linki */}
      <nav aria-label="Geri Dönüş" className="mb-6">
        <Link
          href="/rehber"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1769E0] hover:text-[#123C68] transition-colors min-h-[44px]"
        >
          ← Tüm Rehberlere Dön
        </Link>
      </nav>

      {/* Üst Kısım: Devasa Başlık ve Gri Formatında Kategori/Tarih */}
      <header className="mb-8 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2.5 text-xs text-slate-500 mb-3 font-medium">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#1769E0] border border-blue-100">
            {post.frontmatter.category || "Rehber"}
          </span>
          <span>•</span>
          <time dateTime={post.frontmatter.date}>{post.frontmatter.date}</time>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {post.frontmatter.title}
        </h1>
        {post.frontmatter.description && (
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {post.frontmatter.description}
          </p>
        )}
      </header>

      {/* MDXRemote ile İçerik ve Hibrit Araç Render */}
      <div className="prose-content">
        <MDXRemote source={post.content} components={MdxComponents} />
      </div>
    </article>
  );
}
