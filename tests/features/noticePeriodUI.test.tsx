/**
 * noticePeriodUI.test.tsx — İhbar Süresi UI Bileşenleri ve Etkileşim Testleri
 * Dayanak: 4857 Sayılı İş Kanunu Madde 17 ve Aşama 3C gereksinimleri
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NoticePeriodCalculator from "@/features/notice-period/NoticePeriodCalculator";

describe("NoticePeriodCalculator — UI ve Etkileşim Testleri", () => {
  it("Form alanlarının eksiksiz render edildiğini doğrulamalı", () => {
    render(<NoticePeriodCalculator />);

    expect(screen.getByLabelText(/İşe Giriş Tarihi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bildirim \/ İstifa Tarihi/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hesapla" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Temizle" })).toBeInTheDocument();
  });

  it("1 yıllık çalışan için iki katmanlı sonuç, olası bitiş tarihi ve toggle davranışı", () => {
    render(<NoticePeriodCalculator />);

    // 1. Tarihleri doldur (1 yıl çalışma: 2025-01-01 -> 2026-01-01)
    fireEvent.change(screen.getByLabelText(/İşe Giriş Tarihi/i), {
      target: { value: "2025-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/Bildirim \/ İstifa Tarihi/i), {
      target: { value: "2026-01-01" },
    });

    // 2. Hesapla butonuna tıkla
    fireEvent.click(screen.getByRole("button", { name: "Hesapla" }));

    // 3. Katman 1: Özet alanında olası bitiş tarihi ve 4 hafta ihbar süresi görünmeli
    // 2026-01-01 + 28 gün = 29.01.2026
    expect(screen.getByText("Olası Son İş Günü (Bitiş Tarihi)")).toBeInTheDocument();
    expect(screen.getAllByText("29.01.2026").length).toBeGreaterThan(0);
    expect(screen.getByText("4 Hafta")).toBeInTheDocument();
    expect(screen.getByText("28 Takvim Günü")).toBeInTheDocument();

    // 4. Katman 2: Detaylı fiş başlangıçta kapalı olmalı
    expect(screen.queryByText(/İhbar Süresi Hesaplama Fişi/i)).not.toBeInTheDocument();

    // 5. Toggle butonuna tıkla -> Ayrıntılı fiş açılmalı
    const toggleButton = screen.getByRole("button", { name: /Ayrıntılı hesaplamayı göster/i });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggleButton);

    expect(screen.getByText(/İhbar Süresi Hesaplama Fişi/i)).toBeInTheDocument();
    expect(screen.getByText(/md\. 17\/b/i)).toBeInTheDocument();
    expect(screen.getByText(/Yeni İş Arama İzni/i)).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    // 6. Tekrar tıkla -> Ayrıntılı fiş gizlenmeli
    fireEvent.click(toggleButton);
    expect(screen.queryByText(/İhbar Süresi Hesaplama Fişi/i)).not.toBeInTheDocument();
  });

  it("Temizle butonuna basıldığında form ve sonuçlar sıfırlanmalı", () => {
    render(<NoticePeriodCalculator />);

    fireEvent.change(screen.getByLabelText(/İşe Giriş Tarihi/i), {
      target: { value: "2025-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/Bildirim \/ İstifa Tarihi/i), {
      target: { value: "2026-01-01" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Hesapla" }));

    expect(screen.getByText("Olası Son İş Günü (Bitiş Tarihi)")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Temizle" }));

    expect(screen.queryByText("Olası Son İş Günü (Bitiş Tarihi)")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/İşe Giriş Tarihi/i)).toHaveValue("");
    expect(screen.getByLabelText(/Bildirim \/ İstifa Tarihi/i)).toHaveValue("");
  });
});
