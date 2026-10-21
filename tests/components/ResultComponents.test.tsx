/**
 * ResultComponents.test.tsx
 * Sonuç arayüzü ve Calculator konteyneri birim testleri.
 * Dayanak: PRD ve prompt gereksinimleri.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Calculator from "@/components/Calculator";
import fixtureRaw from "../fixtures/rates.test.json";
import type { RatesConfig } from "@/lib/config/types";

const fixture = fixtureRaw as unknown as RatesConfig;

describe("Calculator — Senaryo 1 (PRD 4 Yıl Normal)", () => {
  it("S1 senaryosu sonucunda '198.482,00 TL' ve 'tahmini' metinlerinin render edildiğini doğrulamalı", async () => {
    const user = userEvent.setup();
    render(<Calculator ratesData={{ rates: fixture, isTestData: false }} />);

    // S1 formunu doldur
    await user.selectOptions(
      screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i),
      "employer_unfair"
    );
    await user.selectOptions(
      screen.getByLabelText(/İhbar Süresi Kullandırıldı mı\?/i),
      "no"
    );
    await user.type(screen.getByLabelText(/İşe Giriş Tarihi/i), "2022-08-15");
    await user.type(screen.getByLabelText(/İşten Çıkış Tarihi/i), "2026-08-14");
    await user.type(screen.getByLabelText(/Aylık Brüt Maaş/i), "50000");

    await user.click(screen.getByRole("button", { name: /Hesapla/i }));

    // Net kıdem tazminatı görünmeli
    expect(screen.getAllByText("198.482,00 TL").length).toBeGreaterThan(0);

    // Tahmini kelimesi ihbar etiketinde geçmeli
    expect(screen.getAllByText(/tahmini/i).length).toBeGreaterThan(0);
  });
});

describe("Calculator — Senaryo 2 (Tavan Uygulandı)", () => {
  it("S2 senaryosunda tavan uyarısının NoticeList içinde göründüğünü test et", async () => {
    const user = userEvent.setup();
    render(<Calculator ratesData={{ rates: fixture, isTestData: false }} />);

    // S2 formunu doldur (Emeklilik, tavan üstü maaş)
    await user.selectOptions(
      screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i),
      "retirement_military_marriage"
    );
    await user.type(screen.getByLabelText(/İşe Giriş Tarihi/i), "2024-10-01");
    await user.type(screen.getByLabelText(/İşten Çıkış Tarihi/i), "2026-09-30");
    await user.type(screen.getByLabelText(/Aylık Brüt Maaş/i), "90000");
    await user.type(screen.getByLabelText(/Düzenli Aylık Ek Ödemeler/i), "5000");
    await user.type(screen.getByLabelText(/Yıllık İkramiye \/ Prim Toplamı/i), "60000");

    await user.click(screen.getByRole("button", { name: /Hesapla/i }));

    // Tavan uyarısı görünmeli
    expect(
      screen.getByText(/kıdem tazminatı tavanını aştığı için hesaplamada tavan tutar/i)
    ).toBeInTheDocument();
  });
});

describe("Calculator — Blocked Durumu", () => {
  it("blocked durumunda hiçbir 'TL' tutarının ekrana basılmadığını doğrulamalı", async () => {
    const user = userEvent.setup();
    // Doğrulanmamış damga vergisi içeren config
    const brokenRates: RatesConfig = {
      ...fixture,
      stamp_tax: { ...fixture.stamp_tax, verified: false },
    };

    render(<Calculator ratesData={{ rates: brokenRates, isTestData: false }} />);

    await user.selectOptions(
      screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i),
      "voluntary_resignation"
    );
    await user.type(screen.getByLabelText(/İşe Giriş Tarihi/i), "2022-08-15");
    await user.type(screen.getByLabelText(/İşten Çıkış Tarihi/i), "2026-08-14");
    await user.type(screen.getByLabelText(/Aylık Brüt Maaş/i), "50000");

    await user.click(screen.getByRole("button", { name: /Hesapla/i }));

    // Kilit hata mesajı görünmeli
    expect(
      screen.getByText("Damga vergisi oranı henüz resmî olarak doğrulanmamıştır.")
    ).toBeInTheDocument();

    // Ekranda hiçbir "TL" tutarı basılmamalı
    const allText = document.body.textContent ?? "";
    expect(allText).not.toMatch(/\d+\s*TL/i);
    expect(allText).not.toMatch(/\d+,\d{2}\s*TL/i);
  });
});

describe("Calculator — Test Verisi Uyarı Bandı", () => {
  it("isTestData true olduğunda en üstte kırmızı uyarı bandı gösterilmeli", () => {
    render(<Calculator ratesData={{ rates: fixture, isTestData: true }} />);

    expect(
      screen.getByText("TEST VERİSİ — gerçek oran değildir")
    ).toBeInTheDocument();
  });

  it("isTestData false olduğunda kırmızı uyarı bandı gösterilmemeli", () => {
    render(<Calculator ratesData={{ rates: fixture, isTestData: false }} />);

    expect(
      screen.queryByText("TEST VERİSİ — gerçek oran değildir")
    ).not.toBeInTheDocument();
  });
});
