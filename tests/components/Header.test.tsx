/**
 * Header.test.tsx — Yalın Header ve Responsive Mobil Menü Testleri
 * Dayanak: WCAG 2.1 AA & Masaüstü / Mobil Responsive Gereksinimleri
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header";

describe("Header — Yalın Masaüstü ve Responsive Mobil Menü", () => {
  it("Logo, masaüstü navigasyon bağlantıları ve CTA butonu render edilmeli", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: /HakkımNedir\?/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Hesaplayıcılar$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Rehber$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Hakkımızda$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Hakkımı Hesapla/i })).toBeInTheDocument();
  });

  it("Hamburger butonu başlangıçta kapalı olmalı ve tıklandığında mobil menü açılıp kapanmalı", () => {
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: "Menüyü aç" });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(menuButton.className).toContain("min-h-[44px]");

    // Mobil menü başlangıçta kapalı
    expect(screen.queryByRole("navigation", { name: "Mobil Menü" })).not.toBeInTheDocument();

    // Butona tıkla -> Aç
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(menuButton).toHaveAttribute("aria-label", "Menüyü kapat");

    const mobileNav = screen.getByRole("navigation", { name: "Mobil Menü" });
    expect(mobileNav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Kıdem Tazminatı$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^İhbar Tazminatı$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Hak Takip Merkezi$/i })).toBeInTheDocument();

    // Menüdeki bir linke tıklandığında menü kapanmalı
    const kidemLink = screen.getByRole("link", { name: /^Kıdem Tazminatı$/i });
    fireEvent.click(kidemLink);

    expect(screen.queryByRole("navigation", { name: "Mobil Menü" })).not.toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
