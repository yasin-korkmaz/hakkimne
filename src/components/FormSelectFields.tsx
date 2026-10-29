import React from "react";
import { REASON_OPTIONS } from "./calculatorFormConstants";

export function ReasonSelectField({
  value,
  error,
  selectRef,
  onChange,
}: {
  value: string;
  error?: string;
  selectRef?: React.Ref<HTMLSelectElement>;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="reason" className="text-sm font-semibold text-gray-900">
        İşten Ayrılış / Fesih Nedeni *
      </label>
      <span id="reason-desc" className="text-xs text-gray-600">Durumunuza en uygun fesih gerekçesini seçiniz.</span>
      <select
        id="reason"
        ref={selectRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={error ? "reason-desc reason-err" : "reason-desc"}
        aria-invalid={!!error}
        className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
      >
        <option value="">Lütfen seçiniz</option>
        {REASON_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span id="reason-err" role="alert" className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  );
}

export function NoticeUsedField({
  value,
  error,
  selectRef,
  onChange,
}: {
  value: string;
  error?: string;
  selectRef?: React.Ref<HTMLSelectElement>;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 bg-blue-50/60 p-3 rounded-md border border-blue-100">
      <label htmlFor="noticeUsed" className="text-sm font-semibold text-gray-900">
        İhbar Süresi Kullandırıldı mı? *
      </label>
      <span id="notice-desc" className="text-xs text-gray-600">İşten çıkarılmadan önce ihbar süreniz çalıştırıldı mı?</span>
      <select
        id="noticeUsed"
        ref={selectRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={error ? "notice-desc notice-err" : "notice-desc"}
        aria-invalid={!!error}
        className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
      >
        <option value="no">Hayır, kullandırılmadı (İhbar tazminatı talep ediyorum)</option>
        <option value="yes">Evet, ihbar süresi boyunca çalıştım</option>
      </select>
      {error && <span id="notice-err" role="alert" className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  );
}
