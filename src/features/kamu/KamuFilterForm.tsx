"use client";

/**
 * KamuFilterForm.tsx — KPSS P93 Puanı ve Nitelik Filtreleme Formu
 * Dayanak: ÖSYM KPSS Önlisans merkezi yerleştirme tercih parametreleri.
 */

import React from "react";
import { KamuFilterParams, InstitutionCategory } from "./types";
import { QUALIFICATION_CODES } from "./kamuData";

interface Props {
  params: KamuFilterParams;
  onChange: (updated: KamuFilterParams) => void;
  onReset: () => void;
}

const GRADUATION_OPTIONS = QUALIFICATION_CODES.filter((c) => c.type === "graduation");

const INSTITUTIONS: { value: InstitutionCategory; label: string }[] = [
  { value: "all", label: "Tüm Kurumlar" },
  { value: "universities", label: "Üniversiteler" },
  { value: "ministries", label: "Bakanlıklar" },
  { value: "agencies", label: "KİT & Adalet" },
];

export function KamuFilterForm({ params, onChange, onReset }: Props) {
  const handleScoreChange = (val: string) => {
    const num = parseFloat(val);
    onChange({
      ...params,
      p93Score: isNaN(num) ? undefined : num,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-[#0B1F33]">Kadro ve Puan Filtreleme</h2>
          <p className="text-xs text-slate-500">KPSS P93 puanınız ve mezuniyetinize uygun kadroları listeleyin</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#1769E0] hover:underline font-medium min-h-[36px] px-2 py-1"
        >
          Filtreleri Sıfırla
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* P93 Puanı */}
        <div>
          <label htmlFor="p93-score-input" className="block text-xs font-semibold text-slate-700 mb-1">
            KPSS P93 Önlisans Puanınız
          </label>
          <div className="relative">
            <input
              id="p93-score-input"
              type="number"
              step="0.01"
              min="50"
              max="100"
              placeholder="Örn: 82.45"
              value={params.p93Score ?? ""}
              onChange={(e) => handleScoreChange(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1769E0]"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">P93</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Taban puan kıyaslaması için puanınızı giriniz.</span>
        </div>

        {/* Mezuniyet Alan Kodu */}
        <div>
          <label htmlFor="grad-code-select" className="block text-xs font-semibold text-slate-700 mb-1">
            Önlisans Mezuniyet Alanı / Nitelik Kodu
          </label>
          <select
            id="grad-code-select"
            value={params.graduationCode}
            onChange={(e) => onChange({ ...params, graduationCode: e.target.value })}
            className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1769E0] bg-white"
          >
            {GRADUATION_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.code} - {opt.title}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-400 mt-1 block">3249: Bilgisayar Programcılığı / Teknolojisi</span>
        </div>
      </div>

      {/* Kurum Türü Seçimi */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kurum Türü</label>
        <div className="flex flex-wrap gap-2">
          {INSTITUTIONS.map((inst) => (
            <button
              key={inst.value}
              type="button"
              onClick={() => onChange({ ...params, institutionCategory: inst.value })}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all min-h-[36px] flex items-center ${
                params.institutionCategory === inst.value
                  ? "bg-[#0B1F33] text-white border-[#0B1F33] font-semibold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {inst.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ek Kriter Kutucukları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
        <label className="flex items-center gap-2 cursor-pointer min-h-[36px]">
          <input
            type="checkbox"
            checked={params.includeGeneral3001}
            onChange={(e) => onChange({ ...params, includeGeneral3001: e.target.checked })}
            className="w-4 h-4 rounded text-[#1769E0] focus:ring-[#1769E0] border-slate-300"
          />
          <span>3001 Genel Kadroları Dahil Et</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer min-h-[36px]">
          <input
            type="checkbox"
            checked={params.noYdsRequired}
            onChange={(e) => onChange({ ...params, noYdsRequired: e.target.checked })}
            className="w-4 h-4 rounded text-[#1769E0] focus:ring-[#1769E0] border-slate-300"
          />
          <span>YDS Şartı Olmayanlar</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer min-h-[36px]">
          <input
            type="checkbox"
            checked={params.noCertificateRequired}
            onChange={(e) => onChange({ ...params, noCertificateRequired: e.target.checked })}
            className="w-4 h-4 rounded text-[#1769E0] focus:ring-[#1769E0] border-slate-300"
          />
          <span>Ek Sertifika İstemeyenler</span>
        </label>
      </div>
    </div>
  );
}
