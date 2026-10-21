import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // ALLOW_INDEXING = false iken tüm tarayıcı ve botlar için disallow: /
  if (!siteConfig.allowIndexing) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    };
  }

  // ALLOW_INDEXING = true iken hesaplama sayfaları serbest, yasal sayfalar noindex/disallow
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
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
