import type { UserProfile, TrackingSummary, MilestoneItem } from "./types";
import {
  computeDuration,
  addMonthsClamped,
  addYearsClamped,
} from "@/lib/utils/dateDuration";
import { calculateAnnualLeave } from "@/features/annual-leave";
import { roundToKurus } from "@/lib/utils/money";

/**
 * engine.ts — Hak Takip Merkezi Hesaplama ve Özet Motoru
 * Dayanak: 1475 SK md. 14, 4857 SK md. 17, md. 41, md. 53 & md. 59
 */

function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function calculateDaysDifference(todayIso: string, targetDate: string): number {
  const d1 = new Date(todayIso).getTime();
  const d2 = new Date(targetDate).getTime();
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
}

export function computeProfileSummary(
  profile: UserProfile,
  refTodayIso?: string
): TrackingSummary {
  const todayIso = refTodayIso || getTodayIso();
  const duration = computeDuration(profile.startDate, todayIso);
  const completedYears = duration.years;
  const isEligibleForSeverance = completedYears >= 1;

  // Giydirilmiş Brüt
  const dressedMonthlyGross = roundToKurus(
    profile.grossSalary + (profile.monthlyExtra || 0)
  );

  // Yıllık İzin Hesabı
  const leaveResult = calculateAnnualLeave({
    completedYears,
    age: profile.age,
    grossSalary: profile.grossSalary,
    usedDays: profile.usedLeaveDays || 0,
  });

  // Saatlik Ücret (225 saat kuralı)
  const hourlyGrossRate =
    profile.grossSalary > 0 ? roundToKurus(profile.grossSalary / 225) : 0;

  // Fazla Mesai Toplamı
  let totalOvertimeHours = 0;
  let estimatedOvertimePay = 0;

  for (const entry of profile.overtimeEntries || []) {
    totalOvertimeHours += entry.hours;
    const multiplier = entry.type === "weekend_100" ? 2.0 : 1.5;
    estimatedOvertimePay += entry.hours * hourlyGrossRate * multiplier;
  }
  estimatedOvertimePay = roundToKurus(estimatedOvertimePay);

  // İhbar Haftası Hesabı (4857 md. 17)
  const totalMonths = completedYears * 12 + duration.months;
  let noticeWeeks = 2;
  if (totalMonths >= 36) noticeWeeks = 8;
  else if (totalMonths >= 18) noticeWeeks = 6;
  else if (totalMonths >= 6) noticeWeeks = 4;

  // Önemli Tarihler (Milestones)
  const milestones: MilestoneItem[] = [];

  // 1. Kıdem Eşiği (1. Yıl)
  const sevDate = addYearsClamped(profile.startDate, 1);
  const sevDiff = calculateDaysDifference(todayIso, sevDate);
  milestones.push({
    id: "severance_threshold",
    title: "1. Yıl Kıdem Tazminatı Eşiği",
    targetDate: sevDate,
    daysRemaining: sevDiff > 0 ? sevDiff : 0,
    isReached: sevDiff <= 0,
    legalBase: "1475 SK md. 14",
    description: "Kıdem tazminatına hak kazanmak için gereken asgari 1 tam yıllık çalışma süresi.",
  });

  // 2. Bir Sonraki İzin Yıldönümü
  const nextLeaveDate = addYearsClamped(profile.startDate, completedYears + 1);
  const leaveDiff = calculateDaysDifference(todayIso, nextLeaveDate);
  milestones.push({
    id: "next_leave_anniversary",
    title: `${completedYears + 1}. Yıl İzin Hak Edişi`,
    targetDate: nextLeaveDate,
    daysRemaining: leaveDiff > 0 ? leaveDiff : 0,
    isReached: false,
    legalBase: "4857 SK md. 53",
    description: "Yeni çalışma yılının tamamlanmasıyla hak kazanılacak bir sonraki yıllık izin dönemi.",
  });

  // 3. İhbar Süresi Kademesi Eşiği
  let nextNoticeTarget: string | null = null;
  let nextNoticeTitle = "";
  if (totalMonths < 6) {
    nextNoticeTarget = addMonthsClamped(profile.startDate, 6);
    nextNoticeTitle = "4 Haftalık İhbar Kademesi (6 Ay)";
  } else if (totalMonths < 18) {
    nextNoticeTarget = addMonthsClamped(profile.startDate, 18);
    nextNoticeTitle = "6 Haftalık İhbar Kademesi (1.5 Yıl)";
  } else if (totalMonths < 36) {
    nextNoticeTarget = addMonthsClamped(profile.startDate, 36);
    nextNoticeTitle = "8 Haftalık İhbar Kademesi (3 Yıl)";
  }

  if (nextNoticeTarget) {
    const noticeDiff = calculateDaysDifference(todayIso, nextNoticeTarget);
    milestones.push({
      id: "next_notice_step",
      title: nextNoticeTitle,
      targetDate: nextNoticeTarget,
      daysRemaining: noticeDiff > 0 ? noticeDiff : 0,
      isReached: noticeDiff <= 0,
      legalBase: "4857 SK md. 17",
      description: "İhbar sürenizin ve olası fesih bildirim hakkınızın bir üst kademeye yükseleceği tarih.",
    });
  }

  return {
    duration,
    completedYears,
    isEligibleForSeverance,
    totalEarnedLeaveDays: leaveResult.totalEarnedDays,
    remainingLeaveDays: leaveResult.remainingDays,
    estimatedLeavePay: leaveResult.grossLeavePay,
    hourlyGrossRate,
    totalOvertimeHours,
    estimatedOvertimePay,
    dressedMonthlyGross,
    noticeWeeks,
    milestones,
  };
}
