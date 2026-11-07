/**
 * netBrut.test.ts
 * 2026 Net-Brüt Maaş Hesaplama Motoru Birim Testleri
 */

import { describe, it, expect } from "vitest";
import {
  netBrutHesapla,
  bruttenNete,
  nettenBrute,
  gelirVergisiHesapla,
} from "@/lib/netBrutHesapla";

describe("2026 Gelir Vergisi Dilimleri Hesaplama", () => {
  it("158.000 TL'ye kadar matrahta %15 vergi hesaplamalı", () => {
    const { vergi, dilimEtiketi } = gelirVergisiHesapla(100000, 0);
    expect(vergi).toBe(15000);
    expect(dilimEtiketi).toBe("%15");
  });

  it("158.000 TL aşımında %20 dilimine geçmeli", () => {
    // 158.000 * 0.15 = 23.700 TL + 42.000 * 0.20 = 8.400 TL => 32.100 TL
    const { vergi, dilimEtiketi } = gelirVergisiHesapla(200000, 0);
    expect(vergi).toBe(32100);
    expect(dilimEtiketi).toBe("%20");
  });

  it("Kümülatif matrah verildiğinde dilim geçişini doğru hesaplamalı", () => {
    // Kümülatif: 158.000 (1. dilim dolmuş), bu ay matrah: 50.000 tamamı %20'den
    const { vergi, dilimEtiketi } = gelirVergisiHesapla(50000, 158000);
    expect(vergi).toBe(10000);
    expect(dilimEtiketi).toBe("%20");
  });
});

describe("bruttenNete", () => {
  it("50.000 TL brüt için kesintileri ve net tutarı doğru hesaplamalı", () => {
    // Brüt: 50.000
    // SGK İşçi (%14): 7.000
    // İşsizlik (%1): 500
    // Matrah: 42.500
    // Gelir Vergisi (%15): 6.375
    // Damga Vergisi (%0.759): 379.50
    // Toplam Kesinti: 7.000 + 500 + 6.375 + 379.50 = 14.254,50
    // Net: 35.745,50
    const res = bruttenNete(50000);
    expect(res.brutUcret).toBe(50000);
    expect(res.sgkIsci).toBe(7000);
    expect(res.issizlikIsci).toBe(500);
    expect(res.gelirVergisiMatrahi).toBe(42500);
    expect(res.gelirVergisi).toBe(6375);
    expect(res.damgaVergisi).toBe(379.5);
    expect(res.toplamKesinti).toBe(14254.5);
    expect(res.netUcret).toBe(35745.5);
  });

  it("0 veya negatif brüt girildiğinde sıfır dönmeli", () => {
    const res = bruttenNete(0);
    expect(res.netUcret).toBe(0);
    expect(res.toplamKesinti).toBe(0);
  });
});

describe("nettenBrute & Çift Yönlü Tutarlılık", () => {
  it("Netten brüte hesaplama, ters işlemde aynı net tutarı kuruşu kuruşuna vermeli", () => {
    const targetNet = 35745.5;
    const res = nettenBrute(targetNet);
    expect(res.brutUcret).toBe(50000);
    expect(res.netUcret).toBe(targetNet);
  });

  it("netBrutHesapla genel fonksiyonu her iki yön için de tutarlı çalışmalı", () => {
    const brutRes = netBrutHesapla(50000, "brut_to_net");
    expect(brutRes.netUcret).toBe(35745.5);

    const netRes = netBrutHesapla(35745.5, "net_to_brut");
    expect(netRes.brutUcret).toBe(50000);
  });
});
