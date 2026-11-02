/**
 * documentChecker.test.tsx — AI Belge Kontrolü Birim ve Entegrasyon Testleri
 * Dayanak: FAZ 5 — AI Belge Kontrolü (Görev Odaklı, Gizlilik Esaslı Hukuki Denetim)
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  analyzeDocument,
  validateUploadedFile,
  formatFileSize,
  type DocumentType,
} from "@/features/document-checker";
import BelgeKontroluPage from "@/app/belge-kontrolu/page";

describe("FAZ 5: validateUploadedFile Doğrulama Testleri", () => {
  it("KVKK kişisel veri maskeleme onayı yoksa hata döndürmeli", () => {
    const file = { name: "bordro.pdf", size: 1024 * 500, type: "application/pdf" };
    const res = validateUploadedFile(file, false);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("PII_CONFIRMATION_REQUIRED");
    }
  });

  it("10 MB üzerindeki dosyaları reddetmeli", () => {
    const file = {
      name: "buyuk_dosya.pdf",
      size: 11 * 1024 * 1024,
      type: "application/pdf",
    };
    const res = validateUploadedFile(file, true);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("FILE_TOO_LARGE");
    }
  });

  it("desteklenmeyen dosya uzantılarını (.exe, .zip) reddetmeli", () => {
    const file = { name: "zararli.exe", size: 1024, type: "application/x-msdownload" };
    const res = validateUploadedFile(file, true);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("INVALID_FILE_TYPE");
    }
  });

  it("geçerli PDF veya resim dosyasını kabul etmeli", () => {
    const file = { name: "bordro_2026.pdf", size: 1024 * 800, type: "application/pdf" };
    const res = validateUploadedFile(file, true);
    expect(res.ok).toBe(true);
  });

  it("formatFileSize dosya boyutlarını doğru formatlamalı", () => {
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(3 * 1024 * 1024)).toBe("3.0 MB");
  });
});

describe("FAZ 5: analyzeDocument Hukuki Analiz Motoru Testleri", () => {
  const docTypes: DocumentType[] = [
    "pay_slip",
    "employment_contract",
    "termination_notice",
    "leave_form",
  ];

  for (const docType of docTypes) {
    it(`${docType} belgesi için kategori ve kanun maddeli bulgular üretilmeli`, () => {
      const res = analyzeDocument({
        documentType: docType,
        fileName: "test_doc.pdf",
        fileSizeBytes: 2048,
        mimeType: "application/pdf",
        hasRedactedPii: true,
      });

      expect(res.ok).toBe(true);
      expect(res.findings.length).toBeGreaterThanOrEqual(4);
      expect(res.summaryCounts).toBeDefined();

      for (const finding of res.findings) {
        expect(finding.id).toBeDefined();
        expect(finding.title).toBeDefined();
        expect(finding.legalBase).toMatch(/\d+ SK|Yargıtay/);
        expect(finding.recommendation).toBeDefined();
      }
    });
  }

  it("maaş bordrosu fazla mesai ve kıdem araçlarına yönlendirmelidir", () => {
    const res = analyzeDocument({
      documentType: "pay_slip",
      fileName: "bordro.pdf",
      fileSizeBytes: 1024,
      mimeType: "application/pdf",
      hasRedactedPii: true,
    });

    const overtimeFinding = res.findings.find((f) => f.id === "ps_2");
    expect(overtimeFinding?.relatedTool?.href).toBe("/fazla-mesai-hesaplama");

    const severanceFinding = res.findings.find((f) => f.id === "ps_4");
    expect(severanceFinding?.relatedTool?.href).toBe("/kidem-tazminati-hesaplama");
  });

  it("fesih bildirimi ihbar süresi hesaplayıcısına yönlendirmelidir", () => {
    const res = analyzeDocument({
      documentType: "termination_notice",
      fileName: "fesih.pdf",
      fileSizeBytes: 1024,
      mimeType: "application/pdf",
      hasRedactedPii: true,
    });

    const noticeFinding = res.findings.find((f) => f.id === "tn_3");
    expect(noticeFinding?.relatedTool?.href).toBe("/ihbar-suresi-hesaplama");
  });
});

describe("FAZ 5: BelgeKontroluPage UI Render Testi", () => {
  it("sayfa H1 başlığı ve belge türü seçenekleri render edilmeli", () => {
    render(<BelgeKontroluPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "İş Belgesi Hukuki Kontrolü" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Maaş Bordrosu/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /İş Sözleşmesi/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Fesih Bildirimi/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /İzin Belgesi/i })).toBeInTheDocument();
  });
});
