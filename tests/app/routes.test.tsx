/**
 * routes.test.tsx
 * Sayfa rotaları ve layout bileşenleri render testleri.
 * Dayanak: PRD ve Görev 12 gereksinimleri.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import RootLayout from "@/app/layout";
import HomePage from "@/app/page";
import KidemTazminatiPage from "@/app/kidem-tazminati-hesaplama/page";
import IhbarTazminatiPage from "@/app/ihbar-tazminati-hesaplama/page";
import GizlilikPage from "@/app/gizlilik/page";
import KvkkPage from "@/app/kvkk/page";
import CerezPolitikasiPage from "@/app/cerez-politikasi/page";
import KullanimKosullariPage from "@/app/kullanim-kosullari/page";
import HakkindaPage from "@/app/hakkinda/page";
import IletisimPage from "@/app/iletisim/page";
import NotFoundPage from "@/app/not-found";

describe("Layout ve Navigasyon Bileşenleri", () => {
  it("Header içinde logo ve temel menü bağlantıları render edilmeli", () => {
    render(
      <RootLayout>
        <div>Test İçerik</div>
      </RootLayout>,
      { container: document }
    );

    expect(screen.getByRole("link", { name: /HakkımNe\?/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Kıdem Tazminatı$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^İhbar Tazminatı$/i })).toBeInTheDocument();
  });

  it("Footer içinde yasal bağlantılar ve DISCLAIMER yer almalı", () => {
    render(
      <RootLayout>
        <div>Test İçerik</div>
      </RootLayout>,
      { container: document }
    );

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

describe("Ana Sayfa ve Hesaplama Sayfaları", () => {
  it("Ana sayfada tek H1 'Kıdem ve İhbar Tazminatı Hesaplama' yer almalı", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Kıdem ve İhbar Tazminatı Hesaplama" })
    ).toBeInTheDocument();
  });

  it("Kıdem Tazminatı sayfasında H1 'Kıdem Tazminatı Hesaplama' yer almalı", () => {
    render(<KidemTazminatiPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Kıdem Tazminatı Hesaplama" })
    ).toBeInTheDocument();
  });

  it("İhbar Tazminatı sayfasında H1 'İhbar Tazminatı Hesaplama' yer almalı", () => {
    render(<IhbarTazminatiPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "İhbar Tazminatı Hesaplama" })
    ).toBeInTheDocument();
  });
});

describe("Yasal Sayfalar ve 404 Sayfası", () => {
  it("Yasal sayfalar ilgili H1 başlıklarını ve 'Hazırlanıyor' kartını içermeli", () => {
    const { unmount: u1 } = render(<GizlilikPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Gizlilik Politikası" })).toBeInTheDocument();
    expect(screen.getByText("Hazırlanıyor")).toBeInTheDocument();
    u1();

    const { unmount: u2 } = render(<KvkkPage />);
    expect(screen.getByRole("heading", { level: 1, name: "KVKK Aydınlatma Metni" })).toBeInTheDocument();
    u2();

    const { unmount: u3 } = render(<CerezPolitikasiPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Çerez Politikası" })).toBeInTheDocument();
    u3();

    const { unmount: u4 } = render(<KullanimKosullariPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Kullanım Koşulları" })).toBeInTheDocument();
    u4();

    const { unmount: u5 } = render(<HakkindaPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Hakkında" })).toBeInTheDocument();
    u5();

    render(<IletisimPage />);
    expect(screen.getByRole("heading", { level: 1, name: "İletişim" })).toBeInTheDocument();
  });

  it("404 sayfasında H1 ve ana sayfaya dönüş butonu yer almalı", () => {
    render(<NotFoundPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Sayfa Bulunamadı" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ana Sayfaya Dön" })).toBeInTheDocument();
  });
});
