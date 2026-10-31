/**
 * overtimeUI.test.tsx — Fazla Mesai UI Bileşenleri ve Etkileşim Testleri
 * Dayanak: 4857 Sayılı İş Kanunu Madde 41 ve Aşama 3B gereksinimleri
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OvertimeCalculator from "@/features/overtime/OvertimeCalculator";

describe("OvertimeCalculator — UI ve Etkileşim Testleri", () => {
  it("Form alanlarının varsayılan değerlerle render edildiğini doğrulamalı", () => {
    render(<OvertimeCalculator />);

    expect(screen.getByLabelText(/Aylık Brüt Maaş/i)).toBeInTheDocument();
    const contractInput = screen.getByLabelText(/Haftalık Sözleşme Çalışma Süresi/i);
    expect(contractInput).toBeInTheDocument();
    expect(contractInput).toHaveValue(45); // Varsayılan 45 saat
    expect(screen.getByLabelText(/Haftalık Gerçekleşen Toplam Çalışma Saati/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hesapla" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Temizle" })).toBeInTheDocument();
  });

  it("45 saat sözleşme ve 50 saat fiili çalışma ile iki katmanlı sonuç ve toggle davranışı", () => {
    render(<OvertimeCalculator />);

    // 1. Girdileri doldur (45.000 TL brüt, 45 sözleşme, 50 fiili çalışma)
    fireEvent.change(screen.getByLabelText(/Aylık Brüt Maaş/i), {
      target: { value: "45.000,00" },
    });
    fireEvent.change(screen.getByLabelText(/Haftalık Gerçekleşen Toplam Çalışma Saati/i), {
      target: { value: "50" },
    });

    // 2. Hesapla butonuna tıkla
    fireEvent.click(screen.getByRole("button", { name: "Hesapla" }));

    // 3. Katman 1: Özet alanında toplam tutar ve saatlik ücret görünmeli
    // Saatlik: 45.000 / 225 = 200 TL, 5 saat * 200 * 1.5 = 1.500 TL
    expect(screen.getByText("Toplam Haftalık Brüt Mesai Ücreti")).toBeInTheDocument();
    expect(screen.getAllByText("1.500,00 TL").length).toBeGreaterThan(0);
    expect(screen.getAllByText("200,00 TL").length).toBeGreaterThan(0);

    // 4. Katman 2: Detaylı fiş başlangıçta kapalı olmalı
    expect(screen.queryByText(/Fazla Mesai Adım Adım Hesaplama Fişi/i)).not.toBeInTheDocument();

    // 5. Toggle butonuna tıkla -> Ayrıntılı fiş açılmalı
    const toggleButton = screen.getByRole("button", { name: /Ayrıntılı hesaplamayı göster/i });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggleButton);

    expect(screen.getByText(/Fazla Mesai Adım Adım Hesaplama Fişi/i)).toBeInTheDocument();
    expect(screen.getByText(/Aylık Brüt Maaş \/ 225 saat/i)).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    // 6. Tekrar tıkla -> Ayrıntılı fiş gizlenmeli
    fireEvent.click(toggleButton);
    expect(screen.queryByText(/Fazla Mesai Adım Adım Hesaplama Fişi/i)).not.toBeInTheDocument();
  });

  it("Temizle butonuna basıldığında form ve sonuç sıfırlanmalı", () => {
    render(<OvertimeCalculator />);

    fireEvent.change(screen.getByLabelText(/Aylık Brüt Maaş/i), {
      target: { value: "30.000,00" },
    });
    fireEvent.change(screen.getByLabelText(/Haftalık Gerçekleşen Toplam Çalışma Saati/i), {
      target: { value: "48" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Hesapla" }));

    expect(screen.getByText("Toplam Haftalık Brüt Mesai Ücreti")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Temizle" }));

    expect(screen.queryByText("Toplam Haftalık Brüt Mesai Ücreti")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Aylık Brüt Maaş/i)).toHaveValue("");
    expect(screen.getByLabelText(/Haftalık Sözleşme Çalışma Süresi/i)).toHaveValue(45);
  });
});
