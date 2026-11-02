import type {
  JobOffer,
  OfferWeights,
  OfferAnalysis,
  OfferComparisonResult,
} from "./types";
import { roundToKurus } from "@/lib/utils/money";

/**
 * offerEngine.ts — İş Teklifi Karşılaştırma ve Analiz Motoru
 * İki teklifin finansal ve yaşam dengesi kriterlerini normalize ederek kıyaslar.
 */

export const DEFAULT_WEIGHTS: OfferWeights = {
  salary: 4,
  benefits: 3,
  workLifeBalance: 4,
  flexibility: 3,
};

function analyzeSingleOffer(
  offer: JobOffer,
  otherOffer: JobOffer,
  weights: OfferWeights
): OfferAnalysis {
  const monthlyBonus = offer.bonusAnnual / 12;
  const monthlyTotalIncome = roundToKurus(
    offer.grossSalary + offer.mealAllowance + offer.transportAllowance + monthlyBonus
  );

  const monthlyHours = offer.weeklyHours * 4.33;
  const hourlyEarnings = monthlyHours > 0 ? roundToKurus(monthlyTotalIncome / monthlyHours) : 0;

  const pros: string[] = [];
  const cons: string[] = [];

  // Çalışma Modeli ve Ulaşım
  if (offer.workModel === "remote") {
    pros.push("Tam uzaktan çalışma (sıfır ulaşım süresi ve ev konforu)");
  } else if (offer.workModel === "hybrid") {
    pros.push("Hibrit model (ofis ve ev esnekliği dengesi)");
  } else {
    cons.push("Haftanın 5 günü tam ofis çalışması");
  }

  if (offer.commuteMinutes > 60 && offer.workModel !== "remote") {
    cons.push(`Günlük ${offer.commuteMinutes} dakika gidiş-dönüş ulaşım süresi`);
  } else if (offer.commuteMinutes <= 30 && offer.workModel !== "remote") {
    pros.push("Yakın konum / 30 dakikanın altında kısa ulaşım");
  }

  // Çalışma Süresi & İzin
  if (offer.weeklyHours <= 40) {
    pros.push(`Haftalık ${offer.weeklyHours} saat çalışma (yasal sınırdan daha rahat)`);
  } else if (offer.weeklyHours >= 45) {
    cons.push("Haftalık 45 saat üst sınırda standart çalışma temposu");
  }

  if (offer.annualLeaveDays > 14) {
    pros.push(`Yasal sürenin üzerinde ${offer.annualLeaveDays} gün yıllık izin`);
  }

  // Karşılaştırmalı Gelir Değerlendirmesi
  const otherMonthlyBonus = otherOffer.bonusAnnual / 12;
  const otherTotal = otherOffer.grossSalary + otherOffer.mealAllowance + otherOffer.transportAllowance + otherMonthlyBonus;

  if (monthlyTotalIncome > otherTotal) {
    const diff = monthlyTotalIncome - otherTotal;
    pros.push(`Diğer teklife göre aylık ${Math.round(diff).toLocaleString("tr-TR")} TL daha yüksek toplam gelir`);
  } else if (monthlyTotalIncome < otherTotal) {
    const diff = otherTotal - monthlyTotalIncome;
    cons.push(`Diğer teklife göre aylık ${Math.round(diff).toLocaleString("tr-TR")} TL daha düşük toplam gelir`);
  }

  // Ağırlıklı Puanlama (0 - 100)
  const maxIncome = Math.max(monthlyTotalIncome, otherTotal, 1);
  const salaryScore = (monthlyTotalIncome / maxIncome) * 100;

  const benefitsTotal = offer.mealAllowance + offer.transportAllowance + monthlyBonus;
  const otherBenefitsTotal = otherOffer.mealAllowance + otherOffer.transportAllowance + otherMonthlyBonus;
  const maxBenefits = Math.max(benefitsTotal, otherBenefitsTotal, 1);
  const benefitsScore = (benefitsTotal / maxBenefits) * 100;

  const balanceScore = Math.max(0, 100 - (offer.weeklyHours - 35) * 8) + (offer.annualLeaveDays - 14) * 3;

  let flexScore = offer.workModel === "remote" ? 100 : offer.workModel === "hybrid" ? 70 : 40;
  if (offer.workModel !== "remote") {
    flexScore = Math.max(10, flexScore - (offer.commuteMinutes / 120) * 30);
  }

  const totalWeight = weights.salary + weights.benefits + weights.workLifeBalance + weights.flexibility;
  const weightedScore =
    (salaryScore * weights.salary +
      benefitsScore * weights.benefits +
      Math.min(100, balanceScore) * weights.workLifeBalance +
      Math.min(100, flexScore) * weights.flexibility) /
    (totalWeight || 1);

  return {
    offer,
    monthlyTotalIncome,
    hourlyEarnings,
    pros,
    cons,
    score: Math.round(weightedScore),
  };
}

export function compareOffers(
  offerA: JobOffer,
  offerB: JobOffer,
  weights: OfferWeights = DEFAULT_WEIGHTS
): OfferComparisonResult {
  const analysisA = analyzeSingleOffer(offerA, offerB, weights);
  const analysisB = analyzeSingleOffer(offerB, offerA, weights);

  const keyDifferences: string[] = [];

  const incDiff = analysisA.monthlyTotalIncome - analysisB.monthlyTotalIncome;
  if (Math.abs(incDiff) >= 1000) {
    keyDifferences.push(
      incDiff > 0
        ? `${offerA.companyName}, ${offerB.companyName}'den aylık ${Math.round(incDiff).toLocaleString("tr-TR")} TL daha yüksek toplam nakit paketine sahip.`
        : `${offerB.companyName}, ${offerA.companyName}'den aylık ${Math.round(Math.abs(incDiff)).toLocaleString("tr-TR")} TL daha yüksek toplam nakit paketine sahip.`
    );
  }

  if (offerA.workModel !== offerB.workModel) {
    keyDifferences.push(
      `Çalışma modeli farkı: ${offerA.companyName} (${offerA.workModel === "remote" ? "Uzaktan" : offerA.workModel === "hybrid" ? "Hibrit" : "Ofis"}) vs ${offerB.companyName} (${offerB.workModel === "remote" ? "Uzaktan" : offerB.workModel === "hybrid" ? "Hibrit" : "Ofis"}).`
    );
  }

  if (offerA.weeklyHours !== offerB.weeklyHours) {
    keyDifferences.push(
      `Haftalık çalışma süresi: ${offerA.companyName} (${offerA.weeklyHours} saat) vs ${offerB.companyName} (${offerB.weeklyHours} saat).`
    );
  }

  return {
    offerA: analysisA,
    offerB: analysisB,
    keyDifferences,
  };
}
