/**
 * analytics.test.ts — GA4 Wrapper ve KVKK Çerez Analitik Testleri
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  trackEvent,
  sanitizeParams,
  hasCookieConsent,
  setCookieConsent,
  initGA,
  CONSENT_STORAGE_KEY,
} from "@/lib/analytics";

describe("analytics.ts — KVKK & GDPR Güvenlik Testleri", () => {
  beforeEach(() => {
    localStorage.clear();
    delete (window as any).gtag;
    delete (window as any).dataLayer;
    const existingScript = document.getElementById("ga4-script");
    if (existingScript) existingScript.remove();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sanitizeParams hassas maaş ve kişisel verileri kesinlikle filtrelemeli", () => {
    const raw = {
      salary: 50000,
      grossMonthly: "60.000 TL",
      email: "test@domain.com",
      tckn: "12345678901",
      button_name: "calculate",
      service_type: "severance",
      is_valid: true,
    };

    const clean = sanitizeParams(raw);

    expect(clean.salary).toBeUndefined();
    expect(clean.grossMonthly).toBeUndefined();
    expect(clean.email).toBeUndefined();
    expect(clean.tckn).toBeUndefined();
    expect(clean.button_name).toBe("calculate");
    expect(clean.service_type).toBe("severance");
    expect(clean.is_valid).toBe(true);
  });

  it("çerez onayı yokken trackEvent hiçbir işlem yapmamalı", () => {
    const gtagSpy = vi.fn();
    (window as any).gtag = gtagSpy;

    trackEvent("calc_start", { step: 1 });
    expect(gtagSpy).not.toHaveBeenCalled();
  });

  it("çerez onayı verildiğinde trackEvent window.gtag'i çağırmalı", () => {
    setCookieConsent(true);
    const gtagSpy = vi.fn();
    (window as any).gtag = gtagSpy;

    trackEvent("calc_start", { step: 1 });
    expect(gtagSpy).toHaveBeenCalledTimes(1);
    expect(gtagSpy).toHaveBeenCalledWith("event", "calc_start", { step: 1 });
  });

  it("hasCookieConsent ve setCookieConsent localStorage ile uyumlu çalışmalı", () => {
    expect(hasCookieConsent()).toBe(false);

    setCookieConsent(true);
    expect(hasCookieConsent()).toBe(true);
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("true");

    setCookieConsent(false);
    expect(hasCookieConsent()).toBe(false);
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("false");
  });

  it("initGA fonksiyonu <head> içine tek bir ga4-script eklemeli", () => {
    expect(document.getElementById("ga4-script")).toBeNull();

    initGA("G-TEST123456");
    const script = document.getElementById("ga4-script") as HTMLScriptElement;
    expect(script).not.toBeNull();
    expect(script.src).toContain("id=G-TEST123456");

    // İkinci çağrıda duplicate script eklememeli
    initGA("G-TEST123456");
    expect(document.querySelectorAll("#ga4-script").length).toBe(1);
  });
});
