"use client";

/**
 * KamuPositionCard.tsx — Kamu Kadro Kartı Bileşeni
 * Kadro unvanı, taban puan aralığı, şans seviyesi ve 6225 muafiyet rozetini gösterir.
 * Dayanak: ÖSYM KPSS merkezi atama sonuçları ve kurumsal tasarım tokenleri.
 */

import React, { useState } from "react";
import { PositionMatchItem } from "./types";
import { getQualificationInfo } from "./kamuEngine";

interface Props {
  item: PositionMatchItem;
  userScore?: number;
}

export function KamuPositionCard({ item, userScore }: Props) {
  const { position, chanceLevel, scoreDifference, appliedExemptions } = item;
  const [showDetails, setShowDetails] = useState(false);

  // Şans seviyesi stilleri
  const chanceConfig = {
    high: {
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      text: userScore ? `Yüksek Şans (+${scoreDifference})` : "Yüksek Potansiyel",
      dot: "bg-emerald-500",
    },
    moderate: {
      badge: "bg-amber-50 text-amber-800 border-amber-200",
      text: userScore ? `Sınırda / Rekabetçi (${scoreDifference})` : "Ortalama Rekabet",
      dot: "bg-amber-500",
    },
    low: {
      badge: "bg-slate-100 text-slate-700 border-slate-300",
      text: userScore ? `Düşük Şans (${scoreDifference})` : "Yüksek Taban Puan",
      dot: "bg-slate-400",
    },
  }[chanceLevel];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {position.institutionType}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-[#1769E0] font-medium">
              {position.appointmentType}
            </span>
          </div>
          <h3 className="text-base font-bold text-[#0B1F33]">{position.title}</h3>
        </div>

        {/* Şans Rozeti */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shrink-0 ${chanceConfig.badge}`}>
          <span className={`w-2 h-2 rounded-full ${chanceConfig.dot}`} />
          {chanceConfig.text}
        </div>
      </div>

      <p className="text-xs text-slate-600 mb-3 leading-relaxed">{position.dutySummary}</p>

      {/* Taban Puan Eğilimi */}
      <div className="bg-slate-50 rounded-lg p-3 mb-3 flex items-center justify-between text-xs">
        <span className="text-slate-500">Geçmiş Dönem Taban Puan Aralığı:</span>
        <span className="font-bold text-[#0B1F33]">
          {position.minBaseScore.toFixed(2)} - {position.maxBaseScore.toFixed(2)}
        </span>
      </div>

      {/* Muafiyet Notu (Varsa) */}
      {appliedExemptions.length > 0 && (
        <div className="bg-teal-50 border border-teal-200 text-teal-800 rounded-lg p-2.5 mb-3 text-xs flex items-start gap-2">
          <span className="font-bold shrink-0">✨ Muafiyet:</span>
          <span>{appliedExemptions.join(" ")}</span>
        </div>
      )}

      {/* Nitelik Kodları Etiketleri */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-medium">Kodlar:</span>
          {position.graduationCodes.map((code) => (
            <span key={code} className="px-2 py-0.5 rounded bg-blue-50 text-[#1769E0] font-semibold text-[11px]">
              {code}
            </span>
          ))}
          {position.conditionCodes.map((code) => (
            <span key={code} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
              {code}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-[#1769E0] hover:underline font-medium min-h-[36px] flex items-center"
        >
          {showDetails ? "Şartları Gizle" : "Şartları İncele"}
        </button>
      </div>

      {/* Kod Açıklama Detayı */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs bg-slate-50/60 p-3 rounded-lg">
          <div className="font-semibold text-slate-700 mb-1">Gereken Kodların Anlamı:</div>
          {[...position.graduationCodes, ...position.conditionCodes].map((code) => {
            const info = getQualificationInfo(code);
            return (
              <div key={code} className="flex items-start gap-2 text-slate-600">
                <span className="font-mono font-bold text-slate-800 shrink-0">[{code}]:</span>
                <span>{info ? `${info.title} — ${info.description}` : "ÖSYM Özel Şartı"}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
