/**
 * compensation.test.ts
 * Birleşik hesaplayıcı testleri.
 * Tüm beklenen değerler PRD.md veya prompt'tan alınmıştır (AGENTS.md Kural 4).
 */

import { describe, it, expect } from "vitest";
import type { RatesConfig } from "@/lib/config/types";
import { calculateCompensation } from "@/lib/calculators/compensation";
import fixtureRaw from "../fixtures/rates.test.json";

const fixture = fixtureRaw as unknown as RatesConfig;

// ─── Senaryo 1: Tam Birleşik Hesap ───────────────────────────────────────────
// Kıdem: grossSeverance = 200000.00, stampTax = 1518.00, netSeverance = 198482.00
// İhbar: grossNotice = 93333.33, stampTax = 708.40, estimatedNetNotice = 78624.93
// Toplam brüt = 200000.00 + 93333.33 = 293333.33
// Toplam damga = 1518.00 + 708.40 = 2226.40
// Toplam net = 198482.00 + 78624.93 = 277106.93

describe("Senaryo 1 — birleşik hesap (kıdem + ihbar)", () => {
  const result = calculateCompensation({
    startIso: "2022-08-15",
    exitIso: "2026-08-14",
    terminationReason: "employer_unfair",
    noticeWorked: false,
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    selectedIncomeTaxRate: 0.15,
    rates: fixture,
  });

  it("hesaplama başarılı (ok: true)", () => expect(result.ok).toBe(true));

  it("kıdem brüt = 200000.00", () => {
    if (result.ok && result.severance.ok && result.severance.eligible) {
      expect(result.severance.grossSeverance).toBe(200000.00);
    }
  });

  it("ihbar brüt = 93333.33", () => {
    if (result.ok && result.notice.ok && result.notice.eligible) {
      expect(result.notice.grossNotice).toBe(93333.33);
    }
  });

  it("toplam brüt = 293333.33", () => {
    if (result.ok) expect(result.totals.totalGross).toBe(293333.33);
  });

  it("toplam damga vergisi = 2226.40", () => {
    if (result.ok) expect(result.totals.totalStampTax).toBe(2226.40);
  });

  it("toplam tahmini net = 277106.93", () => {
    if (result.ok) expect(result.totals.totalEstimatedNet).toBe(277106.93);
  });
});

// ─── Emeklilik: Yalnızca Kıdem, İhbar Sıfır ──────────────────────────────────

describe("Emeklilik — yalnızca kıdem (ihbar hak yok)", () => {
  const result = calculateCompensation({
    startIso: "2024-10-01",
    exitIso: "2026-09-30",
    terminationReason: "retirement_military_marriage",
    noticeWorked: false,
    grossSalary: 90000,
    monthlyExtra: 5000,
    annualBonus: 60000,
    rates: fixture,
  });

  it("hesaplama başarılı", () => expect(result.ok).toBe(true));

  it("kıdem eligible: true", () => {
    if (result.ok && result.severance.ok) expect(result.severance.eligible).toBe(true);
  });

  it("ihbar eligible: false", () => {
    if (result.ok && result.notice.ok) expect(result.notice.eligible).toBe(false);
  });

  it("toplam brüt ihbar kısmı = 0", () => {
    if (result.ok) expect(result.totals.totalGrossNotice).toBe(0);
  });

  it("toplam brüt = yalnızca kıdem brütü", () => {
    if (result.ok && result.severance.ok && result.severance.eligible) {
      expect(result.totals.totalGross).toBe(result.severance.grossSeverance);
    }
  });
});

// ─── Kilit Hatası: Hesaplama Yapılmamalı ─────────────────────────────────────

describe("Doğrulama kilidi hatası — compensation ok:false döner", () => {
  const broken: RatesConfig = {
    ...fixture,
    stamp_tax: { ...fixture.stamp_tax, verified: false },
  };

  const result = calculateCompensation({
    startIso: "2022-08-15",
    exitIso: "2026-08-14",
    terminationReason: "employer_unfair",
    noticeWorked: false,
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: broken,
  });

  it("ok: false", () => expect(result.ok).toBe(false));
  it("code: STAMP_TAX_UNVERIFIED", () => {
    if (!result.ok) expect(result.code).toBe("STAMP_TAX_UNVERIFIED");
  });
});
