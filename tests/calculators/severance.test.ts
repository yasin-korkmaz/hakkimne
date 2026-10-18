/**
 * severance.test.ts
 * Kıdem tazminatı hesaplama motoru testleri.
 * Tüm beklenen değerler PRD.md veya prompt'tan alınmıştır (AGENTS.md Kural 4).
 * Testler tests/fixtures/rates.test.json ile çalışır (üretim rates.json'a dokunulmaz).
 */

import { describe, it, expect } from "vitest";
import type { RatesConfig } from "@/lib/config/types";
import { calculateSeverance } from "@/lib/calculators/severance";
import fixtureRaw from "../fixtures/rates.test.json";

const fixture = fixtureRaw as unknown as RatesConfig;

// ─── Senaryo 1: PRD 4 Yıllık Normal ─────────────────────────────────────────
// 2022-08-15 → 2026-08-14 (4y 0m 0d), employer_unfair, brüt 50.000
// Çıkış 2026-08-14 → dönem 2026-2 (Temmuz–Aralık 2026)
// Tavan 73.729,87 > 50.000 → tavan uygulanmaz
// Brüt = 4 × 50.000 = 200.000 | Damga = 200.000 × 0.00759 = 1.518 | Net = 198.482

describe("Senaryo 1 — 4 yıl tam, tavan uygulanmaz", () => {
  const result = calculateSeverance({
    startIso: "2022-08-15",
    exitIso: "2026-08-14",
    terminationReason: "employer_unfair",
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: fixture,
  });

  it("hesaplama başarılı (ok: true)", () => expect(result.ok).toBe(true));
  it("hak kazanıldı (eligible: true)", () => {
    if (result.ok) expect(result.eligible).toBe(true);
  });
  it("tavan uygulanmadı", () => {
    if (result.ok) expect(result.ceilingApplied).toBe(false);
  });
  it("baz = 50000", () => {
    if (result.ok) expect(result.base).toBe(50000);
  });
  it("brüt kıdem = 200000.00", () => {
    if (result.ok) expect(result.grossSeverance).toBe(200000.00);
  });
  it("damga vergisi = 1518.00", () => {
    if (result.ok) expect(result.stampTax).toBe(1518.00);
  });
  it("net kıdem = 198482.00", () => {
    if (result.ok) expect(result.netSeverance).toBe(198482.00);
  });
  it("dönem 2026-2", () => {
    if (result.ok) expect(result.periodId).toBe("2026-2");
  });
  it("süre { years:4, months:0, days:0 }", () => {
    if (result.ok) expect(result.duration).toEqual({ years: 4, months: 0, days: 0 });
  });
});

// ─── Senaryo 2: PRD Tavana Takılan ───────────────────────────────────────────
// 2024-10-01 → 2026-09-30 (2y 0m 0d), retirement_military_marriage
// Giydirilmiş = 90.000 + 5.000 + 60.000/12 = 100.000
// Çıkış 2026-09-30 → dönem 2026-2 (Temmuz–Aralık 2026), tavan 73.729,87
// Baz = 73.729,87 (tavan uygulandı)
// Brüt = 2 × 73.729,87 = 147.459,74 | Damga = 147.459,74 × 0.00759 = 1.119,22 | Net = 146.340,52

describe("Senaryo 2 — tavana takılan, emeklilik", () => {
  const result = calculateSeverance({
    startIso: "2024-10-01",
    exitIso: "2026-09-30",
    terminationReason: "retirement_military_marriage",
    grossSalary: 90000,
    monthlyExtra: 5000,
    annualBonus: 60000,
    rates: fixture,
  });

  it("hesaplama başarılı", () => expect(result.ok).toBe(true));
  it("hak kazanıldı", () => {
    if (result.ok) expect(result.eligible).toBe(true);
  });
  it("tavan uygulandı", () => {
    if (result.ok) expect(result.ceilingApplied).toBe(true);
  });
  it("giydirilmiş brüt = 100000", () => {
    if (result.ok) expect(result.dressedGross).toBe(100000);
  });
  it("baz = 73729.87", () => {
    if (result.ok) expect(result.base).toBe(73729.87);
  });
  it("brüt kıdem = 147459.74", () => {
    if (result.ok) expect(result.grossSeverance).toBe(147459.74);
  });
  it("damga vergisi = 1119.22", () => {
    if (result.ok) expect(result.stampTax).toBe(1119.22);
  });
  it("net kıdem = 146340.52", () => {
    if (result.ok) expect(result.netSeverance).toBe(146340.52);
  });
});

