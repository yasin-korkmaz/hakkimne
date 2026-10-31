import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/kidem-tazminati-hesaplama",
    "/ihbar-tazminati-hesaplama",
    "/ihbar-suresi-hesaplama",
    "/yillik-izin-ucreti-hesaplama",
    "/fazla-mesai-hesaplama",
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

  return routes.map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified: new Date(siteConfig.lastContentUpdate),
    changeFrequency: path === "" || path.includes("hesaplama") || path.startsWith("/rehber") ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : path.includes("hesaplama") || path.startsWith("/rehber") ? 0.9 : 0.5,
  }));
}
