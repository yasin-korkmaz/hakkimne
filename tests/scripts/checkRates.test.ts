/**
 * checkRates.test.ts — Oran Doğrulama Betiği Birim Testleri
 * Dayanak: AGENTS.md Kural 2 & 3 ve Görev 19 gereksinimleri.
 */

import { describe, it, expect } from "vitest";

// @ts-expect-error - scripts/check-rates.mjs saf ES modülüdür
import { validateRates } from "../../scripts/check-rates.mjs";

const mockValidRates = {
  meta: {
    rules_version: "2026-2",
    last_updated: "2026-10-18",
    legal_sources: {
      severance: "1475 md. 14",
      notice: "4857 md. 17",
      tax: "193 & 488 sayılı kanunlar",
    },
  },
  stamp_tax: {
    rate: 0.00759,
    verified: true,
    source_url: "https://resmigazete.gov.tr/damga-vergisi",
  },
  severance_ceiling_periods: [
    {
      period_id: "2026-2",
      label: "Temmuz - Aralık 2026",
      from: "2026-07-01",
      to: "2026-12-31",
      amount_try: 73729.87,
      verified: true,
      source_url: "https://hmb.gov.tr/genelge-2026-2",
    },
    {
      period_id: "2027-1",
      label: "Ocak - Haziran 2027",
      from: "2027-01-01",
      to: "2027-06-30",
      amount_try: 85000.0,
      verified: true,
      source_url: "https://hmb.gov.tr/genelge-2027-1",
    },
  ],
  notice_weeks: {
    less_than_6_months: 2,
    from_6_to_18_months: 4,
    from_18_to_36_months: 6,
    more_than_36_months: 8,
    verified: true,
  },
  income_tax_rates_for_estimate: {
    rates: [0.15, 0.2, 0.27, 0.35, 0.4],
    default_rate: 0.15,
    verified: true,
  },
};

describe("Oran Doğrulama Betiği (validateRates)", () => {
  const referenceDate = new Date("2026-10-21");

  it("tüm kurallar sağlandığında doğrulama başarılı (ok: true) olmalı", () => {
    const res = validateRates(mockValidRates, referenceDate);
    expect(res.ok).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("Kural (a): herhangi bir nesnede verified: false varsa hata fırlatmalı", () => {
    const invalidA = {
      ...mockValidRates,
      stamp_tax: { ...mockValidRates.stamp_tax, verified: false },
    };
    const resA = validateRates(invalidA, referenceDate);
    expect(resA.ok).toBe(false);
    expect(resA.errors.some((e: string) => e.includes("stamp_tax.verified: false"))).toBe(true);

    const invalidPeriod = {
      ...mockValidRates,
      severance_ceiling_periods: [
        { ...mockValidRates.severance_ceiling_periods[0], verified: false },
        mockValidRates.severance_ceiling_periods[1],
      ],
    };
    const resPeriod = validateRates(invalidPeriod, referenceDate);
    expect(resPeriod.ok).toBe(false);
    expect(resPeriod.errors.some((e: string) => e.includes('dönemi "2026-2" doğrulanmamış'))).toBe(true);
  });

  it("Kural (b): source_url 'DOĞRULANACAK' veya geçersiz/boş ise hata vermeli", () => {
    const invalidUrl1 = {
      ...mockValidRates,
      stamp_tax: { ...mockValidRates.stamp_tax, source_url: "DOĞRULANACAK: resmigazete" },
    };
    const res1 = validateRates(invalidUrl1, referenceDate);
    expect(res1.ok).toBe(false);
    expect(res1.errors.some((e: string) => e.includes("Damga vergisi kaynak URL"))).toBe(true);

    const invalidUrl2 = {
      ...mockValidRates,
      severance_ceiling_periods: [
        { ...mockValidRates.severance_ceiling_periods[0], source_url: "" },
        mockValidRates.severance_ceiling_periods[1],
      ],
    };
    const res2 = validateRates(invalidUrl2, referenceDate);
    expect(res2.ok).toBe(false);
    expect(res2.errors.some((e: string) => e.includes('dönemi "2026-2" kaynak URL'))).toBe(true);
  });

  it("Kural (c): meta.last_updated 60 günden daha eski ise hata vermeli", () => {
    const oldMetaRates = {
      ...mockValidRates,
      meta: {
        ...mockValidRates.meta,
        last_updated: "2026-07-01", // 21 Ekim'e göre ~112 gün eski
      },
    };
    const res = validateRates(oldMetaRates, referenceDate);
    expect(res.ok).toBe(false);
    expect(res.errors.some((e: string) => e.includes("60 günden daha eski"))).toBe(true);
  });

  it("Kural (d): bugünün tarihine denk gelen geçerli tavan dönemi yoksa hata vermeli", () => {
    // 2028 yılında çalıştırıldığını simüle et
    const futureDate = new Date("2028-05-15");
    const res = validateRates(mockValidRates, futureDate);
    expect(res.ok).toBe(false);
    expect(res.errors.some((e: string) => e.includes("Bugünün tarihine (2028-05-15) denk gelen"))).toBe(true);
  });

  it("Kural (e): dönem 45 gün içinde bitiyor ve sonraki dönem tanımlı/doğrulanmış değilse hata vermeli", () => {
    // 2026-12-01 tarihi 2026-12-31'e 30 gün uzaklıktadır (<= 45 gün)
    const lateDecember = new Date("2026-12-01");

    // Sonraki dönem hiç tanımlanmamışsa
    const missingNext = {
      ...mockValidRates,
      severance_ceiling_periods: [mockValidRates.severance_ceiling_periods[0]],
    };
    const resMissing = validateRates(missingNext, lateDecember);
    expect(resMissing.ok).toBe(false);
    expect(resMissing.errors.some((e: string) => e.includes("sonraki dönem tanımlanmamış"))).toBe(true);

    // Sonraki dönem tanımlanmış ama verified: false ise
    const unverifiedNext = {
      ...mockValidRates,
      severance_ceiling_periods: [
        mockValidRates.severance_ceiling_periods[0],
        { ...mockValidRates.severance_ceiling_periods[1], verified: false },
      ],
    };
    const resUnverified = validateRates(unverifiedNext, lateDecember);
    expect(resUnverified.ok).toBe(false);
    expect(resUnverified.errors.some((e: string) => e.includes("henüz doğrulanmamış (verified: false)"))).toBe(true);
  });
});