// ─── Senaryo 3: PRD Geçmiş Dönem Tavanı ──────────────────────────────────────
// 2025-03-10 → 2026-03-09 (1y 0m 0d), employer_unfair, brüt 80.000
// Çıkış 2026-03-09 → dönem 2026-1 (Ocak–Haziran 2026), tavan 64.948,77
// Baz = 64.948,77 (tavan uygulandı, 80.000 > 64.948,77)
// Brüt = 1 × 64.948,77 = 64.948,77

describe("Senaryo 3 — geçmiş dönem tavanı (2026-1)", () => {
  const result = calculateSeverance({
    startIso: "2025-03-10",
    exitIso: "2026-03-09",
    terminationReason: "employer_unfair",
    grossSalary: 80000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: fixture,
  });

  it("hesaplama başarılı", () => expect(result.ok).toBe(true));
  it("hak kazanıldı", () => {
    if (result.ok) expect(result.eligible).toBe(true);
  });
  it("dönem 2026-1 uygulandı", () => {
    if (result.ok) expect(result.periodId).toBe("2026-1");
  });
  it("tavan uygulandı", () => {
    if (result.ok) expect(result.ceilingApplied).toBe(true);
  });
  it("baz = 64948.77", () => {
    if (result.ok) expect(result.base).toBe(64948.77);
  });
  it("brüt kıdem = 64948.77", () => {
    if (result.ok) expect(result.grossSeverance).toBe(64948.77);
  });
});

// ─── Hak Edilmeyen Durumlar ───────────────────────────────────────────────────

describe("İstifa (voluntary_resignation) — hak yok", () => {
  const result = calculateSeverance({
    startIso: "2022-08-15",
    exitIso: "2026-08-14",
    terminationReason: "voluntary_resignation",
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: fixture,
  });

  it("ok: true (hata değil, kural gereği 0)", () => expect(result.ok).toBe(true));
  it("eligible: false", () => {
    if (result.ok) expect(result.eligible).toBe(false);
  });
  it("reasonCode: TERMINATION_NOT_ELIGIBLE", () => {
    if (result.ok) expect(result.reasonCode).toBe("TERMINATION_NOT_ELIGIBLE");
  });
  it("netSeverance: 0", () => {
    if (result.ok) expect(result.netSeverance).toBe(0);
  });
});

describe("İşverenin Haklı Feshi (employer_just_cause) — hak yok", () => {
  const result = calculateSeverance({
    startIso: "2022-08-15",
    exitIso: "2026-08-14",
    terminationReason: "employer_just_cause",
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: fixture,
  });

  it("eligible: false", () => {
    if (result.ok) expect(result.eligible).toBe(false);
  });
  it("reasonCode: TERMINATION_NOT_ELIGIBLE", () => {
    if (result.ok) expect(result.reasonCode).toBe("TERMINATION_NOT_ELIGIBLE");
  });
  it("netSeverance: 0", () => {
    if (result.ok) expect(result.netSeverance).toBe(0);
  });
});

describe("1 Yıldan Az Çalışma — hak yok (365 gün ama 0y 11m 28d)", () => {
  // 2023-03-01 → 2024-02-28 = {years:0, months:11, days:28}
  // Dönem: 2024-02-28 fixture'da yok (2025-07-01'den başlıyor)
  // Bunun yerine fixture içindeki bir döneme giren ama 1 yıldan az olan tarih kullanalım
  // 2025-08-01 → 2026-06-30 = 10 ay 29 gün (0 yıl)
  const result = calculateSeverance({
    startIso: "2025-08-01",
    exitIso: "2026-06-30",
    terminationReason: "employer_unfair",
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: fixture,
  });

  it("ok: true", () => expect(result.ok).toBe(true));
  it("eligible: false", () => {
    if (result.ok) expect(result.eligible).toBe(false);
  });
  it("reasonCode: UNDER_ONE_YEAR", () => {
    if (result.ok) expect(result.reasonCode).toBe("UNDER_ONE_YEAR");
  });
  it("netSeverance: 0", () => {
    if (result.ok) expect(result.netSeverance).toBe(0);
  });
});

// ─── Doğrulama Kilidi Hatası ──────────────────────────────────────────────────

describe("Doğrulama kilidi — stamp_tax verified:false", () => {
  const brokenRates: RatesConfig = {
    ...fixture,
    stamp_tax: { ...fixture.stamp_tax, verified: false },
  };

  const result = calculateSeverance({
    startIso: "2022-08-15",
    exitIso: "2026-08-14",
    terminationReason: "employer_unfair",
    grossSalary: 50000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: brokenRates,
  });

  it("ok: false (hesaplama yapılmadı)", () => expect(result.ok).toBe(false));
  it("code: STAMP_TAX_UNVERIFIED", () => {
    if (!result.ok) expect(result.code).toBe("STAMP_TAX_UNVERIFIED");
  });
});
