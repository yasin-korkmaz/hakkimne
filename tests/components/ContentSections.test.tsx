/**
 * ContentSections.test.tsx
 * Açıklama ve SSS bileşenleri render testleri.
 * Dayanak: PRD ve Görev 14 gereksinimleri.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FaqSection from "@/components/FaqSection";
import ExplainSection from "@/components/ExplainSection";
import { FAQ_ITEMS } from "@/content/faq";

describe("FaqSection Bileşeni", () => {
  it("başlığı ve açıklama metnini render etmeli", () => {
    render(<FaqSection />);
    expect(
      screen.getByRole("heading", { name: /Sıkça Sorulan Sorular/i })
    ).toBeInTheDocument();
  });

  it("tam olarak 10 adet SSS sorusu listelenmeli", () => {
    render(<FaqSection />);
    expect(FAQ_ITEMS.length).toBe(10);

    for (const item of FAQ_ITEMS) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
      expect(screen.getByText(item.answer)).toBeInTheDocument();
    }
  });

  it("tavan sorusunda 'güncel tavan sayfadaki rozetten okunur' ifadesi yer almalı", () => {
    render(<FaqSection />);
    const ceilingItem = FAQ_ITEMS.find((i) => i.id === "kidem-tavani-nedir");
    expect(ceilingItem?.answer).toContain("güncel tavan sayfadaki rozetten okunur");
  });

  it("1,5 yıl ihbar süresi sorusunda 'uzmana danışın' ifadesi yer almalı", () => {
    render(<FaqSection />);
    const noticeItem = FAQ_ITEMS.find((i) => i.id === "ihbar-sureleri-nasil-belirlenir");
    expect(noticeItem?.answer).toContain("uzmanına danışmanız önerilir");
  });

  it("çıkış günü sorusunda dahil edildiği ifade edilmeli", () => {
    render(<FaqSection />);
    const exitDayItem = FAQ_ITEMS.find((i) => i.id === "cikis-gunu-hesaba-dahil-mi");
    expect(exitDayItem?.answer).toContain("tam gün olarak dahil edilir");
  });
});

describe("ExplainSection Bileşeni", () => {
  it("hesaplama adımları başlığını ve formül kartlarını render etmeli", () => {
    render(<ExplainSection />);
    expect(
      screen.getByRole("heading", { name: /Tazminat Nasıl Hesaplanır\?/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Çalışma Süresinin Hesaplanması/i)).toBeInTheDocument();
    expect(screen.getByText(/Giydirilmiş Brüt Ücretin Tespiti/i)).toBeInTheDocument();
    expect(screen.getByText(/Kıdem Baz Ücreti ve Tavan Kontrolü/i)).toBeInTheDocument();
    expect(screen.getByText(/Brüt Kıdem ve Damga Vergisi Kesintisi/i)).toBeInTheDocument();
    expect(screen.getByText(/İhbar Tazminatı \(Hak Kazanıldıysa\)/i)).toBeInTheDocument();
  });

  it("örnek hesaplama tablosu tutarlarını eksiksiz render etmeli", () => {
    render(<ExplainSection />);

    // Örnek hesaplama başlığı
    expect(
      screen.getByText(/Örnek Hesaplama \(4 Yıl Çalışma, Haksız Fesih\)/i)
    ).toBeInTheDocument();

    // Girdi değerleri
    expect(screen.getByText("15.08.2022")).toBeInTheDocument();
    expect(screen.getByText("14.08.2026")).toBeInTheDocument();
    expect(screen.getByText("4 yıl 0 ay 0 gün")).toBeInTheDocument();

    // Sonuç değerleri
    expect(screen.getByText("200.000,00 TL")).toBeInTheDocument();
    expect(screen.getByText("1.518,00 TL")).toBeInTheDocument();
    expect(screen.getByText("198.482,00 TL")).toBeInTheDocument();
    expect(screen.getByText("93.333,33 TL")).toBeInTheDocument();
    expect(screen.getByText("78.624,93 TL")).toBeInTheDocument();
    expect(screen.getByText("277.106,93 TL")).toBeInTheDocument();
  });
});
