/**
 * Footer.test.tsx
 * Footer (Alt Bilgi) bileşeni render ve bağlantı testleri.
 * Kurucu ve Geliştirici imzası, GitHub bağlantısı ve yasal linklerin doğrulanması.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer Bileşeni — Kurucu İmzası ve Yasal Bağlantılar", () => {
  it("kurucu ve geliştirici 'Yasin Korkmaz' ibaresini ve GitHub profil linkini render etmeli", () => {
    render(<Footer />);

    expect(screen.getByText(/Kurucu ve Geliştirici:/i)).toBeInTheDocument();

    const githubLink = screen.getByRole("link", { name: /Yasin Korkmaz/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com/yasin-korkmaz");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("tüm yasal bağlantıları ve sorumluluk reddi uyarısını içermeli", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /Gizlilik/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /KVKK/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Çerez Politikası/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Kullanım Koşulları/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Hakkında/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /İletişim/i })).toBeInTheDocument();

    expect(
      screen.getByText(/Bu araç bilgilendirme amaçlıdır, hukuki danışmanlık değildir/i)
    ).toBeInTheDocument();
  });
});
