/**
 * privacyAnalytics.ts — Gizlilik Odaklı & Çerezsiz (Cookieless) Analitik Altyapısı
 * İlkeler:
 * 1. Sıfır Kişisel Veri (Zero-PII): Maaş, TCKN, IBAN, isim ve tarih gibi veriler asla kaydedilmez.
 * 2. Çerezsiz Çalışma (Cookieless): Hiçbir kullanıcı takip çerezi (cookie) veya kalıcı izleyici saklanmaz.
 * 3. KVKK ve GDPR Tam Uyumu: Yalnızca anonimleştirilmiş sayfa etkileşim oranları ve performans metrikleri.
 */

import { siteConfig } from "@/config/site";

// Kaydedilmesi ve iletilmesi kesinlikle yasaklı hassas veri anahtarları
const SENSITIVE_KEYS = new Set([
  "salary",
  "netsalary",
  "grosssalary",
  "wage",
  "maas",
  "brut",
  "net",
  "tckn",
  "tc",
  "iban",
  "name",
  "surname",
  "isim",
  "email",
  "phone",
  "address",
  "birthdate",
  "startdate",
  "enddate",
]);

/**
 * Gönderilmek istenen olay özelliklerinden hassas verileri filtreler.
 */
export function sanitizeEventProperties(props?: Record<string, unknown>): Record<string, unknown> {
  if (!props) return {};

  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    const lowerKey = key.toLowerCase();

    // Hassas anahtar içeriyorsa veya değer telefon/TCKN benzeri ise atla
    if (SENSITIVE_KEYS.has(lowerKey)) continue;

    if (typeof value === "string") {
      // 11 haneli TCKN veya IBAN benzeri desenleri engelle
      if (/^\d{11}$/.test(value) || /^TR\d{2}/i.test(value)) continue;
      clean[key] = value.slice(0, 100); // Maksimum 100 karakter sınırla
    } else if (typeof value === "number" || typeof value === "boolean") {
      clean[key] = value;
    }
  }

  return clean;
}

/**
 * Gizlilik korumalı ve çerezsiz analitik olayı kaydeder.
 */
export function trackPrivacySafeEvent(eventName: string, props?: Record<string, unknown>): boolean {
  if (!siteConfig.analytics.enabled) return false;
  if (typeof window === "undefined") return false;

  const sanitized = sanitizeEventProperties(props);

  // Cloudflare Web Analytics veya tarayıcı içi anonim olay gönderimi
  try {
    window.dispatchEvent(
      new CustomEvent("hakkimnedir:analytics", {
        detail: { event: eventName, ...sanitized, timestamp: Date.now() },
      })
    );
    return true;
  } catch {
    return false;
  }
}
