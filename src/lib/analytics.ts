/**
 * analytics.ts — KVKK & GDPR Uyumlu Google Analytics 4 (GA4) Sarıcı Modülü
 * Dayanak: 6698 sayılı KVKK md. 5 & GDPR (Önceden Açık Rıza ve Çerez Onayı).
 * Kural: Çerez izni verilmeden GA4 kesinlikle yüklenmez; PII (kişisel veri) filtrelenir.
 */

export const CONSENT_STORAGE_KEY = "cookieConsent";
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Analitiğe gönderilmesi kesinlikle yasaklanan kişisel/hassas veri anahtarları
const FORBIDDEN_KEYS = new Set([
  "salary",
  "maas",
  "ucret",
  "wage",
  "gross",
  "net",
  "grossmonthly",
  "extramonthly",
  "annualbonus",
  "tckn",
  "tc",
  "iban",
  "email",
  "phone",
  "telefon",
  "name",
  "isim",
  "soyisim",
  "startiso",
  "exitiso",
  "date",
  "tarih",
]);

/**
 * Gönderilmek istenen parametreleri tarayarak PII ve hassas alanları filtreler.
 */
export function sanitizeParams(params?: Record<string, any>): Record<string, any> {
  if (!params) return {};
  const clean: Record<string, any> = {};

  for (const [key, val] of Object.entries(params)) {
    const lower = key.toLowerCase();
    if (FORBIDDEN_KEYS.has(lower)) continue;

    if (typeof val === "string") {
      // 11 haneli TCKN veya e-posta benzeri desenleri filtrele
      if (/^\d{11}$/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) continue;
      clean[key] = val.slice(0, 100);
    } else if (typeof val === "number" || typeof val === "boolean") {
      clean[key] = val;
    }
  }

  return clean;
}

/**
 * Kullanıcının analitik çerez onay durumunu kontrol eder.
 */
export function hasCookieConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Çerez onay durumunu localStorage'a kaydeder.
 */
export function setCookieConsent(granted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, String(granted));
  } catch {
    // Depolama erişim hatası sessizce yutulur
  }
}

/**
 * Çerez onayı verildiğinde GA4 scriptini dinamik olarak <head> içine enjekte eder.
 */
export function initGA(measurementId: string = GA_MEASUREMENT_ID): void {
  if (typeof window === "undefined") return;
  if (document.getElementById("ga4-script")) return;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  }
  window.gtag = gtag as any;

  gtag("js", new Date());
  gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: true,
  });

  const script = document.createElement("script");
  script.id = "ga4-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

/**
 * Olay bazlı (event-driven) güvenli analitik gönderici.
 * Çerez onayı yoksa veya SSR ortamındaysa hiçbir istek atmaz.
 */
export const trackEvent = (eventName: string, params?: Record<string, any>): void => {
  if (typeof window === "undefined") return;
  if (!hasCookieConsent()) return;

  const sanitized = sanitizeParams(params);

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, sanitized);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...sanitized });
    }
  } catch {
    // Telemetri hatası kullanıcı deneyimini bozmamalıdır
  }
};
