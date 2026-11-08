/**
 * CalculatorForm.test.tsx
 * Hesaplama formu bileşeni (CalculatorForm) 3 Adımlı Sihirbaz testleri.
 * Dayanak: PRD ve modern Wizard UX gereksinimleri.
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CalculatorForm from "@/components/CalculatorForm";
import fixtureRaw from "../fixtures/rates.test.json";
import type { RatesConfig } from "@/lib/config/types";

const fixture = fixtureRaw as unknown as RatesConfig;

describe("CalculatorForm — 3 Adımlı Sihirbaz (Wizard) Etkileşim Testleri", () => {
  it("3 adımlı sihirbaz yapısında adımlar arası geçişi ve form alanlarını doğrulamalı", async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn();
    render(<CalculatorForm rates={fixture} onCalculate={onCalculate} />);

    // 1. Adım kontrolleri
    expect(screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/İşe Giriş Tarihi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/İşten Çıkış Tarihi/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /İleri/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Formu Temizle/i })).toBeInTheDocument();

    // 1. Adımı doldur ve ilerle
    await user.selectOptions(screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i), "voluntary_resignation");
    await user.type(screen.getByLabelText(/İşe Giriş Tarihi/i), "2022-08-15");
    await user.type(screen.getByLabelText(/İşten Çıkış Tarihi/i), "2026-08-14");
    await user.click(screen.getByRole("button", { name: /İleri/i }));

    // 2. Adım kontrolleri
    expect(screen.getByLabelText(/Aylık Brüt Maaş/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /← Geri/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /İleri/i })).toBeInTheDocument();

    // 2. Adımı doldur ve ilerle
    await user.type(screen.getByLabelText(/Aylık Brüt Maaş/i), "50000");
    await user.click(screen.getByRole("button", { name: /İleri/i }));

    // 3. Adım kontrolleri
    expect(screen.getByLabelText(/Düzenli Aylık Ek Ödemeler/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Yıllık İkramiye \/ Prim Toplamı/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Hakkımı Hesapla/i })).toBeInTheDocument();
  });

  it("employer_unfair seçildiğinde ihbar sorusunun göründüğünü, başka neden seçildiğinde gizlendiğini doğrulamalı", async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn();
    render(<CalculatorForm rates={fixture} onCalculate={onCalculate} />);

    // Başlangıçta görünmemeli
    expect(screen.queryByLabelText(/İhbar Süresi Kullandırıldı mı\?/i)).not.toBeInTheDocument();

    // employer_unfair seçildiğinde görünmeli
    const reasonSelect = screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i);
    await user.selectOptions(reasonSelect, "employer_unfair");
    expect(screen.getByLabelText(/İhbar Süresi Kullandırıldı mı\?/i)).toBeInTheDocument();

    // Başka neden seçildiğinde gizlenmeli
    await user.selectOptions(reasonSelect, "voluntary_resignation");
    expect(screen.queryByLabelText(/İhbar Süresi Kullandırıldı mı\?/i)).not.toBeInTheDocument();
  });

  it("boş gönderimde hata mesajlarının çıktığını ve ilk hatalı alana odaklanıldığını doğrulamalı", async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn();
    render(<CalculatorForm rates={fixture} onCalculate={onCalculate} />);

    const nextBtn = screen.getByRole("button", { name: /İleri/i });
    await user.click(nextBtn);

    // Hata mesajı görünmeli
    expect(screen.getByText("Fesih nedeni seçilmelidir.")).toBeInTheDocument();

    // İlk hatalı alana odaklanmalı
    const reasonSelect = screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i);
    expect(reasonSelect).toHaveFocus();
  });

  it("'50.000,5' değerinin geçerli bir maaş girdisi olarak kabul edildiğini doğrulamalı", async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn();
    render(<CalculatorForm rates={fixture} onCalculate={onCalculate} />);

    // 1. Adımı doldur
    await user.selectOptions(screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i), "voluntary_resignation");
    await user.type(screen.getByLabelText(/İşe Giriş Tarihi/i), "2022-08-15");
    await user.type(screen.getByLabelText(/İşten Çıkış Tarihi/i), "2026-08-14");
    await user.click(screen.getByRole("button", { name: /İleri/i }));

    // 2. Adımı doldur
    await user.type(screen.getByLabelText(/Aylık Brüt Maaş/i), "50.000,5");
    await user.click(screen.getByRole("button", { name: /İleri/i }));

    // 3. Adımda hesapla
    await user.click(screen.getByRole("button", { name: /Hakkımı Hesapla/i }));

    // onCalculate çağrılmış ve maaş hatası olmamalı
    expect(onCalculate).toHaveBeenCalledTimes(1);
    const lastResult = onCalculate.mock.calls[0][0];
    expect(lastResult.status).toBe("ok");
    if (lastResult.status === "ok") {
      expect(lastResult.input.grossMonthly).toBe(50000.5);
    }
  });

  it("Temizle düğmesine basıldığında formun sıfırlandığını doğrulamalı", async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn();
    const onReset = vi.fn();
    render(<CalculatorForm rates={fixture} onCalculate={onCalculate} onReset={onReset} />);

    const reasonSelect = screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i);
    await user.selectOptions(reasonSelect, "voluntary_resignation");
    expect(reasonSelect).toHaveValue("voluntary_resignation");

    const resetBtn = screen.getByRole("button", { name: /Formu Temizle/i });
    await user.click(resetBtn);

    expect(reasonSelect).toHaveValue("");
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("Adım 2'de Geri tuşuna basıldığında verilerin kaybolmadığını doğrulamalı", async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn();
    render(<CalculatorForm rates={fixture} onCalculate={onCalculate} />);

    // 1. Adımı doldur ve 2'ye geç
    await user.selectOptions(screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i), "voluntary_resignation");
    await user.type(screen.getByLabelText(/İşe Giriş Tarihi/i), "2022-08-15");
    await user.type(screen.getByLabelText(/İşten Çıkış Tarihi/i), "2026-08-14");
    await user.click(screen.getByRole("button", { name: /İleri/i }));

    // 2. Adımda maaş yaz
    const grossInput = screen.getByLabelText(/Aylık Brüt Maaş/i);
    await user.type(grossInput, "45000");

    // Geri dön
    await user.click(screen.getByRole("button", { name: /← Geri/i }));

    // 1. Adım verilerinin korunduğunu doğrula
    expect(screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i)).toHaveValue("voluntary_resignation");
    expect(screen.getByLabelText(/İşe Giriş Tarihi/i)).toHaveValue("2022-08-15");

    // Tekrar ileri git ve maaşın korunduğunu doğrula
    await user.click(screen.getByRole("button", { name: /İleri/i }));
    expect(screen.getByLabelText(/Aylık Brüt Maaş/i)).toHaveValue("45000");
  });
});
