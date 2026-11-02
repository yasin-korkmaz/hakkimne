/**
 * structuredData.test.ts — Schema.org JSON-LD ve Metadata Derinlik Testleri
 * Dayanak: FAZ 3 — SEO ve İndeksleme Altyapısı
 */

import { describe, it, expect } from "vitest";
import { siteConfig } from "@/config/site";
import {
  buildOrganizationAndWebsiteSchema,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildArticleSchema,
} from "@/lib/seo/jsonLd";
import { metadata as ihbarSuresiMeta } from "@/app/ihbar-suresi-hesaplama/page";
import { metadata as yillikIzinMeta } from "@/app/yillik-izin-ucreti-hesaplama/page";
import { metadata as fazlaMesaiMeta } from "@/app/fazla-mesai-hesaplama/page";
import { metadata as rehberMeta } from "@/app/rehber/page";
import { metadata as yillikIzinRehberMeta } from "@/app/rehber/yillik-izin/page";
import { metadata as fazlaMesaiRehberMeta } from "@/app/rehber/fazla-mesai/page";

describe("FAZ 3: Schema.org Organization ve WebSite Yapısı", () => {
  it("Organization ve WebSite şemaları doğru alanları içermeli", () => {
    const schema = buildOrganizationAndWebsiteSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@graph"]).toHaveLength(2);

    const graph = schema["@graph"] as unknown as Record<string, unknown>[];
    const org = graph[0]!;
    const website = graph[1]!;
    expect(org["@type"]).toBe("Organization");
    expect(org.url).toBe(siteConfig.siteUrl);
    expect(org.name).toBe(siteConfig.siteName);

    expect(website["@type"]).toBe("WebSite");
    expect(website.url).toBe(siteConfig.siteUrl);
    expect(website.inLanguage).toBe("tr-TR");
  });
});

describe("FAZ 3: Schema.org BreadcrumbList Yapısı", () => {
  it("gezinme yolu elemanları 1'den başlayan pozisyonlarla listelenmeli", () => {
    const breadcrumb = buildBreadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Kıdem Tazminatı", url: "/kidem-tazminati-hesaplama" },
    ]);
    expect(breadcrumb["@context"]).toBe("https://schema.org");
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement).toHaveLength(2);
    expect(breadcrumb.itemListElement[0]?.position).toBe(1);
    expect(breadcrumb.itemListElement[0]?.item).toBe(`${siteConfig.siteUrl}/`);
    expect(breadcrumb.itemListElement[1]?.position).toBe(2);
  });
});

describe("FAZ 3: Schema.org WebApplication Yapısı", () => {
  it("araç sayfaları için BusinessApplication şeması doğru üretilmeli", () => {
    const app = buildWebApplicationSchema({
      name: "Kıdem Tazminatı Hesaplama",
      path: "/kidem-tazminati-hesaplama",
      description: "Hizmet süresi ve güncel tavana göre hesaplama.",
    });
    expect(app["@context"]).toBe("https://schema.org");
    expect(app["@type"]).toBe("WebApplication");
    expect(app.applicationCategory).toBe("BusinessApplication");
    expect(app.offers.price).toBe("0");
    expect(app.url).toBe(`${siteConfig.siteUrl}/kidem-tazminati-hesaplama`);
  });
});

describe("FAZ 3: Schema.org Article Yapısı", () => {
  it("rehber sayfaları için Article şeması yazar ve yayıncı bilgisiyle üretilmeli", () => {
    const article = buildArticleSchema({
      headline: "Yıllık İzin Hesaplama Mantığı",
      description: "Kıdem kademelerine göre izin günleri.",
      path: "/rehber/yillik-izin",
    });
    expect(article["@context"]).toBe("https://schema.org");
    expect(article["@type"]).toBe("Article");
    expect(article.headline).toBe("Yıllık İzin Hesaplama Mantığı");
    expect(article.author.name).toBe("Yasin Korkmaz");
    expect(article.publisher.name).toBe(siteConfig.siteName);
  });
});

describe("FAZ 3: Modül Sayfaları Title ve Description Standartları", () => {
  const metadatas = [
    { name: "İhbar Süresi", meta: ihbarSuresiMeta },
    { name: "Yıllık İzin", meta: yillikIzinMeta },
    { name: "Fazla Mesai", meta: fazlaMesaiMeta },
    { name: "Rehber Ana", meta: rehberMeta },
    { name: "Yıllık İzin Rehberi", meta: yillikIzinRehberMeta },
    { name: "Fazla Mesai Rehberi", meta: fazlaMesaiRehberMeta },
  ];

  for (const { name, meta } of metadatas) {
    it(`${name} title <= 60 ve description <= 155 karakter olmalı`, () => {
      const title = meta.title as string;
      const desc = meta.description as string;
      expect(typeof title).toBe("string");
      expect(title.length).toBeLessThanOrEqual(60);
      expect(typeof desc).toBe("string");
      expect(desc.length).toBeLessThanOrEqual(155);
    });

    it(`${name} canonical URL içermeli`, () => {
      expect(meta.alternates?.canonical).toBeDefined();
    });
  }
});
