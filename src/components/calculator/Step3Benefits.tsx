"use client";

import React from "react";
import { Info } from "lucide-react";
import { MoneyInputField } from "../FormInputFields";

/**
 * Step3Benefits.tsx — 3. Adım: Düzenli Yan Haklar ve İkramiyeler
 * Dayanak: 1475 sayılı Kanun md. 14 (giydirilmiş brüt ücrete dahil ayni ve nakdi menfaatler).
 */

interface Step3BenefitsProps {
  extraMonthly: string;
  annualBonus: string;
  errors: Record<string, string>;
  refs: {
    extraMonthly: React.RefObject<HTMLInputElement | null>;
    annualBonus: React.RefObject<HTMLInputElement | null>;
  };
  onChange: (field: string, value: string) => void;
}

export default function Step3Benefits({
  extraMonthly,
  annualBonus,
  errors,
  refs,
  onChange,
}: Step3BenefitsProps) {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-200">
      <div className="border-b border-slate-100 pb-2">
        <h3 className="text-base font-bold text-slate-900">3. Adım: Yan Haklar (İsteğe Bağlı)</h3>
        <p className="text-xs text-slate-500">
          Düzenli aldığınız yan haklar kıdem tazminatınızı artırır. Yoksa boş bırakabilirsiniz.
        </p>
      </div>

      {/* Bilgilendirme Kutusu */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs leading-relaxed">
        <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" aria-hidden="true" />
        <span>
          <strong>Giydirilmiş Brüt Ücret:</strong> Kıdem tazminatı çıplak maaş üzerinden değil; yol, yemek ve ikramiye gibi düzenli ek haklar eklenerek hesaplanır.
        </span>
      </div>

      {/* 1. Düzenli Aylık Ek Ödemeler */}
      <div className="flex flex-col gap-1">
        <MoneyInputField
          id="extraMonthly"
          label="Düzenli Aylık Ek Ödemeler (TL)"
          description="Örn: Aylık yol veya yemek kartı tutarınız, düzenli yakacak veya aile yardımı."
          placeholder="Örn: 5.000,00"
          value={extraMonthly}
          error={errors.extraMonthly}
          inputRef={refs.extraMonthly as React.RefObject<HTMLInputElement>}
          onChange={(val) => onChange("extraMonthly", val)}
        />
        <span className="text-[11px] text-slate-500 italic">
          * Süreklilik arz eden nakdi ve ayni yardımların aylık brüt tutarını yazınız.
        </span>
      </div>

      {/* 2. Yıllık İkramiye / Prim Toplamı */}
      <div className="flex flex-col gap-1 pt-1">
        <MoneyInputField
          id="annualBonus"
          label="Yıllık İkramiye / Prim Toplamı (TL)"
          description="Örn: Son 1 yıl içinde aldığınız toplam ikramiye, bayram parası ve performans primleri."
          placeholder="Örn: 60.000,00"
          value={annualBonus}
          error={errors.annualBonus}
          inputRef={refs.annualBonus as React.RefObject<HTMLInputElement>}
          onChange={(val) => onChange("annualBonus", val)}
        />
        <span className="text-[11px] text-slate-500 italic">
          * Kanun gereği yıllık ikramiye toplamı 365 güne bölünerek günlük ücrete eklenir.
        </span>
      </div>
    </div>
  );
}
