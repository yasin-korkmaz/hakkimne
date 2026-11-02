/**
 * types.ts — Hak Takip Merkezi Veri ve Profil Türleri
 * Veriler tamamen istemci tarafında (localStorage) saklanır.
 */

import type { Duration } from "@/lib/utils/dateDuration";

export type OvertimeType = "overtime_50" | "weekend_100";

export const SECTORS = [
  "Özel Sektör / Bilişim ve Teknoloji",
  "Finans / Bankacılık / Sigortacılık",
  "Perakende / Mağazacılık / E-Ticaret",
  "Sanayi / İmalat / Otomotiv",
  "Sağlık ve Medikal Hizmetler",
  "Turizm / Konaklama / Yeme-İçme",
  "İnşaat / Mimarlık / Mühendislik",
  "Lojistik / Taşımacılık",
  "Hizmet ve Diğer Sektörler",
] as const;

export interface OvertimeLog {
  id: string;
  date: string;
  hours: number;
  type: OvertimeType;
  description?: string;
}

export interface UserProfile {
  startDate: string;
  grossSalary: number;
  monthlyExtra: number;
  weeklyContractHours: number;
  age?: number;
  usedLeaveDays: number;
  sector?: string;
  overtimeEntries: OvertimeLog[];
  lastUpdated: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  targetDate: string;
  daysRemaining: number;
  isReached: boolean;
  legalBase: string;
  description: string;
}

export interface TrackingSummary {
  duration: Duration;
  completedYears: number;
  isEligibleForSeverance: boolean;
  totalEarnedLeaveDays: number;
  remainingLeaveDays: number;
  estimatedLeavePay: number;
  hourlyGrossRate: number;
  totalOvertimeHours: number;
  estimatedOvertimePay: number;
  dressedMonthlyGross: number;
  noticeWeeks: number;
  milestones: MilestoneItem[];
}
