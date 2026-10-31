/**
 * legalPages.test.tsx
 * Yasal ve kurumsal sayfalar render testleri.
 * Dayanak: PRD ve Görev 15 gereksinimleri.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import KvkkPage from "@/app/kvkk/page";
import GizlilikPage from "@/app/gizlilik/page";
import CerezPolitikasiPage from "@/app/cerez-politikasi/page";
import KullanimKosullariPage from "@/app/kullanim-kosullari/page";
import IletisimPage from "@/app/iletisim/page";
import HakkindaPage from "@/app/hakkinda/page";
import { siteConfig } from "@/config/site";

describe("Yasal ve Kurumsal Sayfa Taslakları", () => {
  it("KVKK sayfasında başlık, veri sorumlusu ve istemci taraflı bilgi yer almalı", () => {
    render(<KvkkPage />);
    expect(screen.getByRole("heading", { level: 1, name: /KVKK Aydınlatma Metni/i })).toBeInTheDocument();
    expect(screen.getByText(/tamamen tarayıcınızda \(istemci tarafında\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Yasin Korkmaz/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: siteConfig.contactEmail })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.contactEmail}`
    );
  });

  it("Gizlilik sayfasında sıfır veri depolama ve analitik yer tutucusu yer almalı", () => {
    render(<GizlilikPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Gizlilik Politikası/i })).toBeInTheDocument();
    expect(screen.getByText(/Sıfır Veri Depolama Garantisi/i)).toBeInTheDocument();
    expect(screen.getByText(/Şu an aktif analitik kodu bulunmamaktadır/i)).toBeInTheDocument();
  });

  it("Çerez Politikası sayfasında pazarlama çerezi kullanılmadığı belirtilmeli", () => {
    render(<CerezPolitikasiPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Çerez Politikası/i })).toBeInTheDocument();
    expect(screen.getByText(/Kullanıcı \/ Pazarlama Çerezleri: Kullanılmamaktadır/i)).toBeInTheDocument();
  });

  it("Kullanım Koşulları sayfasında tavsiye niteliği taşımama ve sorumluluk reddi yer almalı", () => {
    render(<KullanimKosullariPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Kullanım Koşulları/i })).toBeInTheDocument();
    expect(screen.getByText(/avukatlık danışmanlığı veya mali müşavirlik tavsiyesi teşkil etmez/i)).toBeInTheDocument();
    expect(screen.getByText(/Sorumluluk Reddi/i)).toBeInTheDocument();
  });

  it("Hakkında sayfasında bağımsız hesaplama platformu misyonu ve mevzuat atıfları yer almalı", () => {
    render(<HakkindaPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Hakkında/i })).toBeInTheDocument();
    expect(screen.getByText(/bağımsız ve açık bir hesaplama platformudur/i)).toBeInTheDocument();
    expect(screen.getByText(/1475 Sayılı İş Kanunu Madde 14/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Yasin Korkmaz/i })).toHaveAttribute(
      "href",
      "https://github.com/yasin-korkmaz"
    );
    expect(screen.getByText(/deterministik ve test odaklı geliştirme/i)).toBeInTheDocument();
  });

  it("İletişim sayfasında doğrudan e-posta ve 'Bu hesaplamada hata gördüm' mailto bağlantısı yer almalı", () => {
    render(<IletisimPage />);
    expect(screen.getByRole("heading", { level: 1, name: /İletişim/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: siteConfig.contactEmail })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.contactEmail}`
    );

    const bugReportLink = screen.getByRole("link", { name: /Bu hesaplamada hata gördüm/i });
    expect(bugReportLink).toBeInTheDocument();
    expect(bugReportLink.getAttribute("href")).toContain(`mailto:${siteConfig.contactEmail}`);
    expect(bugReportLink.getAttribute("href")).toContain("subject=Bu%20hesaplamada%20hata%20g%C3%B6rd%C3%BCm");
  });
});
