/**
 * dateDuration.test.ts
 * Takvim aritmetiği testleri.
 * Tüm beklenen değerler prompt'tan alınmıştır; kendin üretilmemiştir (AGENTS.md Kural 4).
 */

import { describe, it, expect } from "vitest";
import {
  parseIsoDate,
  addDays,
  addMonthsClamped,
  addYearsClamped,
  computeDuration,
  compareDurationToMonths,
} from "@/lib/utils/dateDuration";

// ─── parseIsoDate ─────────────────────────────────────────────────────────────

describe("parseIsoDate", () => {
  it("2026-06-15 geçerli", () => expect(parseIsoDate("2026-06-15")).toBe(true));
  it("2024-02-29 geçerli (artık yıl)", () => expect(parseIsoDate("2024-02-29")).toBe(true));
  it("2026-02-30 geçersiz (Şubat'ta 30 gün yok)", () => expect(parseIsoDate("2026-02-30")).toBe(false));
  it("2025-02-29 geçersiz (artık olmayan yılda 29 Şubat)", () => expect(parseIsoDate("2025-02-29")).toBe(false));
  it("26/02/2026 geçersiz (yanlış biçim)", () => expect(parseIsoDate("26/02/2026")).toBe(false));
  it("boş string geçersiz", () => expect(parseIsoDate("")).toBe(false));
});

// ─── addDays ─────────────────────────────────────────────────────────────────

describe("addDays", () => {
  it("2026-08-14 + 1 = 2026-08-15", () => expect(addDays("2026-08-14", 1)).toBe("2026-08-15"));
  it("2025-12-31 + 1 = 2026-01-01 (yıl sınırı)", () => expect(addDays("2025-12-31", 1)).toBe("2026-01-01"));
  it("2024-02-28 + 1 = 2024-02-29 (artık yıl)", () => expect(addDays("2024-02-28", 1)).toBe("2024-02-29"));
  it("2026-02-28 + 1 = 2026-03-01 (artık olmayan yıl)", () => expect(addDays("2026-02-28", 1)).toBe("2026-03-01"));
});

// ─── addMonthsClamped ────────────────────────────────────────────────────────

describe("addMonthsClamped", () => {
  it("2026-01-31 + 1 ay = 2026-02-28 (Şubat'ta 31 gün yok → kırp)", () =>
    expect(addMonthsClamped("2026-01-31", 1)).toBe("2026-02-28"));
  it("2026-03-31 + 1 ay = 2026-04-30 (Nisan'da 31 gün yok → kırp)", () =>
    expect(addMonthsClamped("2026-03-31", 1)).toBe("2026-04-30"));
  it("2026-01-15 + 1 ay = 2026-02-15 (kırpma yok)", () =>
    expect(addMonthsClamped("2026-01-15", 1)).toBe("2026-02-15"));
  it("2025-12-31 + 2 ay = 2026-02-28 (Şubat kırpma + yıl sınırı)", () =>
    expect(addMonthsClamped("2025-12-31", 2)).toBe("2026-02-28"));
});

// ─── addYearsClamped ─────────────────────────────────────────────────────────

describe("addYearsClamped", () => {
  it("2024-02-29 + 1 yıl = 2025-02-28 (artık olmayan yıla kırp)", () =>
    expect(addYearsClamped("2024-02-29", 1)).toBe("2025-02-28"));
  it("2024-02-29 + 4 yıl = 2028-02-29 (artık yıl → kırpma yok)", () =>
    expect(addYearsClamped("2024-02-29", 4)).toBe("2028-02-29"));
  it("2022-08-15 + 4 yıl = 2026-08-15", () =>
    expect(addYearsClamped("2022-08-15", 4)).toBe("2026-08-15"));
});

// ─── computeDuration — PRD senaryoları ───────────────────────────────────────

describe("computeDuration — PRD doğrulama senaryoları", () => {
  it("Senaryo 1: 2022-08-15 → 2026-08-14 = 4y 0m 0d", () => {
    expect(computeDuration("2022-08-15", "2026-08-14")).toEqual({
      years: 4,
      months: 0,
      days: 0,
    });
  });

  it("Senaryo 2: 2024-10-01 → 2026-09-30 = 2y 0m 0d", () => {
    expect(computeDuration("2024-10-01", "2026-09-30")).toEqual({
      years: 2,
      months: 0,
      days: 0,
    });
  });

  it("Senaryo 3: 2025-03-10 → 2026-03-09 = 1y 0m 0d", () => {
    expect(computeDuration("2025-03-10", "2026-03-09")).toEqual({
      years: 1,
      months: 0,
      days: 0,
    });
  });
});

