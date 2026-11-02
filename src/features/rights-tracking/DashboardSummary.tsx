import React from "react";
import type { UserProfile, TrackingSummary } from "./types";
import { formatTRY } from "@/lib/utils/format";

interface DashboardSummaryProps {
  profile: UserProfile;
  summary: TrackingSummary;
  onEditProfile: () => void;
}

export default function DashboardSummary({
  profile,
  summary,
  onEditProfile,
}: DashboardSummaryProps) {
  const { duration } = summary;

  return (
    <div className="flex flex-col gap-6">
      {/* Profil Başlık ve Hızlı Düzenleme */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {profile.sector || "Özel Sektör"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F33] mt-1">
            Çalışma Hakları Özeti
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            İşe Giriş: <strong className="text-slate-800">{profile.startDate}</strong> • Haftalık:{" "}
            <strong>{profile.weeklyContractHours || 45} saat</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={onEditProfile}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors min-h-[44px]"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Profili Düzenle
        </button>
      </div>

      {/* 4 Ana Metrik Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Hizmet Süresi */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Hizmet Süresi</span>
            <div className="text-lg sm:text-xl font-bold text-[#0B1F33] mt-1">
              {duration.years} yıl {duration.months} ay {duration.days} gün
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Kıdem Hakkı:</span>
            {summary.isEligibleForSeverance ? (
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Kazanıldı (1+ Yıl)
              </span>
            ) : (
              <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                1 Yıl Dolmadı
              </span>
            )}
          </div>
        </div>

        {/* 2. Yıllık İzin */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Kalan Yıllık İzin</span>
            <div className="text-lg sm:text-xl font-bold text-[#0F766E] mt-1">
              {summary.remainingLeaveDays} Gün Kalan
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Hak edilen: {summary.totalEarnedLeaveDays} gün • Kullanılan: {profile.usedLeaveDays || 0} gün
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">İzin Karşılığı:</span>
            <span className="font-semibold text-slate-800">
              {formatTRY(summary.estimatedLeavePay)}
            </span>
          </div>
        </div>

        {/* 3. Giydirilmiş Brüt ve İhbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Giydirilmiş Brüt</span>
            <div className="text-lg sm:text-xl font-bold text-[#1769E0] mt-1">
              {formatTRY(summary.dressedMonthlyGross)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Çıplak: {formatTRY(profile.grossSalary)} + Yan: {formatTRY(profile.monthlyExtra)}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">İhbar Süresi:</span>
            <span className="font-semibold text-[#123C68]">
              {summary.noticeWeeks} Hafta Önel
            </span>
          </div>
        </div>

        {/* 4. Saatlik Ücret & Fazla Mesai */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Saatlik Brüt Ücret</span>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              {formatTRY(summary.hourlyGrossRate)} / sa
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              225 saat standart yasal bölen
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Kayıtlı Mesai:</span>
            <span className="font-semibold text-slate-800">
              {summary.totalOvertimeHours} sa ({formatTRY(summary.estimatedOvertimePay)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
