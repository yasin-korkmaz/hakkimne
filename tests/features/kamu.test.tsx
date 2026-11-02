/**
 * kamu.test.tsx — FAZ 7 Kamu & KPSS Nitelik Kodları Testleri
 * Dayanak: ÖSYM KPSS Önlisans Kılavuzu ve 657 DMK eşleştirme kuralları.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  matchPublicPositions,
  getQualificationInfo,
} from "@/features/kamu/kamuEngine";
import { KamuHub } from "@/features/kamu/KamuHub";
import KamuPage, { metadata } from "@/app/kamu/page";

describe("Kamu Engine — Nitelik Kodu ve Puan Eşleştirme", () => {
  it("3249 mezunu hem kendi alan kadrolarını hem de 3001 kadrolarını görebilmeli", () => {
    const res = matchPublicPositions({
      graduationCode: "3249",
      includeGeneral3001: true,
      noYdsRequired: false,
      noCertificateRequired: false,
      institutionCategory: "all",
    });

    expect(res.matches.length).toBeGreaterThan(0);
    const titles = res.matches.map((m) => m.position.title);
    expect(titles).toContain("Bilgisayar İşletmeni");
    expect(titles).toContain("Programcı");
    expect(titles).toContain("Memur / Büro Personeli");
  });

  it("includeGeneral3001 false olduğunda sadece 3249 doğrudan kadroları listelenmeli", () => {
    const res = matchPublicPositions({
      graduationCode: "3249",
      includeGeneral3001: false,
      noYdsRequired: false,
      noCertificateRequired: false,
      institutionCategory: "all",
    });

    const only3001Positions = res.matches.filter(
      (m) => m.position.graduationCodes.includes("3001") && !m.position.graduationCodes.includes("3249")
    );
    expect(only3001Positions.length).toBe(0);
  });

  it("3249 mezunlarına 6225 Bilgisayar Sertifikası muafiyeti tanınmalı", () => {
    const res = matchPublicPositions({
      graduationCode: "3249",
      includeGeneral3001: true,
      noYdsRequired: false,
      noCertificateRequired: false,
      institutionCategory: "all",
    });

    const isletmen = res.matches.find((m) => m.position.title === "Bilgisayar İşletmeni");
    expect(isletmen).toBeDefined();
    expect(isletmen?.appliedExemptions.length).toBeGreaterThan(0);
    expect(isletmen?.appliedExemptions[0]).toContain("6225 Bilgisayar Sertifikasından muafsınız");
  });

  it("puan seviyelerine göre high, moderate ve low şans durumları doğru atanmalı", () => {
    // 85.00 puan ile yüksek şans
    const resHigh = matchPublicPositions({
      p93Score: 85.0,
      graduationCode: "3249",
      includeGeneral3001: true,
      noYdsRequired: false,
      noCertificateRequired: false,
      institutionCategory: "all",
    });
    const highPos = resHigh.matches.find((m) => m.position.id === "bilgisayar-isletmeni-uni");
    expect(highPos?.chanceLevel).toBe("high");

    // 79.00 puan ile sınırda (min 80.15)
    const resMod = matchPublicPositions({
      p93Score: 79.0,
      graduationCode: "3249",
      includeGeneral3001: true,
      noYdsRequired: false,
      noCertificateRequired: false,
      institutionCategory: "all",
    });
    const modPos = resMod.matches.find((m) => m.position.id === "bilgisayar-isletmeni-uni");
    expect(modPos?.chanceLevel).toBe("moderate");

    // 70.00 puan ile düşük şans (min 80.15)
    const resLow = matchPublicPositions({
      p93Score: 70.0,
      graduationCode: "3249",
      includeGeneral3001: true,
      noYdsRequired: false,
      noCertificateRequired: false,
      institutionCategory: "all",
    });
    const lowPos = resLow.matches.find((m) => m.position.id === "bilgisayar-isletmeni-uni");
    expect(lowPos?.chanceLevel).toBe("low");
  });

  it("noYdsRequired true iken YDS şartı olan kadrolar elenmeli", () => {
    const res = matchPublicPositions({
      graduationCode: "3249",
      includeGeneral3001: true,
      noYdsRequired: true,
      noCertificateRequired: false,
      institutionCategory: "all",
    });

    const programci = res.matches.find((m) => m.position.title === "Programcı");
    expect(programci).toBeUndefined();
  });

  it("getQualificationInfo doğru nitelik açıklamalarını getirmeli", () => {
    const q3249 = getQualificationInfo("3249");
    expect(q3249?.title).toContain("Bilgisayar Programcılığı");
    const q6225 = getQualificationInfo("6225");
    expect(q6225?.title).toContain("Bilgisayar İşletmeni Sertifikası");
  });
});

describe("Kamu UI & Sayfa Render Testleri", () => {
  it("KamuHub bileşeni form, filtreler ve kadro kartlarını render etmeli", () => {
    render(<KamuHub />);

    expect(screen.getByText(/Kadro & Puan Eşleştirme/i)).toBeInTheDocument();
    expect(screen.getByText(/KPSS & Nitelik Kodları Rehberi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/KPSS P93 Önlisans Puanınız/i)).toBeInTheDocument();
    expect(screen.getByText(/Bilgisayar İşletmeni/i)).toBeInTheDocument();
  });

  it("Rehber sekmesine geçildiğinde 3249 ve 6225 rehber içeriği görünmeli", () => {
    render(<KamuHub />);

    const guideTab = screen.getByRole("button", { name: /KPSS & Nitelik Kodları Rehberi/i });
    fireEvent.click(guideTab);

    expect(screen.getByText(/Kritik Kural: 3249 Mezunları için 6225 Sertifika Muafiyeti/i)).toBeInTheDocument();
    expect(screen.getByText(/Merkezi Atama \(B Grubu\) ve Açıktan Alım/i)).toBeInTheDocument();
  });

  it("KamuPage SEO metadata sınırlarını karşılamalı", () => {
    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeLessThanOrEqual(60);
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeLessThanOrEqual(155);

    render(<KamuPage />);
    expect(screen.getByText(/Kamu Kadro & Nitelik Kodları Eşleştirme/i)).toBeInTheDocument();
  });
});
