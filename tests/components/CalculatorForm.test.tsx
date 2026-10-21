/**
 * CalculatorForm.test.tsx
 * Hesaplama formu bileşeni (CalculatorForm) testleri.
 * Dayanak: PRD ve prompt gereksinimleri.
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CalculatorForm from "@/components/CalculatorForm";
import fixtureRaw from "../fixtures/rates.test.json";
import type { RatesConfig } from "@/lib/config/types";

const fixture = fixtureRaw as unknown as RatesConfig;

describe("CalculatorForm — Render ve Etkileşim Testleri", () => {
  it("tüm temel form alanlarının render edildiğini doğrulamalı", () => {
    const onCalculate = vi.fn();
    render(<CalculatorForm rates={fixture} onCalculate={onCalculate} />);

    expect(screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/İşe Giriş Tarihi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/İşten Çıkış Tarihi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Aylık Brüt Maaş/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Düzenli Aylık Ek Ödemeler/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Yıllık İkramiye \/ Prim Toplamı/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Hesapla/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Temizle/i })).toBeInTheDocument();
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

    const submitBtn = screen.getByRole("button", { name: /Hesapla/i });
    await user.click(submitBtn);

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

    // Formu doldur (2026-08-14 fixture'da 2026-2 döneminde tanımlıdır)
    await user.selectOptions(screen.getByLabelText(/İşten Ayrılış \/ Fesih Nedeni/i), "voluntary_resignation");
    await user.type(screen.getByLabelText(/İşe Giriş Tarihi/i), "2022-08-15");
    await user.type(screen.getByLabelText(/İşten Çıkış Tarihi/i), "2026-08-14");
    await user.type(screen.getByLabelText(/Aylık Brüt Maaş/i), "50.000,5");

    await user.click(screen.getByRole("button", { name: /Hesapla/i }));

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

    const grossInput = screen.getByLabelText(/Aylık Brüt Maaş/i);
    await user.type(grossInput, "45.000");
    expect(grossInput).toHaveValue("45.000");

    const resetBtn = screen.getByRole("button", { name: /Temizle/i });
    await user.click(resetBtn);

    expect(grossInput).toHaveValue("");
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
