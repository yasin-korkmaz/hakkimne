/**
 * format.test.ts
 * formatNumberTR, formatTRY, formatPercent ve parseTRNumber testleri.
 * Tüm beklenen değerler prompt'tan alınmıştır (AGENTS.md Kural 4).
 */

import { describe, it, expect } from "vitest";
import {
  formatNumberTR,
  formatTRY,
  formatPercent,
  parseTRNumber,
} from "@/lib/utils/format";

// ─── formatNumberTR ───────────────────────────────────────────────────────────

describe("formatNumberTR", () => {
  it("1234.5 → '1.234,50'", () => {
    expect(formatNumberTR(1234.5)).toBe("1.234,50");
  });

  it("0 → '0,00'", () => {
    expect(formatNumberTR(0)).toBe("0,00");
  });

  it("147459.74 → '147.459,74'", () => {
    expect(formatNumberTR(147459.74)).toBe("147.459,74");
  });

  it("50000 → '50.000,00'", () => {
    expect(formatNumberTR(50000)).toBe("50.000,00");
  });
});

// ─── formatTRY ────────────────────────────────────────────────────────────────

describe("formatTRY", () => {
  it("1234.5 → '1.234,50 TL'", () => {
    expect(formatTRY(1234.5)).toBe("1.234,50 TL");
  });

  it("0 → '0,00 TL'", () => {
    expect(formatTRY(0)).toBe("0,00 TL");
  });
});

// ─── formatPercent ────────────────────────────────────────────────────────────

describe("formatPercent", () => {
  it("0.00759 → '%0,759'", () => {
    expect(formatPercent(0.00759)).toBe("%0,759");
  });

  it("0.15 → '%15'", () => {
    expect(formatPercent(0.15)).toBe("%15");
  });

  it("0.20 → '%20'", () => {
    expect(formatPercent(0.2)).toBe("%20");
  });

  it("0.27 → '%27'", () => {
    expect(formatPercent(0.27)).toBe("%27");
  });
});

// ─── parseTRNumber ────────────────────────────────────────────────────────────

describe("parseTRNumber — geçerli girişler", () => {
  it("'50000' → 50000", () => {
    expect(parseTRNumber("50000")).toBe(50000);
  });

  it("'50.000' → 50000 (binlik nokta)", () => {
    expect(parseTRNumber("50.000")).toBe(50000);
  });

  it("'50.000,5' → 50000.5", () => {
    expect(parseTRNumber("50.000,5")).toBe(50000.5);
  });

  it("'1.234,56' → 1234.56", () => {
    expect(parseTRNumber("1.234,56")).toBe(1234.56);
  });

  it("'0' → 0", () => {
    expect(parseTRNumber("0")).toBe(0);
  });

  it("'0,00' → 0", () => {
    expect(parseTRNumber("0,00")).toBe(0);
  });
});

describe("parseTRNumber — geçersiz girişler", () => {
  it("'abc' → null", () => {
    expect(parseTRNumber("abc")).toBeNull();
  });

  it("'' (boş string) → null", () => {
    expect(parseTRNumber("")).toBeNull();
  });

  it("'50,000,00' → null (birden fazla virgül / yanlış biçim)", () => {
    expect(parseTRNumber("50,000,00")).toBeNull();
  });

  it("'1.2.3' → null (binlik ayırıcı yanlış konumda)", () => {
    expect(parseTRNumber("1.2.3")).toBeNull();
  });

  it("'12.34' → null (binlik nokta yanlış konumda: 2 haneli grup)", () => {
    expect(parseTRNumber("12.34")).toBeNull();
  });

  it("'   ' (yalnızca boşluk) → null", () => {
    expect(parseTRNumber("   ")).toBeNull();
  });
});
