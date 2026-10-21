/**
 * compensation.test.ts
 * Birleşik tazminat servisi (calculateCompensation) testleri.
 * Tüm beklenen değerler PRD.md veya prompt'tan alınmıştır (AGENTS.md Kural 4).
 */

import { describe, it, expect } from "vitest";
import type { RatesConfig } from "@/lib/config/types";
import {
  calculateCompensation,
  calculateCompensationTotals,
} from "@/lib/calculators/compensation";
import fixtureRaw from "../fixtures/rates.test.json";

const fixture = fixtureRaw as unknown as RatesConfig;

// ─── Senaryo 1: Tam Birleşik Hesap ───────────────────────────────────────────
// Kıdem: grossSeverance = 200000.00, stampTax = 1518.00, netSeverance = 198482.00
// İhbar: grossNotice = 93333.33, stampTax = 708.40, estimatedNetNotice = 78624.93
// Toplam brüt = 200000.00 + 93333.33 = 293333.33
// Toplam damga = 1518.00 + 708.40 = 2226.40
// Toplam net = 198482.00 + 78624.93 = 277106.93

describe("Senaryo 1 — birleşik servis hesabı (kıdem + ihbar)", () => {
  const result = calculateCompensation(
    {
      reason: "employer_unfair",
      noticeUsed: "no",
      startIso: "2022-08-15",
      exitIso: "2026-08-14",
      grossMonthly: "50.000",
      extraMonthly: 0,
      annualBonus: 0,
      incomeTaxRate: 0.15,
    },
    fixture
  );

  it("servis başarılı sonuç dönmeli (status: 'ok')", () => {
    expect(result.status).toBe("ok");
  });

  it("kıdem brüt = 200.000,00 TL", () => {
    if (result.status === "ok") {
      expect(result.severance.grossSeverance).toBe(200000.00);
      expect(result.severance.stampTax).toBe(1518.00);
      expect(result.severance.netSeverance).toBe(198482.00);
    }
  });

  it("ihbar brüt = 93.333,33 TL", () => {
    if (result.status === "ok") {
      expect(result.notice.grossNotice).toBe(93333.33);
      expect(result.notice.stampTax).toBe(708.40);
      expect(result.notice.estimatedNetNotice).toBe(78624.93);
    }
  });

  it("toplam brüt = 293.333,33 TL doğrulanmalı", () => {
    if (result.status === "ok") {
      const totals = calculateCompensationTotals(result.severance, result.notice);
      expect(totals.totalGross).toBe(293333.33);
      expect(totals.totalStampTax).toBe(2226.40);
      expect(totals.totalEstimatedNet).toBe(277106.93);
    }
  });
});

// ─── Emeklilik: Yalnızca Kıdem, İhbar Sıfır ──────────────────────────────────

describe("Emeklilik — yalnızca kıdem hak edilir, ihbar 0 TL", () => {
  const result = calculateCompensation(
    {
      reason: "retirement_military_marriage",
      startIso: "2024-10-01",
      exitIso: "2026-09-30",
      grossMonthly: "90.000",
      extraMonthly: "5.000",
      annualBonus: "60.000",
    },
    fixture
  );

  it("status: 'ok' dönmeli", () => {
    expect(result.status).toBe("ok");
  });

  it("kıdem eligible: true, ihbar eligible: false olmalı", () => {
    if (result.status === "ok") {
      expect(result.severance.eligible).toBe(true);
      expect(result.severance.grossSeverance).toBe(147459.74);
      expect(result.notice.eligible).toBe(false);
      expect(result.notice.grossNotice).toBe(0);

      const totals = calculateCompensationTotals(result.severance, result.notice);
      expect(totals.totalGross).toBe(147459.74);
    }
  });
});

// ─── Unsure Reason Durumu ───────────────────────────────────────────────────

describe("Diğer / Emin Değilim durumu (other_unsure)", () => {
  const result = calculateCompensation(
    {
      reason: "other_unsure",
      startIso: "2022-08-15",
      exitIso: "2026-08-14",
      grossMonthly: 50000,
    },
    fixture
  );

  it("status: 'unsure_reason' dönmeli ve tutar hesaplanmamalı", () => {
    expect(result.status).toBe("unsure_reason");
  });
});

// ─── Geçersiz Girdi Durumu (invalid_input) ───────────────────────────────────

describe("Geçersiz girdi — invalid_input dönmeli", () => {
  const result = calculateCompensation(
    {
      reason: "employer_unfair",
      // noticeUsed eksik
      startIso: "2022-08-15",
      exitIso: "2026-08-14",
      grossMonthly: 0, // geçersiz maaş
    },
    fixture
  );

  it("status: 'invalid_input' ve alan hataları dönmeli", () => {
    expect(result.status).toBe("invalid_input");
    if (result.status === "invalid_input") {
      expect(result.fieldErrors["noticeUsed"]).toBeDefined();
      expect(result.fieldErrors["grossMonthly"]).toBeDefined();
    }
  });
});

// ─── Doğrulama Kilidi Engeli (blocked) ───────────────────────────────────────

describe("Doğrulama kilidi engeli — blocked dönmeli", () => {
  const broken: RatesConfig = {
    ...fixture,
    stamp_tax: { ...fixture.stamp_tax, verified: false },
  };

  const result = calculateCompensation(
    {
      reason: "employer_unfair",
      noticeUsed: "no",
      startIso: "2022-08-15",
      exitIso: "2026-08-14",
      grossMonthly: 50000,
    },
    broken
  );

  it("status: 'blocked' ve kilit hata kodu dönmeli", () => {
    expect(result.status).toBe("blocked");
    if (result.status === "blocked") {
      expect(result.code).toBe("STAMP_TAX_UNVERIFIED");
    }
  });
});
