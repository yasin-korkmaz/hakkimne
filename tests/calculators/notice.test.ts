/**
 * notice.test.ts
 * İhbar tazminatı motoru testleri.
 * Tüm beklenen değerler PRD.md veya prompt'tan alınmıştır (AGENTS.md Kural 4).
 * Testler tests/fixtures/rates.test.json ile çalışır.
 */

import { describe, it, expect } from "vitest";
import type { RatesConfig } from "@/lib/config/types";
import { calculateNotice } from "@/lib/calculators/notice";
import fixtureRaw from "../fixtures/rates.test.json";

const fixture = fixtureRaw as unknown as RatesConfig;

// ─── Senaryo 1: 4 Yıl, Brüt 50.000, %15 Gelir Vergisi ───────────────────────
// 2022-08-15 → 2026-08-14 (4y 0m 0d) > 36 ay → 8 hafta (56 gün)
// Giydirilmiş = 50.000
// Günlük = 50000 / 30 = 1666.666...
// Brüt = 1666.666... × 56 = 93333.333... → roundToKurus = 93333.33
// Gelir Vergisi = 93333.333... × 0.15 = 14000.000... → 14000.00
// Damga Vergisi = 93333.333... × 0.00759 = 708.40... → 708.40
// Net = 93333.333... − 14000 − 708.40... = 78624.933... → 78624.93

describe("Senaryo 1 — 4 yıl employer_unfair, ihbar kullandırılmadı", () => {
  const result = calculateNotice({
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
  it("hak kazanıldı (eligible: true)", () => {
    if (result.ok) expect(result.eligible).toBe(true);
  });
  it("8 hafta (56 gün)", () => {
    if (result.ok && result.eligible) {
      expect(result.noticeWeeks).toBe(8);
      expect(result.noticeDays).toBe(56);
    }
  });
  it("brüt ihbar = 93333.33", () => {
    if (result.ok && result.eligible) expect(result.grossNotice).toBe(93333.33);
  });
  it("gelir vergisi = 14000.00", () => {
    if (result.ok && result.eligible) expect(result.incomeTax).toBe(14000.00);
  });
  it("damga vergisi = 708.40", () => {
    if (result.ok && result.eligible) expect(result.stampTax).toBe(708.40);
  });
  it("tahmini net ihbar = 78624.93", () => {
    if (result.ok && result.eligible) expect(result.estimatedNetNotice).toBe(78624.93);
  });
});

// ─── Kademe Sınırı: Tam 36 Ay (6 Hafta) ──────────────────────────────────────
// Giriş 2023-01-10, Çıkış 2026-01-09 → end = 2026-01-10 = start + 36ay → tam 36 ay → 6 hafta

describe("Tam 36 ay sınırı — 6 hafta (42 gün)", () => {
  const result = calculateNotice({
    startIso: "2023-01-10",
    exitIso: "2026-01-09",
    terminationReason: "employer_unfair",
    noticeWorked: false,
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: fixture,
  });

  it("hesaplama başarılı", () => expect(result.ok).toBe(true));
  it("6 hafta (42 gün)", () => {
    if (result.ok && result.eligible) {
      expect(result.noticeWeeks).toBe(6);
      expect(result.noticeDays).toBe(42);
    }
  });
});

// ─── Kademe Sınırı: 36 Ay + 1 Gün (8 Hafta) ─────────────────────────────────
// Giriş 2023-01-10, Çıkış 2026-01-10 → end = 2026-01-11 > start + 36ay → 8 hafta

describe("36 ay + 1 gün — 8 hafta (56 gün)", () => {
  const result = calculateNotice({
    startIso: "2023-01-10",
    exitIso: "2026-01-10",
    terminationReason: "employer_unfair",
    noticeWorked: false,
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: fixture,
  });

  it("hesaplama başarılı", () => expect(result.ok).toBe(true));
  it("8 hafta (56 gün)", () => {
    if (result.ok && result.eligible) {
      expect(result.noticeWeeks).toBe(8);
      expect(result.noticeDays).toBe(56);
    }
  });
});

// ─── İhbar Öneli Kullandırıldı ────────────────────────────────────────────────

describe("İhbar öneli kullandırıldı (noticeWorked: true)", () => {
  const result = calculateNotice({
    startIso: "2022-08-15",
    exitIso: "2026-08-14",
    terminationReason: "employer_unfair",
    noticeWorked: true,
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: fixture,
  });

  it("ok: true", () => expect(result.ok).toBe(true));
  it("eligible: false", () => {
    if (result.ok) expect(result.eligible).toBe(false);
  });
  it("grossNotice: 0", () => {
    if (result.ok) expect(result.grossNotice).toBe(0);
  });
});

// ─── Hak Edilmeyen Fesih Nedenleri ───────────────────────────────────────────

describe("Emeklilik (retirement_military_marriage) — ihbar yok", () => {
  const result = calculateNotice({
    startIso: "2022-08-15",
    exitIso: "2026-08-14",
    terminationReason: "retirement_military_marriage",
    noticeWorked: false,
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: fixture,
  });

  it("eligible: false", () => {
    if (result.ok) expect(result.eligible).toBe(false);
  });
  it("grossNotice: 0", () => {
    if (result.ok) expect(result.grossNotice).toBe(0);
  });
});

describe("İstifa (voluntary_resignation) — ihbar yok", () => {
  const result = calculateNotice({
    startIso: "2022-08-15",
    exitIso: "2026-08-14",
    terminationReason: "voluntary_resignation",
    noticeWorked: false,
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: fixture,
  });

  it("eligible: false", () => {
    if (result.ok) expect(result.eligible).toBe(false);
  });
  it("grossNotice: 0", () => {
    if (result.ok) expect(result.grossNotice).toBe(0);
  });
});

describe("İşçinin haklı feshi (employee_just_cause) — ihbar yok", () => {
  const result = calculateNotice({
    startIso: "2022-08-15",
    exitIso: "2026-08-14",
    terminationReason: "employee_just_cause",
    noticeWorked: false,
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: fixture,
  });

  it("eligible: false", () => {
    if (result.ok) expect(result.eligible).toBe(false);
  });
  it("grossNotice: 0", () => {
    if (result.ok) expect(result.grossNotice).toBe(0);
  });
});

// ─── Doğrulama Kilidi Hatası ──────────────────────────────────────────────────

describe("Doğrulama kilidi — notice_weeks verified:false", () => {
  const broken: RatesConfig = {
    ...fixture,
    notice_weeks: { ...fixture.notice_weeks, verified: false },
  };

  const result = calculateNotice({
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
  it("code: NOTICE_UNVERIFIED", () => {
    if (!result.ok) expect(result.code).toBe("NOTICE_UNVERIFIED");
  });
});
