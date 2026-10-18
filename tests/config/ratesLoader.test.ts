/**
 * ratesLoader.test.ts
 * Oran yükleyici ve doğrulama kilidi testleri.
 * Tüm beklenen değerler prompt'tan alınmıştır; kendin üretilmemiştir (AGENTS.md Kural 4).
 * Testler tests/fixtures/rates.test.json üzerinde çalışır (üretim rates.json'a dokunulmaz).
 */

import { describe, it, expect } from "vitest";
import type { RatesConfig } from "@/lib/config/types";
import { validateRatesConfig } from "@/lib/config/loadRates";
import { selectCeilingPeriod } from "@/lib/config/selectCeilingPeriod";
import { verifyStampTax, verifyNoticeWeeks, verifyIncomeTax } from "@/lib/config/verifyLock";
import fixtureRaw from "../fixtures/rates.test.json";

// Fixture'ı RatesConfig olarak kullan (tüm mevcut dönemler verified: true)
const fixture = fixtureRaw as unknown as RatesConfig;

// ─── 1. validateRatesConfig — Üretim rates.json biçim testi ─────────────────

describe("validateRatesConfig — üretim rates.json", () => {
  it("üretim rates.json CONFIG_INVALID döndürmemeli", async () => {
    const raw = await import("@/config/rates.json");
    const result = validateRatesConfig(raw.default ?? raw);
    // verified: false bekleniyor, ama yapı geçerli olmalı
    expect(result.ok).toBe(true);
  });
});

// ─── 2. selectCeilingPeriod — Dönem eşleştirme ──────────────────────────────

describe("selectCeilingPeriod — doğru dönem eşleştirmeleri", () => {
  it("2026-06-30 -> 2026-1 dönemini bulmalı", () => {
    const result = selectCeilingPeriod(fixture, "2026-06-30");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.period.period_id).toBe("2026-1");
  });

  it("2026-07-01 -> 2026-2 dönemini bulmalı", () => {
    const result = selectCeilingPeriod(fixture, "2026-07-01");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.period.period_id).toBe("2026-2");
  });

  it("2025-12-31 -> 2025-2 dönemini bulmalı", () => {
    const result = selectCeilingPeriod(fixture, "2025-12-31");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.period.period_id).toBe("2025-2");
  });

  it("2026-01-01 -> 2026-1 dönemini bulmalı", () => {
    const result = selectCeilingPeriod(fixture, "2026-01-01");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.period.period_id).toBe("2026-1");
  });
});

describe("selectCeilingPeriod — hata durumları", () => {
  it("2024-12-31 -> NO_PERIOD (tanımlı dönem yok)", () => {
    const result = selectCeilingPeriod(fixture, "2024-12-31");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("NO_PERIOD");
  });

  it("2027-02-01 -> PERIOD_UNVERIFIED (fixture'daki doğrulanmamış 2027-1 dönemi)", () => {
    const result = selectCeilingPeriod(fixture, "2027-02-01");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("PERIOD_UNVERIFIED");
  });

  it("'2026-02-30' -> INVALID_DATE (takvimde geçersiz gün)", () => {
    const result = selectCeilingPeriod(fixture, "2026-02-30");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("INVALID_DATE");
  });

  it("'26/02/2026' -> INVALID_DATE (yanlış biçim)", () => {
    const result = selectCeilingPeriod(fixture, "26/02/2026");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("INVALID_DATE");
  });

  it("'' (boş string) -> INVALID_DATE", () => {
    const result = selectCeilingPeriod(fixture, "");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("INVALID_DATE");
  });
});

// ─── 3. validateRatesConfig — Bozulmuş fixture kopyaları ────────────────────

describe("validateRatesConfig — yapısal hata tespiti", () => {
  it("Çakışan dönemler -> CONFIG_INVALID", () => {
    const broken: RatesConfig = {
      ...fixture,
      severance_ceiling_periods: [
        // 2026-1 ile 2026-2 aynı tarihi paylaşıyor (2026-06-30 / 2026-07-01 kesişimi yok)
        // Gerçek çakışma: from/to örtüşen iki dönem
        {
          period_id: "A",
          label: "Test A",
          from: "2026-01-01",
          to: "2026-06-30",
          amount_try: 64948.77,
          verified: true,
          source_url: "",
        },
        {
          period_id: "B",
          label: "Test B",
          from: "2026-06-15", // A ile çakışıyor
          to: "2026-12-31",
          amount_try: 73729.87,
          verified: true,
          source_url: "",
        },
      ],
    };
    const result = validateRatesConfig(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("CONFIG_INVALID");
  });

  it("Negatif amount_try -> CONFIG_INVALID", () => {
    const broken: RatesConfig = {
      ...fixture,
      severance_ceiling_periods: [
        {
          ...fixture.severance_ceiling_periods[0]!,
          amount_try: -1,
        },
      ],
    };
    const result = validateRatesConfig(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("CONFIG_INVALID");
  });

  it("from > to olan dönem -> CONFIG_INVALID", () => {
    const broken: RatesConfig = {
      ...fixture,
      severance_ceiling_periods: [
        {
          ...fixture.severance_ceiling_periods[0]!,
          from: "2026-12-31",
          to: "2026-01-01",
        },
      ],
    };
    const result = validateRatesConfig(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("CONFIG_INVALID");
  });
});

// ─── 4. verifyLock — verified: false senaryoları ────────────────────────────

describe("verifyLock — damga vergisi", () => {
  it("stamp_tax verified: true -> ok: true, doğru oran", () => {
    const result = verifyStampTax(fixture);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(0.00759);
  });

  it("stamp_tax verified: false -> STAMP_TAX_UNVERIFIED", () => {
    const broken: RatesConfig = {
      ...fixture,
      stamp_tax: { ...fixture.stamp_tax, verified: false },
    };
    const result = verifyStampTax(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("STAMP_TAX_UNVERIFIED");
  });
});

describe("verifyLock — ihbar haftaları", () => {
  it("notice_weeks verified: true -> ok: true", () => {
    const result = verifyNoticeWeeks(fixture);
    expect(result.ok).toBe(true);
  });

  it("notice_weeks verified: false -> NOTICE_UNVERIFIED", () => {
    const broken: RatesConfig = {
      ...fixture,
      notice_weeks: { ...fixture.notice_weeks, verified: false },
    };
    const result = verifyNoticeWeeks(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("NOTICE_UNVERIFIED");
  });
});

describe("verifyLock — gelir vergisi", () => {
  it("income_tax verified: true -> ok: true", () => {
    const result = verifyIncomeTax(fixture);
    expect(result.ok).toBe(true);
  });

  it("income_tax verified: false -> INCOME_TAX_UNVERIFIED", () => {
    const broken: RatesConfig = {
      ...fixture,
      income_tax_rates_for_estimate: {
        ...fixture.income_tax_rates_for_estimate,
        verified: false,
      },
    };
    const result = verifyIncomeTax(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("INCOME_TAX_UNVERIFIED");
  });
});
