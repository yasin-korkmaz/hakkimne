/**
 * netBrutUI.test.tsx
 * Net/Brüt Maaş Hesaplayıcı Arayüz ve Sayfa Entegrasyon Testleri
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NetBrutForm from "@/components/NetBrutForm";
import NetBrutUcretPage, { metadata } from "@/app/net-brut-ucret-hesaplama/page";

describe("NetBrutForm Arayüzü", () => {
  it("temel yön seçim butonlarını ve 50.000 TL için net maaşı doğru render etmeli", () => {
    render(<NetBrutForm />);

    expect(screen.getByRole("button", { name: /Brütten Nete/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Netten Brüte/i })).toBeInTheDocument();

    // 50.000 TL brüt için 35.745,50 TL net hesaplanmalı
    expect(screen.getAllByText("35.745,50 TL").length).toBeGreaterThan(0);
    expect(screen.getByText(/%15 Dilimi/i)).toBeInTheDocument();
  });

  it("Netten Brüte moduna geçildiğinde etiket ve başlık güncellenmeli", () => {
    render(<NetBrutForm />);

    const nettenBruteBtn = screen.getByRole("button", { name: /Netten Brüte/i });
    fireEvent.click(nettenBruteBtn);

    expect(screen.getByText("Aylık Hedef Net Maaş Tutarı")).toBeInTheDocument();
    expect(screen.getByText("Gereken Aylık Brüt Maaş")).toBeInTheDocument();
  });

  it("Örnek tutar butonuna tıklandığında tutarı güncellemeli", () => {
    render(<NetBrutForm />);

    const presetBtn = screen.getByRole("button", { name: /30.000 TL/i });
    fireEvent.click(presetBtn);

    const input = screen.getByLabelText(/Aylık Brüt Maaş Tutarı/i) as HTMLInputElement;
    expect(input.value).toBe("30000");
  });
});

describe("NetBrutUcretPage Sayfa ve SEO Testleri", () => {
  it("sayfa metadata long-tail anahtar kelimeleri ve canonical adresi içermeli", () => {
    expect(metadata.title).toContain("Net Brüt Maaş Hesaplama");
    expect(metadata.description).toContain("2026 Asgari Ücret Net Brüt Hesaplama");
    expect(metadata.alternates?.canonical).toBe("/net-brut-ucret-hesaplama");
  });

  it("sayfa başlığı, vergi dilimi tablosu ve SSS bölümü render edilmeli", () => {
    render(<NetBrutUcretPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: /2026 Net - Brüt Maaş Hesaplama/i })
    ).toBeInTheDocument();

    expect(screen.getAllByText(/158.000 TL/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Maaş Hesaplama Hakkında Sıkça Sorulan Sorular/i)).toBeInTheDocument();
  });
});