// ─── computeDuration — Ek testler ────────────────────────────────────────────

describe("computeDuration — ek testler", () => {
  it("2023-08-15 → 2026-08-15 = 3y 0m 1d (artı 1 gün)", () => {
    expect(computeDuration("2023-08-15", "2026-08-15")).toEqual({
      years: 3,
      months: 0,
      days: 1,
    });
  });

  it("2023-03-01 → 2024-02-28 = 0y 11m 28d (365 gün ama tam yıl değil)", () => {
    expect(computeDuration("2023-03-01", "2024-02-28")).toEqual({
      years: 0,
      months: 11,
      days: 28,
    });
  });
});

// ─── computeDuration — hata durumları ────────────────────────────────────────

describe("computeDuration — hata durumları", () => {
  it("Çıkış < Giriş → hata fırlatır", () => {
    expect(() => computeDuration("2026-08-14", "2022-08-15")).toThrow();
  });

  it("Geçersiz giriş tarihi (2026-02-30) → hata fırlatır", () => {
    expect(() => computeDuration("2026-02-30", "2026-08-14")).toThrow();
  });

  it("Geçersiz çıkış tarihi (2026-02-30) → hata fırlatır", () => {
    expect(() => computeDuration("2022-08-15", "2026-02-30")).toThrow();
  });
});

// ─── compareDurationToMonths — 6 aylık sınır (giriş: 2023-01-10) ─────────────

describe("compareDurationToMonths — 6 aylık eşik (giriş: 2023-01-10)", () => {
  it("çıkış 2023-07-08 → -1 (6 aydan az)", () =>
    expect(compareDurationToMonths("2023-01-10", "2023-07-08", 6)).toBe(-1));
  it("çıkış 2023-07-09 → 0 (tam 6 ay)", () =>
    expect(compareDurationToMonths("2023-01-10", "2023-07-09", 6)).toBe(0));
  it("çıkış 2023-07-10 → 1 (6 aydan fazla)", () =>
    expect(compareDurationToMonths("2023-01-10", "2023-07-10", 6)).toBe(1));
});

// ─── compareDurationToMonths — 18 aylık sınır (giriş: 2023-01-10) ────────────

describe("compareDurationToMonths — 18 aylık eşik (giriş: 2023-01-10)", () => {
  it("çıkış 2024-07-08 → -1 (18 aydan az)", () =>
    expect(compareDurationToMonths("2023-01-10", "2024-07-08", 18)).toBe(-1));
  it("çıkış 2024-07-09 → 0 (tam 18 ay)", () =>
    expect(compareDurationToMonths("2023-01-10", "2024-07-09", 18)).toBe(0));
  it("çıkış 2024-07-10 → 1 (18 aydan fazla)", () =>
    expect(compareDurationToMonths("2023-01-10", "2024-07-10", 18)).toBe(1));
});

// ─── compareDurationToMonths — 36 aylık sınır (giriş: 2023-01-10) ────────────

describe("compareDurationToMonths — 36 aylık eşik (giriş: 2023-01-10)", () => {
  it("çıkış 2026-01-08 → -1 (36 aydan az)", () =>
    expect(compareDurationToMonths("2023-01-10", "2026-01-08", 36)).toBe(-1));
  it("çıkış 2026-01-09 → 0 (tam 36 ay)", () =>
    expect(compareDurationToMonths("2023-01-10", "2026-01-09", 36)).toBe(0));
  it("çıkış 2026-01-10 → 1 (36 aydan fazla)", () =>
    expect(compareDurationToMonths("2023-01-10", "2026-01-10", 36)).toBe(1));
});

// ─── compareDurationToMonths — hata durumları ────────────────────────────────

describe("compareDurationToMonths — hata durumları", () => {
  it("Çıkış < Giriş → hata fırlatır", () => {
    expect(() => compareDurationToMonths("2026-01-10", "2025-01-10", 6)).toThrow();
  });

  it("Geçersiz çıkış tarihi → hata fırlatır", () => {
    expect(() => compareDurationToMonths("2023-01-10", "2026-02-30", 6)).toThrow();
  });
});
