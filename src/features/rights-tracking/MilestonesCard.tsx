import React from "react";
import Link from "next/link";
import type { MilestoneItem, UserProfile } from "./types";

interface MilestonesCardProps {
  milestones: MilestoneItem[];
  profile: UserProfile;
}

export default function MilestonesCard({ milestones }: MilestonesCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Yasal Eşikler ve Önemli Tarihler */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#0B1F33]">Yasal Eşikler ve Tarihler</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            İş Kanunu kapsamındaki kritik hak ediş ve bildirim dönüm noktalarınız.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {milestones.map((m) => (
            <div
              key={m.id}
              className={`p-3.5 rounded-xl border flex flex-col gap-1 transition-all ${
                m.isReached
                  ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                  : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm">{m.title}</span>
                {m.isReached ? (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    Tamamlandı
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-[#1769E0] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {m.daysRemaining} gün kaldı
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <span>Hedef: <strong>{m.targetDate}</strong></span>
                <span>•</span>
                <span className="text-slate-500 font-medium">{m.legalBase}</span>
              </div>

              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Hesaplayıcılara Hızlı Aktarım */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#0B1F33]">Hesaplama Modüllerine Git</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Profilinizdeki verilerle detaylı mevzuat hesaplamalarına anında geçiş yapın.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/kidem-tazminati-hesaplama"
            className="p-3.5 border border-slate-200 hover:border-[#1769E0] bg-slate-50/50 hover:bg-blue-50/40 rounded-xl flex flex-col gap-1 transition-all group"
          >
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#1769E0]">
              Kıdem Tazminatı →
            </span>
            <span className="text-[11px] text-slate-500">
              1475 md. 14 tavan ve net hesap
            </span>
          </Link>

          <Link
            href="/ihbar-tazminati-hesaplama"
            className="p-3.5 border border-slate-200 hover:border-[#1769E0] bg-slate-50/50 hover:bg-blue-50/40 rounded-xl flex flex-col gap-1 transition-all group"
          >
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#1769E0]">
              İhbar Tazminatı →
            </span>
            <span className="text-[11px] text-slate-500">
              4857 md. 17 kademe ve vergi
            </span>
          </Link>

          <Link
            href="/yillik-izin-ucreti-hesaplama"
            className="p-3.5 border border-slate-200 hover:border-teal-600 bg-slate-50/50 hover:bg-teal-50/40 rounded-xl flex flex-col gap-1 transition-all group"
          >
            <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700">
              Yıllık İzin Ücreti →
            </span>
            <span className="text-[11px] text-slate-500">
              4857 md. 53/59 gün ve brüt/net
            </span>
          </Link>

          <Link
            href="/fazla-mesai-hesaplama"
            className="p-3.5 border border-slate-200 hover:border-[#1769E0] bg-slate-50/50 hover:bg-blue-50/40 rounded-xl flex flex-col gap-1 transition-all group"
          >
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#1769E0]">
              Fazla Mesai Hesaplama →
            </span>
            <span className="text-[11px] text-slate-500">
              %25 ve %50 zamlı saat hesabı
            </span>
          </Link>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>İhbar süresi ve olası bitiş tarihi:</span>
          <Link
            href="/ihbar-suresi-hesaplama"
            className="font-semibold text-[#1769E0] hover:underline"
          >
            İhbar Süresi Hesapla →
          </Link>
        </div>
      </div>
    </div>
  );
}
