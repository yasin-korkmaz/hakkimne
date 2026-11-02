"use client";

/**
 * PrivacyAnalytics.tsx — Çerezsiz ve Gizlilik Odaklı Analitik Bileşeni
 * Cloudflare Web Analytics (veya KVKK uyumlu çerezsiz analiz) entegrasyonu.
 * Dayanak: KVKK md. 5 & GDPR — Çerez (cookie) ve kişisel takip kodu içermez.
 */

import React from "react";
import Script from "next/script";
import { siteConfig } from "@/config/site";

export default function PrivacyAnalytics() {
  if (!siteConfig.analytics.enabled || !siteConfig.analytics.token) {
    return null;
  }

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: siteConfig.analytics.token })}
      strategy="afterInteractive"
    />
  );
}
