/**
 * Header.test.tsx — Minimalist Logo Başlığı Testleri
 * Dayanak: WCAG 2.1 AA (min 44px dokunma alanı) ve sadeleştirilmiş Header mimarisi.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";

describe("Header — Minimalist Logo Başlığı", () => {
  it("Header içinde yalnızca HakkımNedir? logosu ve sloganı render edilmeli", () => {
    render(<Header />);

    // Logo ve slogan
    const logoLink = screen.getByRole("link", { name: /HakkımNedir\?/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
    expect(screen.getByText("İş hayatında hakkını bil")).toBeInTheDocument();

    // Silinen navigasyon linklerinin, CTA ve hamburger menünün bulunmadığı doğrulanmalı
    expect(screen.queryByRole("link", { name: /^Hesaplayıcılar$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Rehber$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Hakkımızda$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Hakkımı Hesapla/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Menüyü/i })).not.toBeInTheDocument();
  });

  it("Logo bağlantısı min-h-[44px] touch target sınıfına sahip olmalı", () => {
    render(<Header />);

    const logoLink = screen.getByRole("link", { name: /HakkımNedir\?/i });
    expect(logoLink.className).toContain("min-h-[44px]");
  });
});
