/**
 * validation.test.ts
 * Form girdi doğrulama (validation) birim testleri.
 * Dayanak: PRD Bölüm 3 ve AGENTS.md Kural 4.
 */

import { describe, it, expect } from "vitest";
import type { RatesConfig } from "@/lib/config/types";
import { validateInput } from "@/lib/utils/validation";
import fixtureRaw from "../fixtures/rates.test.json";

const fixture = fixtureRaw as unknown as RatesConfig;

describe("validateInput — Temel Geçerli Girişler", () => {
  it("eksiksiz geçerli girdi başarıyla doğrulanmalı", () => {
    const res = validateInput(
      {
        reason: "employer_unfair",
        noticeUsed: "no",
        startIso: "2022-08-15",
        exitIso: "2026-08-14",
        grossMonthly: "50.000,00",
        extraMonthly: "5.000",
        annualBonus: "60.000",
        incomeTaxRate: 0.15,
      },
      fixture
    );

    expect(res.isValid).toBe(true);
    expect(res.errors).toHaveLength(0);
    expect(res.data).toEqual({
      reason: "employer_unfair",
      noticeUsed: "no",
      noticeWorked: false,
      startIso: "2022-08-15",
      exitIso: "2026-08-14",
      grossMonthly: 50000,
      extraMonthly: 5000,
      annualBonus: 60000,
      incomeTaxRate: 0.15,
    });
  });

  it("isteğe bağlı alanlar (ek ödeme, ikramiye, vergi dilimi) boşken varsayılan değerleri almalı", () => {
    const res = validateInput(
      {
        reason: "voluntary_resignation",
        startIso: "2022-08-15",
        exitIso: "2026-08-14",
        grossMonthly: 50000,
      },
      fixture
    );

    expect(res.isValid).toBe(true);
    expect(res.data?.extraMonthly).toBe(0);
    expect(res.data?.annualBonus).toBe(0);
    expect(res.data?.incomeTaxRate).toBe(0.15);
    expect(res.data?.noticeWorked).toBe(false);
  });

  it("other_unsure seçeneği geçerli bir girdi olmalı", () => {
    const res = validateInput(
      {
        reason: "other_unsure",
        startIso: "2022-08-15",
        exitIso: "2026-08-14",
        grossMonthly: 50000,
      },
      fixture
    );

    expect(res.isValid).toBe(true);
    expect(res.data?.reason).toBe("other_unsure");
  });
});

describe("validateInput — Fesih Nedeni ve İhbar Öneli Kuralları", () => {
  it("reason boş ise hata dönmeli", () => {
    const res = validateInput(
      {
        startIso: "2022-08-15",
        exitIso: "2026-08-14",
        grossMonthly: 50000,
      },
      fixture
    );

    expect(res.isValid).toBe(false);
    expect(res.fieldErrors["reason"]).toBe("Fesih nedeni seçilmelidir.");
  });

  it("employer_unfair seçildiğinde noticeUsed zorunlu olmalı", () => {
    const res = validateInput(
      {
        reason: "employer_unfair",
        startIso: "2022-08-15",
        exitIso: "2026-08-14",
        grossMonthly: 50000,
      },
      fixture
    );

    expect(res.isValid).toBe(false);
    expect(res.fieldErrors["noticeUsed"]).toBe("İhbar süresinin kullandırılıp kullandırılmadığı seçilmelidir.");
  });

  it("employer_unfair dışında noticeUsed girilmese de geçerli olmalı", () => {
    const res = validateInput(
      {
        reason: "employee_just_cause",
        startIso: "2022-08-15",
        exitIso: "2026-08-14",
        grossMonthly: 50000,
      },
      fixture
    );

    expect(res.isValid).toBe(true);
  });
});

describe("validateInput — Tarih Doğrulama Kuralları", () => {
  it("startIso 1970-01-01 tarihinden önce olamaz", () => {
    const res = validateInput(
      {
        reason: "voluntary_resignation",
        startIso: "1969-12-31",
        exitIso: "2026-08-14",
        grossMonthly: 50000,
      },
      fixture
    );

    expect(res.isValid).toBe(false);
    expect(res.fieldErrors["startIso"]).toBe("İşe giriş tarihi 01.01.1970 tarihinden önce olamaz.");
  });

  it("exitIso < startIso ise hata dönmeli", () => {
    const res = validateInput(
      {
        reason: "voluntary_resignation",
        startIso: "2026-08-15",
        exitIso: "2026-08-14",
        grossMonthly: 50000,
      },
      fixture
    );

    expect(res.isValid).toBe(false);
    expect(res.fieldErrors["exitIso"]).toBe("Çıkış tarihi, giriş tarihinden önce olamaz.");
  });

  it("geçersiz takvim tarihi girildiğinde hata dönmeli (2026-02-30)", () => {
    const res = validateInput(
      {
        reason: "voluntary_resignation",
        startIso: "2022-08-15",
        exitIso: "2026-02-30",
        grossMonthly: 50000,
      },
      fixture
    );

    expect(res.isValid).toBe(false);
    expect(res.fieldErrors["exitIso"]).toBe("Geçerli bir işten çıkış tarihi giriniz (YYYY-AA-GG).");
  });
});

describe("validateInput — Para Alanları Kuralları", () => {
  it("grossMonthly <= 0 ise hata dönmeli", () => {
    const res = validateInput(
      {
        reason: "voluntary_resignation",
        startIso: "2022-08-15",
        exitIso: "2026-08-14",
        grossMonthly: 0,
      },
      fixture
    );

    expect(res.isValid).toBe(false);
    expect(res.fieldErrors["grossMonthly"]).toBe("Aylık brüt maaş 0'dan büyük olmalı.");
  });

  it("grossMonthly > 100.000.000 TL ise hata dönmeli", () => {
    const res = validateInput(
      {
        reason: "voluntary_resignation",
        startIso: "2022-08-15",
        exitIso: "2026-08-14",
        grossMonthly: 100000001,
      },
      fixture
    );

    expect(res.isValid).toBe(false);
    expect(res.fieldErrors["grossMonthly"]).toBe("Aylık brüt maaş 100.000.000 TL'den büyük olamaz.");
  });

  it("ek ödeme negatif girildiğinde hata dönmeli", () => {
    const res = validateInput(
      {
        reason: "voluntary_resignation",
        startIso: "2022-08-15",
        exitIso: "2026-08-14",
        grossMonthly: 50000,
        extraMonthly: "-500",
      },
      fixture
    );

    expect(res.isValid).toBe(false);
    expect(res.fieldErrors["extraMonthly"]).toBe("Aylık ek ödeme 0'dan küçük olamaz.");
  });

  it("geçersiz vergi oranı seçildiğinde hata dönmeli", () => {
    const res = validateInput(
      {
        reason: "voluntary_resignation",
        startIso: "2022-08-15",
        exitIso: "2026-08-14",
        grossMonthly: 50000,
        incomeTaxRate: 0.18, // 0.18 listede yok
      },
      fixture
    );

    expect(res.isValid).toBe(false);
    expect(res.fieldErrors["incomeTaxRate"]).toBe("Geçerli bir gelir vergisi oranı seçiniz.");
  });
});
