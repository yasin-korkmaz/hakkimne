/**
 * kamuEngine.ts — KPSS Önlisans Kadro ve Nitelik Eşleştirme Motoru
 * Algoritma: ÖSYM Tercih Kılavuzu nitelik kodu kuralları, 3249 mezuniyet avantajı,
 * 6225 Bilgisayar Sertifikası muafiyet mantığı ve P93 taban puan tolerans hesabı.
 * Dayanak: 657 sayılı DMK ve ÖSYM KPSS Merkezi Yerleştirme Kılavuzları.
 */

import { PUBLIC_POSITIONS, QUALIFICATION_CODES } from "./kamuData";
import {
  KamuFilterParams,
  PositionMatchItem,
  MatchSummary,
  ChanceLevel,
} from "./types";

/**
 * Kullanıcı parametrelerine göre uygun kamu kadrolarını filtreler ve şans seviyesini hesaplar.
 */
export function matchPublicPositions(params: KamuFilterParams): {
  matches: PositionMatchItem[];
  summary: MatchSummary;
} {
  const {
    p93Score,
    graduationCode,
    includeGeneral3001,
    noYdsRequired,
    noCertificateRequired,
    institutionCategory,
    searchQuery,
  } = params;

  const matches: PositionMatchItem[] = [];

  for (const pos of PUBLIC_POSITIONS) {
    // 1. Kurum türü filtresi
    if (institutionCategory !== "all") {
      if (institutionCategory === "universities" && pos.institutionType !== "Üniversiteler") continue;
      if (institutionCategory === "ministries" && pos.institutionType !== "Bakanlıklar") continue;
      if (institutionCategory === "agencies" && !["KİT / Genel Md.", "Adalet Birimleri"].includes(pos.institutionType)) continue;
    }

    // 2. Arama metni filtresi
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const matchText = `${pos.title} ${pos.dutySummary} ${pos.institutionType}`.toLowerCase();
      if (!matchText.includes(q)) continue;
    }

    // 3. Mezuniyet kodu uygunluğu
    const hasDirectCode = pos.graduationCodes.includes(graduationCode);
    const has3001Code = pos.graduationCodes.includes("3001");
    const isGraduationEligible = hasDirectCode || (includeGeneral3001 && has3001Code);

    if (!isGraduationEligible) continue;

    // 4. Özel şartlar ve muafiyetler
    const appliedExemptions: string[] = [];
    const hasYdsCondition = pos.conditionCodes.some((c) => ["7111", "7113"].includes(c));
    if (noYdsRequired && hasYdsCondition) continue;

    // 6225 Sertifika muafiyeti: 3249 mezunları transkript sayesinde 6225 sertifikasından muaftır
    const requires6225 = pos.conditionCodes.includes("6225");
    if (requires6225 && graduationCode === "3249") {
      appliedExemptions.push("3249 mezuniyeti nedeniyle 6225 Bilgisayar Sertifikasından muafsınız.");
    }

    // Sertifika filtresi: Eğer kullanıcı ek şart istemiyorsa ve muaf olunmayan şart varsa ele
    if (noCertificateRequired) {
      const blockingConditions = pos.conditionCodes.filter((c) => {
        if (c === "7225") return false; // Güvenlik tahkikatı standarttır
        if (c === "6225" && graduationCode === "3249") return false; // Muaf
        return true;
      });
      if (blockingConditions.length > 0) continue;
    }

    // 5. Puan farkı ve şans seviyesi hesabı
    const userScore = typeof p93Score === "number" && !isNaN(p93Score) ? p93Score : undefined;
    let chanceLevel: ChanceLevel = "moderate";
    let scoreDifference = 0;

    if (userScore !== undefined) {
      scoreDifference = Math.round((userScore - pos.minBaseScore) * 100) / 100;
      if (scoreDifference >= 0) {
        chanceLevel = "high";
      } else if (scoreDifference >= -2.0) {
        chanceLevel = "moderate";
      } else {
        chanceLevel = "low";
      }
    }

    matches.push({
      position: pos,
      isEligible: true,
      chanceLevel,
      scoreDifference,
      appliedExemptions,
    });
  }

  // Sıralama: Kullanıcı puanı varsa puana göre en yüksek şanslılar en başta
  matches.sort((a, b) => {
    const chanceOrder: Record<ChanceLevel, number> = { high: 3, moderate: 2, low: 1 };
    if (chanceOrder[a.chanceLevel] !== chanceOrder[b.chanceLevel]) {
      return chanceOrder[b.chanceLevel] - chanceOrder[a.chanceLevel];
    }
    return b.scoreDifference - a.scoreDifference;
  });

  const summary: MatchSummary = {
    totalMatched: matches.length,
    highChanceCount: matches.filter((m) => m.chanceLevel === "high").length,
    moderateChanceCount: matches.filter((m) => m.chanceLevel === "moderate").length,
    lowChanceCount: matches.filter((m) => m.chanceLevel === "low").length,
    minScoreNeeded: matches.length > 0 ? Math.min(...matches.map((m) => m.position.minBaseScore)) : 0,
  };

  return { matches, summary };
}

/**
 * Nitelik koduna karşılık gelen açıklamayı döner.
 */
export function getQualificationInfo(code: string) {
  return QUALIFICATION_CODES.find((c) => c.code === code);
}
