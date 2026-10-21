/**
 * buildReceipt.test.ts
 * Hesaplama fişi satır üreticisi birim testleri.
 * Dayanak: PRD Senaryoları (S1, S2, S3) ve AGENTS.md Kural 4.
 */

import { describe, it, expect } from "vitest";
import type { RatesConfig } from "@/lib/config/types";
import { calculateCompensation } from "@/lib/calculators/compensation";
import { buildReceipt } from "@/lib/receipt/buildReceipt";
import { formatTRY } from "@/lib/utils/format";
import fixtureRaw from "../fixtures/rates.test.json";

const fixture = fixtureRaw as unknown as RatesConfig;

describe("buildReceipt — Senaryo 1 (PRD 4 Yıl Normal)", () => {
  const result = calculateCompensation(
    {
      reason: "employer_unfair",
      noticeUsed: "no",
      startIso: "2022-08-15",
      exitIso: "2026-08-14",
      grossMonthly: 50000,
      extraMonthly: 0,
      annualBonus: 0,
      incomeTaxRate: 0.15,
    },
    fixture
  );

  const receipt = buildReceipt(result, fixture);

  it("fiş satırları üretilmeli", () => {
    expect(receipt.length).toBeGreaterThan(0);
  });

  it("S1 fişinde net kıdem '198.482,00 TL' olmalı", () => {
    const netRow = receipt.find((r) => r.id === "net_severance");
    expect(netRow).toBeDefined();
    expect(netRow?.value).toBe("198.482,00 TL");
  });

  it("tahmini net ihbar satırında etikette 'tahmini' kelimesi geçmeli", () => {
    const netNoticeRow = receipt.find((r) => r.id === "net_notice");
    expect(netNoticeRow).toBeDefined();
    expect(netNoticeRow?.label.toLowerCase()).toContain("tahmini");
    expect(netNoticeRow?.value).toBe("78.624,93 TL");
  });

  it("brüt kıdem ve brüt ihbar formatTRY ile birebir eşleşmeli (tutarlılık)", () => {
    if (result.status === "ok") {
      const grossSeveranceRow = receipt.find((r) => r.id === "gross_severance");
      expect(grossSeveranceRow?.value).toBe(formatTRY(result.severance.grossSeverance));

      const grossNoticeRow = receipt.find((r) => r.id === "gross_notice");
      expect(grossNoticeRow?.value).toBe(formatTRY(result.notice.grossNotice));
    }
  });

  it("çıkış günü dahil edilmiştir kural notu bulunmalı", () => {
    const noteRow = receipt.find((r) => r.id === "exit_day_note");
    expect(noteRow).toBeDefined();
    expect(noteRow?.value).toBe("Çıkış günü dahil edilmiştir");
  });
});

describe("buildReceipt — Senaryo 2 (PRD Tavana Takılan)", () => {
  const result = calculateCompensation(
    {
      reason: "retirement_military_marriage",
      startIso: "2024-10-01",
      exitIso: "2026-09-30",
      grossMonthly: 90000,
      extraMonthly: 5000,
      annualBonus: 60000,
    },
    fixture
  );

  const receipt = buildReceipt(result, fixture);

  it("kıdem bazı tavan tutarı olan 73.729,87 TL olmalı", () => {
    if (result.status === "ok") {
      const baseRow = receipt.find((r) => r.id === "severance_base");
      expect(baseRow?.value).toBe("73.729,87 TL");
      expect(baseRow?.value).toBe(formatTRY(result.severance.base));

      const netRow = receipt.find((r) => r.id === "net_severance");
      expect(netRow?.value).toBe("146.340,52 TL");
      expect(netRow?.value).toBe(formatTRY(result.severance.netSeverance));
    }
  });

  it("ihbar hak edilmediği için ihbar satırları fişte yer almamalı", () => {
    const netNoticeRow = receipt.find((r) => r.id === "net_notice");
    expect(netNoticeRow).toBeUndefined();
  });
});

describe("buildReceipt — Senaryo 3 (PRD Geçmiş Dönem Tavanı)", () => {
  const result = calculateCompensation(
    {
      reason: "employer_unfair",
      noticeUsed: "no",
      startIso: "2025-03-10",
      exitIso: "2026-03-09",
      grossMonthly: 80000,
      extraMonthly: 0,
      annualBonus: 0,
    },
    fixture
  );

  const receipt = buildReceipt(result, fixture);

  it("kurallar sürümü satırı S3'te 2026-1 olmalı", () => {
    const versionRow = receipt.find((r) => r.id === "rules_version");
    expect(versionRow).toBeDefined();
    expect(versionRow?.value).toBe("2026-1");
  });

  it("fişteki brüt kıdem result.severance.grossSeverance ile birebir aynı olmalı", () => {
    if (result.status === "ok") {
      const grossRow = receipt.find((r) => r.id === "gross_severance");
      expect(grossRow?.value).toBe(formatTRY(result.severance.grossSeverance));
      expect(grossRow?.value).toBe("64.948,77 TL");
    }
  });
});

describe("buildReceipt — status ok olmayan durum", () => {
  it("hesaplama başarılı değilse boş dizi dönmeli", () => {
    const result = calculateCompensation({ reason: "other_unsure" }, fixture);
    expect(buildReceipt(result, fixture)).toEqual([]);
  });
});
