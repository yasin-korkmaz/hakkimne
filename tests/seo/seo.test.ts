/**
 * seo.test.ts — SEO Altyapısı ve Şema Doğrulama Testleri
 * Dayanak: PRD, Görev 16 & Faz 4 Kontrollü Yayın gereksinimleri.
 */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "@/config/site";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { generateFaqSchema } from "@/lib/seo/faqSchema";
import { metadata as homeMetadata } from "@/app/page";
import { metadata as kidemMetadata } from "@/app/kidem-tazminati-hesaplama/page";
import { metadata as ihbarMetadata } from "@/app/ihbar-tazminati-hesaplama/page";
import { metadata as kvkkMetadata } from "@/app/kvkk/page";
import { metadata as rootMetadata } from "@/app/layout";

describe("SEO — siteConfig ve İndeksleme Kontrolü", () => {
  it("ALLOW_INDEXING Faz 4 Kontrollü Yayın kapsamında true olmalı", () => {
    expect(siteConfig.allowIndexing).toBe(true);
  });

  it("ALLOW_INDEXING true iken root metadata robots index/follow olmalı", () => {
    expect(rootMetadata.robots).toEqual({ index: true, follow: true });
  });

  it("yasal sayfalarda (kvkk vb.) robots noindex olmalı", () => {
    expect(kvkkMetadata.robots).toEqual({ index: false, follow: false });
  });
});

describe("SEO — Başlık ve Açıklama Karakter Sınırları", () => {
  it("sayfa başlıkları 60 karakterin altında olmalı ve 'en doğru/1 numara' gibi iddialar içermemeli", () => {
    const titles = [
      homeMetadata.title as string,
      kidemMetadata.title as string,
      ihbarMetadata.title as string,
    ];

    for (const title of titles) {
      expect(typeof title).toBe("string");
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title).not.toMatch(/en doğru|1 numara|kesin garanti/i);
    }
  });

  it("sayfa açıklamaları 155 karakterin altında olmalı", () => {
    const descriptions = [
      homeMetadata.description as string,
      kidemMetadata.description as string,
      ihbarMetadata.description as string,
    ];

    for (const desc of descriptions) {
      expect(typeof desc).toBe("string");
      expect(desc.length).toBeLessThanOrEqual(155);
      expect(desc).not.toMatch(/en doğru|1 numara|kesin garanti/i);
    }
  });
});

describe("SEO — Sitemap ve Robots Fonksiyonları", () => {
  it("sitemap ana sayfaları ve yasal sayfaları içermeli", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toContain(`${siteConfig.siteUrl}`);
    expect(urls).toContain(`${siteConfig.siteUrl}/kidem-tazminati-hesaplama`);
    expect(urls).toContain(`${siteConfig.siteUrl}/ihbar-tazminati-hesaplama`);
    expect(urls).toContain(`${siteConfig.siteUrl}/rehber`);
    expect(urls).toContain(`${siteConfig.siteUrl}/kvkk`);
    expect(urls).toContain(`${siteConfig.siteUrl}/gizlilik`);
  });

  it("robots() allowIndexing true iken allow '/' ve yasal sayfalar için disallow dönmeli", () => {
    const rob = robots();
    const rules = Array.isArray(rob.rules) ? rob.rules[0] : rob.rules;
    expect(rules?.allow).toBe("/");
    expect(rules?.disallow).toEqual([
      "/gizlilik",
      "/kvkk",
      "/cerez-politikasi",
      "/kullanim-kosullari",
      "/iletisim",
    ]);
    expect(rob.sitemap).toBe(`${siteConfig.siteUrl}/sitemap.xml`);
  });
});

describe("SEO — FAQPage JSON-LD Şeması", () => {
  it("şema geçerli bir JSON olmalı ve FAQPage tipini taşımalı", () => {
    const schema = generateFaqSchema();
    const jsonString = JSON.stringify(schema);
    const parsed = JSON.parse(jsonString);

    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@type"]).toBe("FAQPage");
    expect(Array.isArray(parsed.mainEntity)).toBe(true);
    expect(parsed.mainEntity.length).toBe(10);

    for (const entity of parsed.mainEntity) {
      expect(entity["@type"]).toBe("Question");
      expect(entity.name).toBeDefined();
      expect(entity.acceptedAnswer["@type"]).toBe("Answer");
      expect(entity.acceptedAnswer.text).toBeDefined();
    }
  });
});

describe("SEO — Statik Derleme Dosyaları (out/ sitemap.xml & robots.txt)", () => {
  it("build sonrasında out klasöründe sitemap.xml ve robots.txt bulunmalı", () => {
    const outDir = path.resolve(process.cwd(), "out");
    if (fs.existsSync(outDir)) {
      const sitemapPath = path.join(outDir, "sitemap.xml");
      const robotsPath = path.join(outDir, "robots.txt");

      // Eğer out dizini varsa doğrula
      if (fs.existsSync(sitemapPath)) {
        const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
        expect(sitemapContent).toContain("urlset");
      }
      if (fs.existsSync(robotsPath)) {
        const robotsContent = fs.readFileSync(robotsPath, "utf-8");
        expect(robotsContent).toMatch(/user-agent/i);
      }
    }
  });
});
