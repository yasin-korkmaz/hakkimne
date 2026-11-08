import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

/**
 * robots.ts — Arama motoru tarama ve indeksleme kuralları
 * Dayanak: Google Search Central Robots.txt Standartları
 */
export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${siteConfig.siteUrl}/sitemap.xml`;

  // allowIndexing false iken (staging/test ortamında) tüm tarayıcılar için disallow
  if (!siteConfig.allowIndexing) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: sitemapUrl,
    };
  }

  // allowIndexing true iken tüm botlara (User-Agent: *) izin ver, sitemap'i işaret et
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/gizlilik",
        "/kvkk",
        "/cerez-politikasi",
        "/kullanim-kosullari",
        "/iletisim",
      ],
    },
    sitemap: sitemapUrl,
  };
}
