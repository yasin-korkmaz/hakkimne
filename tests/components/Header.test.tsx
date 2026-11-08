/**
 * Header.test.tsx — Minimalist Logo Başlığı Testleri
 * Dayanak: WCAG 2.1 AA (min 44px dokunma alanı) ve sadeleştirilmiş Header mimarisi.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header";

describe("Header — Minimalist Logo Başlığı ve Araçlar Menüsü", () => {
  it("Header içinde logo, slogan ve minimalist Araçlar menüsü render edilmeli", () => {
    render(<Header />);

    // Logo ve slogan
    const logoLink = screen.getByRole("link", { name: /HakkımNedir\?/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
    expect(screen.getByText("İş hayatında hakkını bil")).toBeInTheDocument();

    // Silinen eski navigasyon linklerinin bulunmadığı doğrulanmalı
    expect(screen.queryByRole("link", { name: /^Hesaplayıcılar$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Rehber$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Hakkımızda$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Hakkımı Hesapla/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Menüyü/i })).not.toBeInTheDocument();

    // Yeni zarif Araçlar butonu mevcut olmalı
    const toolsBtn = screen.getByRole("button", { name: "Araçlar" });
    expect(toolsBtn).toBeInTheDocument();
    expect(toolsBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("Araçlar butonuna tıklandığında açılır menü öğeleri görünmeli ve tıklanınca kapanmalı", () => {
    render(<Header />);

    const toolsBtn = screen.getByRole("button", { name: "Araçlar" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    // Aç
    fireEvent.click(toolsBtn);
    expect(toolsBtn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();

    const kidemLink = screen.getByRole("menuitem", { name: "Kıdem Tazminatı" });
    const ihbarLink = screen.getByRole("menuitem", { name: "İhbar Tazminatı" });
    const mesaiLink = screen.getByRole("menuitem", { name: "Fazla Mesai" });

    expect(kidemLink).toHaveAttribute("href", "/kidem-tazminati-hesaplama");
    expect(ihbarLink).toHaveAttribute("href", "/ihbar-tazminati-hesaplama");
    expect(mesaiLink).toHaveAttribute("href", "/fazla-mesai-hesaplama");

    // Tıklayınca kapanmalı
    fireEvent.click(kidemLink);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("Logo bağlantısı min-h-[44px] touch target sınıfına sahip olmalı", () => {
    render(<Header />);

    const logoLink = screen.getByRole("link", { name: /HakkımNedir\?/i });
    expect(logoLink.className).toContain("min-h-[44px]");
  });
});
