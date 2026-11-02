/**
 * site.ts — Site genel yapılandırma ve SEO meta bilgileri.
 */

export const siteConfig = {
  siteName: "HakkımNedir?",
  siteUrl: "https://hakkimnedir.com.tr",
  contactEmail: "yasinkorkmaz.devtr@gmail.com",
  lastContentUpdate: "2026-10-21",
  allowIndexing: true, // Faz 4: Kontrollü yayın kapsamında arama motoru indekslemesi açık

  // FAZ 8: Gizlilik Odaklı Analitik Altyapısı (Zero-PII & Cookieless)
  analytics: {
    enabled: false, // Varsayılan olarak kapalıdır; ortam değişkeni ile etkinleştirilebilir
    provider: "cloudflare" as const, // Cloudflare Web Analytics (çerezsiz, KVKK & GDPR tam uyumlu)
    token: process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN || "",
  },
};
