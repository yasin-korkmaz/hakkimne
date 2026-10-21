/**
 * ratesSource.test.ts
 * Oran kaynağı seçicisi (ratesSource) birim testleri.
 * Dayanak: AGENTS.md Kural 2 & 3.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getRates } from "@/lib/config/ratesSource";

describe("ratesSource — getRates", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("NODE_ENV production iken NEXT_PUBLIC_USE_TEST_RATES=true olsa dahi üretim oranları dönmeli", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_USE_TEST_RATES", "true");

    const result = getRates();
    expect(result.isTestData).toBe(false);
    // Üretim dosyasındaki stamp_tax.verified false'tur
    expect(result.rates.stamp_tax.verified).toBe(false);
  });

  it("geliştirme modunda NEXT_PUBLIC_USE_TEST_RATES=true iken test oranları ve isTestData=true dönmeli", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_USE_TEST_RATES", "true");

    const result = getRates();
    expect(result.isTestData).toBe(true);
    // Test fixture dosyasındaki stamp_tax.verified true'dur
    expect(result.rates.stamp_tax.verified).toBe(true);
  });

  it("geliştirme modunda bayrak tanımlı değilken üretim oranları dönmeli", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_USE_TEST_RATES", "");

    const result = getRates();
    expect(result.isTestData).toBe(false);
    expect(result.rates.stamp_tax.verified).toBe(false);
  });
});
