import React from "react";

/**
 * JsonLdProps — Schema.org JSON-LD yapılandırılmış verisi için tip güvenli prop tanımı.
 */
export interface JsonLdProps<T = Record<string, unknown>> {
  data: T | Array<T> | Record<string, any> | any;
}

/**
 * JsonLd — Next.js statik çıktısı (SSG) için güvenli Schema.org JSON-LD enjektörü (React Server Component)
 *
 * Algoritma: Gelen yapılandırılmış SEO verilerini JSON dizesine dönüştürerek
 * DOM'a <script type="application/ld+json"> etiketiyle enjekte eder.
 * Yasal Dayanak: Google Search Central Rich Snippets ve Schema.org standartları.
 */
export default function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
