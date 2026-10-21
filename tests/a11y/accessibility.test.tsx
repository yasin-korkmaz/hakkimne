/**
 * accessibility.test.tsx
 * Erişilebilirlik ve mobil uyum düzeltmeleri testleri (WCAG 2.1 AA).
 * Dayanak: Görev 17 denetim bulguları.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RootLayout from "@/app/layout";
import ReceiptTable from "@/components/ReceiptTable";
import TrustBadge from "@/components/TrustBadge";
import Calculator from "@/components/Calculator";
import fixtureRaw from "../fixtures/rates.test.json";
import type { RatesConfig } from "@/lib/config/types";
import type { ReceiptRow } from "@/lib/receipt/buildReceipt";

const fixture = fixtureRaw as unknown as RatesConfig;

describe("A11y 1 & 2 & 5: RootLayout Klavye ve Dokunma Hedefleri", () => {
  it("İçeriğe Atla bağlantısı render edilmeli ve #main-content hedefine işaret etmeli", () => {
    render(
      <RootLayout>
        <div>Test İçerik</div>
      </RootLayout>,
      { container: document }
    );

    const skipLink = screen.getByRole("link", { name: "İçeriğe Atla" });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(skipLink.className).toContain("sr-only");
    expect(skipLink.className).toContain("focus:not-sr-only");
  });

  it("header ve footer navigasyon bağlantıları min-h-[44px] touch target sınıfına sahip olmalı", () => {
    render(
      <RootLayout>
        <div>Test İçerik</div>
      </RootLayout>,
      { container: document }
    );

    const kidemLink = screen.getByRole("link", { name: "Kıdem Tazminatı" });
    expect(kidemLink.className).toContain("min-h-[44px]");

    const gizlilikLink = screen.getByRole("link", { name: "Gizlilik Politikası" });
    expect(gizlilikLink.className).toContain("min-h-[44px]");
  });
});

describe("A11y 3 & 4: ReceiptTable Semantiği ve Başlık Hiyerarşisi", () => {
  const sampleRows: ReceiptRow[] = [
    { id: "period", label: "Çalışma Süresi", value: "4 yıl 0 ay 0 gün", kind: "default" },
    { id: "net_severance", label: "Net Kıdem Tazminatı", value: "198.482,00 TL", kind: "highlight" },
  ];

  it("fiş tablosu h2 başlığı ve role='region' etiketine sahip olmalı", () => {
    render(<ReceiptTable rows={sampleRows} />);

    const heading = screen.getByRole("heading", { level: 2, name: /Adım Adım Hesaplama Fişi/i });
    expect(heading).toBeInTheDocument();

    const region = screen.getByRole("region", { name: /Adım Adım Hesaplama Fişi/i });
    expect(region).toBeInTheDocument();
  });

  it("fiş satırları semantik dl, dt ve dd etiketlerini içermeli", () => {
    const { container } = render(<ReceiptTable rows={sampleRows} />);

    const dl = container.querySelector("dl");
    expect(dl).toBeInTheDocument();

    const dts = container.querySelectorAll("dt");
    expect(dts.length).toBe(2);
    expect(dts[0].textContent).toContain("Çalışma Süresi");

    const dds = container.querySelectorAll("dd");
    expect(dds.length).toBe(2);
    expect(dds[1].textContent).toContain("198.482,00 TL");
  });
});

describe("A11y 7: TrustBadge Hareket Azaltma (motion-reduce)", () => {
  it("iskelet ve uyarı noktası motion-reduce:animate-none sınıfına sahip olmalı", () => {
    render(<TrustBadge rates={fixture} isTestData={true} currentDateIso="2026-10-21" />);
    const dot = document.querySelector(".animate-pulse");
    expect(dot?.className).toContain("motion-reduce:animate-none");
  });
});

describe("A11y 8: CalculatorForm Hata Bildirimleri Canlı Duyurusu (role='alert')", () => {
  it("form doğrulama hatası verdiğinde hata mesajları role='alert' taşımalı", async () => {
    const user = userEvent.setup();
    render(<Calculator ratesData={{ rates: fixture, isTestData: false }} />);

    await user.click(screen.getByRole("button", { name: /Hesapla/i }));

    const alerts = screen.getAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts.some((a) => a.textContent?.includes("Fesih nedeni"))).toBe(true);
    expect(alerts.some((a) => a.textContent?.includes("İşe giriş tarihi"))).toBe(true);
  });
});
