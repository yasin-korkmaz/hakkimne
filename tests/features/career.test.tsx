/**
 * career.test.tsx — Kariyerim Modülü Birim ve UI Testleri
 * Dayanak: FAZ 6 — Kariyerim (Teklif Kıyaslama ve STAR Mülakat Simülatörü)
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  compareOffers,
  evaluateInterviewAnswer,
  type JobOffer,
  type OfferWeights,
} from "@/features/career";
import KariyerimPage from "@/app/kariyerim/page";

describe("FAZ 6: compareOffers Motor Testleri", () => {
  const offerA: JobOffer = {
    id: "a",
    companyName: "A Şirketi",
    grossSalary: 50000,
    mealAllowance: 4000,
    transportAllowance: 2000,
    bonusAnnual: 0,
    weeklyHours: 45,
    annualLeaveDays: 14,
    workModel: "office",
    commuteMinutes: 75,
  };

  const offerB: JobOffer = {
    id: "b",
    companyName: "B Şirketi",
    grossSalary: 55000,
    mealAllowance: 5000,
    transportAllowance: 0,
    bonusAnnual: 24000, // Ayda 2000 TL
    weeklyHours: 40,
    annualLeaveDays: 20,
    workModel: "remote",
    commuteMinutes: 0,
  };

  const weights: OfferWeights = {
    salary: 4,
    benefits: 3,
    workLifeBalance: 4,
    flexibility: 4,
  };

  it("aylık toplam nakit paketini ve saatlik kazancı doğru hesaplamalı", () => {
    const res = compareOffers(offerA, offerB, weights);

    // Offer A: 50000 + 4000 + 2000 + 0 = 56000 TL
    expect(res.offerA.monthlyTotalIncome).toBe(56000);

    // Offer B: 55000 + 5000 + 0 + (24000/12 = 2000) = 62000 TL
    expect(res.offerB.monthlyTotalIncome).toBe(62000);

    expect(res.offerA.hourlyEarnings).toBeGreaterThan(0);
    expect(res.offerB.hourlyEarnings).toBeGreaterThan(res.offerA.hourlyEarnings);
  });

  it("artılar ve eksiler iki teklif için de üretilmeli (uzaktan çalışma, saat avantajı)", () => {
    const res = compareOffers(offerA, offerB, weights);

    expect(res.offerB.pros.some((p) => p.includes("uzaktan"))).toBe(true);
    expect(res.offerB.pros.some((p) => p.includes("40 saat"))).toBe(true);
    expect(res.offerA.cons.some((c) => c.includes("ofis") || c.includes("45 saat"))).toBe(true);
  });

  it("ağırlıklı puanlar 0 ile 100 arasında hesaplanmalı", () => {
    const res = compareOffers(offerA, offerB, weights);
    expect(res.offerA.score).toBeGreaterThanOrEqual(0);
    expect(res.offerA.score).toBeLessThanOrEqual(100);
    expect(res.offerB.score).toBeGreaterThanOrEqual(0);
    expect(res.offerB.score).toBeLessThanOrEqual(100);
  });

  it("temel farklar özeti listelenmeli", () => {
    const res = compareOffers(offerA, offerB, weights);
    expect(res.keyDifferences.length).toBeGreaterThan(0);
  });
});

describe("FAZ 6: evaluateInterviewAnswer STAR Motor Testleri", () => {
  it("STAR metodunun tüm aşamalarını içeren cevaba yüksek puan ve rozet vermeli", () => {
    const solidAnswer =
      "Önceki şirketimde kritik bir canlı kesinti durumuyla karşılaştık. Görevim sistemin kök nedenini belirleyip veri kaybını önlemekti. Hemen mimari logları inceleyip hotfix geliştirdim ve rollback adımını uyguladım. Sonuç olarak kesinti süresini %40 azalttık ve müşteriden teşekkür aldık.";

    const evalResult = evaluateInterviewAnswer(solidAnswer);

    expect(evalResult.starEvaluation.hasSituation).toBe(true);
    expect(evalResult.starEvaluation.hasTask).toBe(true);
    expect(evalResult.starEvaluation.hasAction).toBe(true);
    expect(evalResult.starEvaluation.hasResult).toBe(true);
    expect(evalResult.starEvaluation.starScore).toBe(100);
    expect(evalResult.overallScore).toBeGreaterThanOrEqual(75);
    expect(evalResult.strengths.length).toBeGreaterThan(0);
  });

  it("eksik veya kısa yanıtlarda geliştirici tavsiyeler üretmeli", () => {
    const weakAnswer = "Hata çıkınca hemen düzelttim.";
    const evalResult = evaluateInterviewAnswer(weakAnswer);

    expect(evalResult.overallScore).toBeLessThan(60);
    expect(evalResult.improvements.length).toBeGreaterThan(0);
    expect(evalResult.starEvaluation.starScore).toBeLessThan(100);
  });
});

describe("FAZ 6: KariyerimPage UI Render Testi", () => {
  it("sayfa başlığı, sekmeler ve teklif formu alanları render edilmeli", () => {
    render(<KariyerimPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Kariyerim: Teklif Kıyaslama & Mülakat Simülatörü/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "İş Teklifi Karşılaştırma" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mülakat Simülatörü (STAR)" })
    ).toBeInTheDocument();
    expect(screen.getByText(/1. Seçenek/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Seçenek/i)).toBeInTheDocument();
  });
});
