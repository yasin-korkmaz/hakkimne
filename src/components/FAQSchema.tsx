import React from "react";

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQSchemaProps {
  items: FAQItem[];
}

/**
 * FAQSchema — Google Rich Results Uyumlu Schema.org FAQPage JSON-LD Bileşeni
 * Sık sorulan soruları arama motorlarının zengin sonuçlarda (rich snippets) gösterebilmesi için
 * Schema.org FAQPage JSON-LD yapısına dönüştürür ve DOM'a enjekte eder.
 * Dayanak: Google Search Central FAQ Page Structured Data & Schema.org/FAQPage.
 * Sunucu bileşeni (Server Component) olarak çalışır.
 */
export default function FAQSchema({ items }: FAQSchemaProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
