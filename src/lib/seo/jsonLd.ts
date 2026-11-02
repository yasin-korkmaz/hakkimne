import { siteConfig } from "@/config/site";

/**
 * jsonLd.ts — Schema.org Yapısal Veri (JSON-LD) Üreteçleri
 * Standartlar: schema.org/Organization, WebSite, WebApplication, BreadcrumbList, Article
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Ana sayfa için Organization ve WebSite şemalarını döndürür.
 */
export function buildOrganizationAndWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.siteUrl}/#organization`,
        name: siteConfig.siteName,
        url: siteConfig.siteUrl,
        logo: `${siteConfig.siteUrl}/logo.svg`,
        founder: {
          "@type": "Person",
          name: "Yasin Korkmaz",
          url: "https://github.com/yasin-korkmaz",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.siteUrl}/#website`,
        url: siteConfig.siteUrl,
        name: siteConfig.siteName,
        description:
          "İş Kanunu mevzuatına uygun kıdem, ihbar, yıllık izin ve fazla mesai hesaplama platformu.",
        publisher: {
          "@id": `${siteConfig.siteUrl}/#organization`,
        },
        inLanguage: "tr-TR",
      },
    ],
  };
}

/**
 * Gezinme yolu (BreadcrumbList) şeması üretir.
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${siteConfig.siteUrl}${item.url}`,
    })),
  };
}

/**
 * Hesaplama araçları için WebApplication şeması üretir.
 */
export function buildWebApplicationSchema(params: {
  name: string;
  path: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: params.name,
    url: `${siteConfig.siteUrl}${params.path}`,
    description: params.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    inLanguage: "tr-TR",
  };
}

/**
 * Rehber ve içerik sayfaları için Article şeması üretir.
 */
export function buildArticleSchema(params: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.siteUrl}${params.path}`,
    },
    author: {
      "@type": "Person",
      name: "Yasin Korkmaz",
      url: "https://github.com/yasin-korkmaz",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.siteName,
      url: siteConfig.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.siteUrl}/logo.svg`,
      },
    },
    datePublished: params.datePublished || siteConfig.lastContentUpdate,
    dateModified: params.dateModified || siteConfig.lastContentUpdate,
    inLanguage: "tr-TR",
  };
}
