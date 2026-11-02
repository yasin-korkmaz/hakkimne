/**
 * legalEdgeCases.test.ts
 * FAZ 2 Hukuki Güven ve Sınır Durumları Birim Testleri.
 * Dayanak: 1475 md. 14, 4857 md. 17, 41, 53, 59 & Yargıtay içtihatları.
 */

import { describe, it, expect } from "vitest";
import type { RatesConfig } from "@/lib/config/types";
import { calculateSeverance } from "@/lib/calculators/severance";
import { calculateNotice } from "@/lib/calculators/notice";
import { calculateAnnualLeave } from "@/features/annual-leave";
import { calculateOvertime } from "@/features/overtime";
import { computeDuration } from "@/lib/utils/dateDuration";
import fixtureRaw from "../fixtures/rates.test.json";

const fixture = fixtureRaw as unknown as RatesConfig;

describe("FAZ 2: 1 Günlük Hizmet Farkı ve 1 Yıllık Kıdem Eşiği (1475 md. 14)", () => {
  it("364 gün çalışma (1 gün eksik) kıdem tazminatına hak kazandırmaz", () => {
    const res = calculateSeverance({
      startIso: "2025-01-01",
      exitIso: "2025-12-30", // 0 yıl 11 ay 29 gün
      terminationReason: "employer_unfair",
      grossSalary: 50000,
      monthlyExtra: 0,
      annualBonus: 0,
      rates: fixture,
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.eligible).toBe(false);
      expect(res.reasonCode).toBe("UNDER_ONE_YEAR");
      expect(res.netSeverance).toBe(0);
    }
  });

  it("tam 365 gün (tam 1 yıl) dolduğu gün kıdem tazminatına hak kazanılır", () => {
    const res = calculateSeverance({
      startIso: "2025-01-01",
      exitIso: "2025-12-31", // tam 1y 0m 0d
      terminationReason: "employer_unfair",
      grossSalary: 50000,
      monthlyExtra: 0,
      annualBonus: 0,
      rates: fixture,
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.eligible).toBe(true);
      expect(res.duration.years).toBe(1);
      expect(res.grossSeverance).toBe(50000);
      expect(res.stampTax).toBe(379.5); // 50000 * 0.00759
      expect(res.netSeverance).toBe(49620.5);
    }
  });
});

describe("FAZ 2: Kıdem Tavanı Altı ve Üstü Ücret Senaryoları", () => {
  it("tavan altı maaşta gerçek brüt esas alınır ve tavan uyarısı oluşmaz", () => {
    const res = calculateSeverance({
      startIso: "2025-07-01",
      exitIso: "2026-07-01", // 1y 0m 1d, 2026-2 dönemi tavanı: 73729.87
      terminationReason: "employer_unfair",
      grossSalary: 40000,
      monthlyExtra: 0,
      annualBonus: 0,
      rates: fixture,
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.ceilingApplied).toBe(false);
      expect(res.base).toBe(40000);
    }
  });

  it("tavan üstü maaşta brüt maaş yerine resmi tavan tutarı baz alınır", () => {
    const res = calculateSeverance({
      startIso: "2025-07-01",
      exitIso: "2026-07-01",
      terminationReason: "employer_unfair",
      grossSalary: 120000,
      monthlyExtra: 0,
      annualBonus: 0,
      rates: fixture,
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.ceilingApplied).toBe(true);
      expect(res.base).toBe(73729.87); // 2026-2 tavanı
    }
  });
});

