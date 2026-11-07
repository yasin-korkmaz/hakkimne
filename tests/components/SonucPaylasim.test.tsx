/**
 * SonucPaylasim.test.tsx
 * Hesaplama Sonucu Paylaşım ve PDF İndirme Bileşeni Birim Testleri
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SonucPaylasim from "@/components/SonucPaylasim";
import * as pdfModule from "@/lib/generatePDF";

describe("SonucPaylasim Bileşeni", () => {
  const mockResult: pdfModule.HesaplamaSonucu = {
    netKidem: 150000,
    grossKidem: 151138.5,
    netIhbar: 25000,
    grossIhbar: 30000,
    toplamNet: 175000,
    serviceDuration: "3 yıl 2 ay 10 gün",
    monthlySalary: 45000,
    extraBenefits: 5000,
  };

  it("PDF İndir ve WhatsApp Paylaş butonlarını doğru metinlerle render etmeli", () => {
    render(<SonucPaylasim result={mockResult} />);

    expect(
      screen.getByRole("button", { name: /Hesaplama sonucunu PDF olarak indir/i })
    ).toBeInTheDocument();

    const whatsappLink = screen.getByRole("link", {
      name: /Hesaplama sonucunu WhatsApp'ta paylaş/i,
    });
    expect(whatsappLink).toBeInTheDocument();
    expect(whatsappLink).toHaveAttribute("target", "_blank");
    expect(whatsappLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("WhatsApp linki sonuç tutarlarını ve site adresini URL-encoded olarak içermeli", () => {
    render(<SonucPaylasim result={mockResult} />);

    const whatsappLink = screen.getByRole("link", {
      name: /Hesaplama sonucunu WhatsApp'ta paylaş/i,
    });
    const href = whatsappLink.getAttribute("href") || "";

    expect(href).toContain("https://wa.me/?text=");
    const decodedText = decodeURIComponent(href.replace("https://wa.me/?text=", ""));
    expect(decodedText).toContain("HakkımNedir? Tazminat Hesaplama Sonucum");
    expect(decodedText).toContain("175.000,00 TL");
    expect(decodedText).toContain("150.000,00 TL");
    expect(decodedText).toContain("3 yıl 2 ay 10 gün");
    expect(decodedText).toContain("https://hakkimnedir.com.tr");
  });

  it("PDF İndir butonuna basıldığında generatePDF fonksiyonunu çağırmalı", () => {
    const generateSpy = vi
      .spyOn(pdfModule, "generatePDF")
      .mockImplementation(() => {});

    render(<SonucPaylasim result={mockResult} />);

    const button = screen.getByRole("button", {
      name: /Hesaplama sonucunu PDF olarak indir/i,
    });
    fireEvent.click(button);

    expect(generateSpy).toHaveBeenCalledTimes(1);
    expect(generateSpy).toHaveBeenCalledWith(mockResult);

    generateSpy.mockRestore();
  });
});
