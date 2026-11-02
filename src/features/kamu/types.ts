/**
 * types.ts — HakkımNedir Kamu & KPSS Nitelik Kodları Modülü Tipleri
 * Dayanak: ÖSYM KPSS Önlisans (P93) Tercih Kılavuzu ve 657 Sayılı DMK.
 */

export interface QualificationCode {
  code: string; // örn: "3249", "3001", "6225"
  type: "graduation" | "condition"; // mezuniyet veya özel şart
  title: string;
  description: string;
}

export type ChanceLevel = "high" | "moderate" | "low";

export type InstitutionCategory = "universities" | "ministries" | "agencies" | "all";

export interface PublicPosition {
  id: string;
  title: string; // örn: "Bilgisayar İşletmeni"
  institutionType: "Üniversiteler" | "Bakanlıklar" | "KİT / Genel Md." | "Adalet Birimleri";
  graduationCodes: string[]; // örn: ["3249", "3001"]
  conditionCodes: string[]; // örn: ["6225"]
  minBaseScore: number; // örn: 80.25 (geçmiş atama taban puanı alt sınırı)
  maxBaseScore: number; // örn: 85.50
  appointmentType: "Merkezi Atama (B Grubu)" | "Sözleşmeli Personel (4/B)";
  dutySummary: string;
  exemptionNote?: string; // örn: "3249 mezunları 6225 sertifikasından muaftır."
}

export interface KamuFilterParams {
  p93Score?: number;
  graduationCode: string; // örn: "3249"
  includeGeneral3001: boolean; // 3001 kodlu kadroları da göster
  noYdsRequired: boolean; // YDS istemeyen kadrolar
  noCertificateRequired: boolean; // Ek sertifika istemeyenler (veya muaf olunanlar)
  institutionCategory: InstitutionCategory;
  searchQuery?: string;
}

export interface PositionMatchItem {
  position: PublicPosition;
  isEligible: boolean;
  chanceLevel: ChanceLevel;
  scoreDifference: number; // kullaniciPuani - minBaseScore
  appliedExemptions: string[];
}

export interface MatchSummary {
  totalMatched: number;
  highChanceCount: number;
  moderateChanceCount: number;
  lowChanceCount: number;
  minScoreNeeded: number;
}
