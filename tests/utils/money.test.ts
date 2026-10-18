/**
 * money.test.ts
 * roundToKurus yuvarlama testleri.
 * Tüm beklenen değerler prompt'tan alınmıştır (AGENTS.md Kural 4).
 */

import { describe, it, expect } from "vitest";
import { roundToKurus } from "@/lib/utils/money";

describe("roundToKurus", () => {
  it("1119.2193 → 1119.22", () => {
    expect(roundToKurus(1119.2193)).toBe(1119.22);
  });

  it("78624.9300 → 78624.93", () => {
    expect(roundToKurus(78624.93)).toBe(78624.93);
  });

  it("0.005 → 0.01 (yarıya yuvarlama)", () => {
    expect(roundToKurus(0.005)).toBe(0.01);
  });

  it("0 → 0", () => {
    expect(roundToKurus(0)).toBe(0);
  });

  it("1518 tam sayı → 1518 (değişmez)", () => {
    expect(roundToKurus(1518)).toBe(1518);
  });

  it("Negatif değer: -1119.2193 → -1119.22", () => {
    expect(roundToKurus(-1119.2193)).toBe(-1119.22);
  });
});
