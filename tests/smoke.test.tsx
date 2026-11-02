/**
 * smoke.test.tsx — Sistem Geneli Smoke ve Kalite Kontrol Testleri
 * Dayanak: FAZ 8 (Analitik, Performans ve Büyüme Altyapısı) kalite standartları.
 */

import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";

import HomePage from "@/app/page";
import KidemPage from "@/app/kidem-tazminati-hesaplama/page";
import IhbarPage from "@/app/ihbar-tazminati-hesaplama/page";
import YillikIzinPage from "@/app/yillik-izin-ucreti-hesaplama/page";
import FazlaMesaiPage from "@/app/fazla-mesai-hesaplama/page";
import IhbarSuresiPage from "@/app/ihbar-suresi-hesaplama/page";
import HakTakipPage from "@/app/hak-takip-merkezi/page";
import BelgeKontroluPage from "@/app/belge-kontrolu/page";
import KariyerimPage from "@/app/kariyerim/page";
import KamuPage from "@/app/kamu/page";
import NotFoundPage from "@/app/not-found";
import ErrorBoundary from "@/app/error";

import {
  sanitizeEventProperties,
  trackPrivacySafeEvent,
} from "@/lib/analytics/privacyAnalytics";

afterEach(() => {
  cleanup();
});

describe("FAZ 8 Smoke Test — Sayfa ve Rota Bütünlüğü", () => {
  it("ana sayfa ve hesaplayıcılar hatasız render edilmeli", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    cleanup();

    render(<KidemPage />);
    expect(screen.getByText(/Kıdem Tazminatı Hesaplama/i)).toBeInTheDocument();
    cleanup();

    render(<IhbarPage />);
    expect(screen.getByText(/İhbar Tazminatı Hesaplama/i)).toBeInTheDocument();
    cleanup();

    render(<YillikIzinPage />);
    expect(screen.getByText(/Yıllık İzin Ücreti Hesaplama/i)).toBeInTheDocument();
    cleanup();

    render(<FazlaMesaiPage />);
    expect(screen.getByText(/Fazla Mesai Hesaplama/i)).toBeInTheDocument();
    cleanup();

    render(<IhbarSuresiPage />);
    expect(screen.getByText(/İhbar Süresi ve Bitiş Tarihi/i)).toBeInTheDocument();
  });

  it("karar destek modülleri (hak takip, belge, kariyer, kamu) hatasız açılmalı", () => {
    render(<HakTakipPage />);
    expect(screen.getByText(/Hak Takip Merkezi/i)).toBeInTheDocument();
    cleanup();

    render(<BelgeKontroluPage />);
    expect(screen.getByText(/İş Belgesi Hukuki Kontrolü/i)).toBeInTheDocument();
    cleanup();

    render(<KariyerimPage />);
    expect(screen.getByText(/Kariyerim: Teklif Kıyaslama/i)).toBeInTheDocument();
    cleanup();

    render(<KamuPage />);
    expect(screen.getByText(/Kamu Kadro & Nitelik Kodları/i)).toBeInTheDocument();
  });

  it("404 ve hata yakalama (Error Boundary) bileşenleri kararlı çalışmalı", () => {
    render(<NotFoundPage />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ana Sayfaya Dön/i })).toBeInTheDocument();
    cleanup();

    const mockReset = vi.fn();
    const testError = new Error("Test arayüz hatası");
    render(<ErrorBoundary error={testError} reset={mockReset} />);
    expect(screen.getByText(/Beklenmeyen Bir Durum Oluştu/i)).toBeInTheDocument();
  });
});

describe("FAZ 8 Smoke Test — Statik Kaynaklar ve Önbellek Direktifleri", () => {
  it("kurumsal SVG logo ve ikon dosyaları public dizininde mevcut olmalı", () => {
    const publicDir = path.resolve(process.cwd(), "public");
    const logoPath = path.join(publicDir, "logo.svg");
    const iconPath = path.join(publicDir, "logo-icon.svg");

    expect(fs.existsSync(logoPath)).toBe(true);
    expect(fs.existsSync(iconPath)).toBe(true);

    const logoContent = fs.readFileSync(logoPath, "utf-8");
    expect(logoContent).toContain("<svg");
  });

  it("public/_headers içinde Cloudflare Pages statik asset önbellekleme kuralları bulunmalı", () => {
    const headersPath = path.resolve(process.cwd(), "public", "_headers");
    const headersContent = fs.readFileSync(headersPath, "utf-8");

    // Değişmez Next.js statik JS/CSS önbelleği
    expect(headersContent).toContain("/_next/static/*");
    expect(headersContent).toContain("max-age=31536000, immutable");

    // Statik SVG önbelleği
    expect(headersContent).toContain("/*.svg");
  });
});

describe("FAZ 8 Smoke Test — Gizlilik Odaklı Analitik Güvenliği", () => {
  it("sanitizeEventProperties hassas kişisel verileri (maaş, TCKN, ad) kesinlikle temizlemeli", () => {
    const dirtyData = {
      action: "calculate_click",
      salary: 50000,
      tckn: "12345678901",
      name: "Ahmet Yılmaz",
      device: "desktop",
    };

    const cleanData = sanitizeEventProperties(dirtyData);

    expect(cleanData.action).toBe("calculate_click");
    expect(cleanData.device).toBe("desktop");
    expect(cleanData).not.toHaveProperty("salary");
    expect(cleanData).not.toHaveProperty("tckn");
    expect(cleanData).not.toHaveProperty("name");
  });

  it("analitik devre dışıyken trackPrivacySafeEvent hiçbir istek atmadan false dönmeli", () => {
    const result = trackPrivacySafeEvent("page_view", { page: "/kidem" });
    expect(result).toBe(false);
  });
});
