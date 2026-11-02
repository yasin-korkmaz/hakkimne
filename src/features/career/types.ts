/**
 * types.ts — Kariyerim Modülü Tür Tanımları
 * İş Teklifi Karşılaştırma ve Mülakat Simülatörü
 */

export type WorkModel = "remote" | "hybrid" | "office";

export interface JobOffer {
  id: string;
  companyName: string;
  grossSalary: number;
  mealAllowance: number;      // Aylık yemek yardımı
  transportAllowance: number; // Aylık yol yardımı
  bonusAnnual: number;        // Yıllık prim / ikramiye
  weeklyHours: number;        // Haftalık çalışma saati (örn: 40 veya 45)
  annualLeaveDays: number;    // Yıllık izin günü (örn: 14 veya 20)
  workModel: WorkModel;       // Ofis / Hibrit / Uzaktan
  commuteMinutes: number;     // Günlük gidiş-dönüş toplam ulaşım süresi (dakika)
}

export interface OfferWeights {
  salary: number;      // 1 - 5 arası ağırlık
  benefits: number;    // 1 - 5 arası ağırlık
  workLifeBalance: number; // 1 - 5 arası ağırlık
  flexibility: number; // 1 - 5 arası ağırlık
}

export interface OfferAnalysis {
  offer: JobOffer;
  monthlyTotalIncome: number;
  hourlyEarnings: number;
  pros: string[];
  cons: string[];
  score: number; // 0 - 100 arası ağırlıklı puan
}

export interface OfferComparisonResult {
  offerA: OfferAnalysis;
  offerB: OfferAnalysis;
  keyDifferences: string[];
}

export type InterviewRole =
  | "software_engineer"
  | "hr_specialist"
  | "sales_rep"
  | "finance_specialist"
  | "marketing_specialist"
  | "customer_success";

export interface InterviewQuestion {
  id: string;
  role: InterviewRole;
  category: "technical" | "behavioral" | "situational";
  questionText: string;
  contextHint: string;
  idealKeyElements: string[];
}

export interface StarEvaluation {
  hasSituation: boolean;
  hasTask: boolean;
  hasAction: boolean;
  hasResult: boolean;
  starScore: number; // 0 - 100
}

export interface InterviewEvaluation {
  overallScore: number; // 0 - 100
  clarityScore: number; // 0 - 100
  exampleScore: number; // 0 - 100
  starEvaluation: StarEvaluation;
  strengths: string[];
  improvements: string[];
  generalFeedback: string;
}