describe("FAZ 2: Yıllık İzin 5 ve 15 Yıl Kademeleri (4857 md. 53)", () => {
  it("tam 5. yıl (5 dahil): 5 x 14 = 70 gün", () => {
    const res = calculateAnnualLeave({ completedYears: 5, age: 30 });
    expect(res.totalEarnedDays).toBe(70);
    expect(res.breakdown[4]!.earnedDays).toBe(14);
  });

  it("6. yıl (5 yılı aşan kısım): 5 x 14 + 1 x 20 = 90 gün", () => {
    const res = calculateAnnualLeave({ completedYears: 6, age: 31 });
    expect(res.totalEarnedDays).toBe(90);
    expect(res.breakdown[5]!.earnedDays).toBe(20);
  });

  it("tam 14. yıl: 5 x 14 + 9 x 20 = 250 gün", () => {
    const res = calculateAnnualLeave({ completedYears: 14, age: 40 });
    expect(res.totalEarnedDays).toBe(250);
    expect(res.breakdown[13]!.earnedDays).toBe(20);
  });

  it("tam 15. yıl (15 dahil ve üzeri): 5 x 14 + 9 x 20 + 1 x 26 = 276 gün", () => {
    const res = calculateAnnualLeave({ completedYears: 15, age: 41 });
    expect(res.totalEarnedDays).toBe(276);
    expect(res.breakdown[14]!.earnedDays).toBe(26);
  });
});

describe("FAZ 2: İhbar Tazminatında Esnek Gelir Vergisi Oran Gösterimi", () => {
  const commonInput = {
    startIso: "2025-01-01",
    exitIso: "2026-06-30", // 4 hafta ihbar
    terminationReason: "employer_unfair" as const,
    noticeWorked: false,
    grossSalary: 30000,
    monthlyExtra: 0,
    annualBonus: 0,
    rates: fixture,
  };

  it("%15 başlangıç diliminde doğru vergi hesaplanmalı", () => {
    const res = calculateNotice({ ...commonInput, selectedIncomeTaxRate: 0.15 });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.incomeTax).toBeCloseTo(res.grossNotice * 0.15, 2);
      expect(res.estimatedNetNotice).toBeCloseTo(res.grossNotice - res.incomeTax - res.stampTax, 2);
    }
  });

  it("%20 üst vergi diliminde net tutar esnek olarak değişmeli", () => {
    const res = calculateNotice({ ...commonInput, selectedIncomeTaxRate: 0.20 });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.incomeTax).toBeCloseTo(res.grossNotice * 0.20, 2);
      expect(res.estimatedNetNotice).toBeCloseTo(res.grossNotice - res.incomeTax - res.stampTax, 2);
    }
  });
});

describe("FAZ 2: Artık Yıl (Leap Year) Takvim Hesaplamaları", () => {
  it("2024 artık yılında 29 Şubat geçişi tam hesaplanmalı (çıkış günü dahil)", () => {
    // 29 Şubat 2024 başlangıçlı bir iş ilişkisinde 1 tam yıl 27 Şubat 2025'te tamamlanır
    const dur1 = computeDuration("2024-02-29", "2025-02-27");
    expect(dur1).toEqual({ years: 1, months: 0, days: 0 });

    // 28 Şubat 2025 çıkışta 1 yıl 1 gün olur
    const dur2 = computeDuration("2024-02-29", "2025-02-28");
    expect(dur2).toEqual({ years: 1, months: 0, days: 1 });
  });

  it("artık yıldan artık yıla tam 4 yıllık hesaplama", () => {
    // 29 Şubat 2024 -> 28 Şubat 2028 tam 4 yıl (2028-02-29 dahil bitiş sınırı)
    const dur = computeDuration("2024-02-29", "2028-02-28");
    expect(dur).toEqual({ years: 4, months: 0, days: 0 });
  });
});

describe("FAZ 2: Fazla Mesai 225 Saat ve %25 / %50 Çarpanları (4857 md. 41)", () => {
  it("40 saat sözleşme ve 48 saat çalışma ile %25 ve %50 zam ayrımı", () => {
    const res = calculateOvertime({
      grossSalary: 45000, // Saatlik = 45000 / 225 = 200 TL
      weeklyContractHours: 40,
      weeklyWorkedHours: 48,
    });
    expect(res.ok).toBe(true);
    expect(res.hourlyGrossRate).toBe(200);
    expect(res.extraHours25).toBe(5); // 40 -> 45
    expect(res.extraHours50).toBe(3); // 45 -> 48
    expect(res.grossPay25).toBe(5 * 200 * 1.25); // 1250 TL
    expect(res.grossPay50).toBe(3 * 200 * 1.50); // 900 TL
    expect(res.totalGrossOvertimePay).toBe(2150);
  });
});
