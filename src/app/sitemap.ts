import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/mdx";

export const dynamic = "force-static";

/**
 * sitemap.ts — Dinamik ve Statik Rota Haritası (XML Sitemap)
 *
 * Algoritma: Sabit uygulama rotaları ile content/rehber altındaki tüm MDX
 * makale rotalarını birleştirip Google Search Console uyumlu sitemap üretir.
 * Yasal Dayanak: 4857 ve 1475 sayılı kanun rehberlerinin taranabilirliği.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.siteUrl; // https://hakkimnedir.com.tr

  // 1. Sabit Ana Sayfa, Araçlar ve Rehber Rotaları
  const staticRoutes = [
    "",
    "/kidem-tazminati-hesaplama",
    "/kidem-tazminati",
    "/ihbar-tazminati-hesaplama",
    "/ihbar-suresi-hesaplama",
    "/yillik-izin-ucreti-hesaplama",
    "/fazla-mesai-hesaplama",
    "/net-brut-ucret-hesaplama",
    "/hak-takip-merkezi",
    "/belge-kontrolu",
    "/belge-kontrol",
    "/kariyerim",
    "/kamu",
    "/rehber",
    "/rehber/yillik-izin",
    "/rehber/fazla-mesai",
    "/hakkinda",
    "/iletisim",
    "/kullanim-kosullari",
    "/gizlilik",
    "/kvkk",
    "/cerez-politikasi",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(siteConfig.lastContentUpdate),
    changeFrequency:
      path === "" || path.includes("hesaplama") || path.startsWith("/rehber")
        ? "weekly"
        : "monthly",
    priority:
      path === ""
        ? 1.0
        : path.includes("hesaplama") || path === "/rehber"
        ? 0.9
        : 0.6,
  }));

  // 2. Dinamik MDX Rehber Yazıları
  const posts = getAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/rehber/${post.slug}`,
    lastModified: post.frontmatter.date
      ? new Date(post.frontmatter.date)
      : new Date(siteConfig.lastContentUpdate),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...postEntries];
}
