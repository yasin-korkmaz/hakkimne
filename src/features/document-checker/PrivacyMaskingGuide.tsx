import React from "react";

interface PrivacyMaskingGuideProps {
  confirmed: boolean;
  onToggleConfirm: (confirmed: boolean) => void;
}

export default function PrivacyMaskingGuide({
  confirmed,
  onToggleConfirm,
}: PrivacyMaskingGuideProps) {
  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4 text-slate-800">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm sm:text-base font-bold text-amber-950">
            KVKK & Kişisel Veri Maskeleme Rehberi (Önemli)
          </h3>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            Belgenizi yüklemeden önce lütfen gizliliğinizi korumak adına aşağıdaki hassas kişisel verilerin üzerini telefonunuzun veya bilgisayarınızın çizim/düzenleme aracıyla <strong>siyah şeritle kapatın (maskeleyin)</strong>:
          </p>
        </div>
      </div>

      {/* Maskelenmesi Gereken Alanlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 p-2 bg-white/70 rounded-lg border border-amber-200/50">
          <span className="text-red-600 font-bold">✕</span>
          <span className="text-slate-700">T.C. Kimlik Numarası (TCKN)</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-white/70 rounded-lg border border-amber-200/50">
          <span className="text-red-600 font-bold">✕</span>
          <span className="text-slate-700">Banka IBAN & Hesap Numarası</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-white/70 rounded-lg border border-amber-200/50">
          <span className="text-red-600 font-bold">✕</span>
          <span className="text-slate-700">Ev Açık Adresi & Özel Telefon</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-white/70 rounded-lg border border-amber-200/50">
          <span className="text-red-600 font-bold">✕</span>
          <span className="text-slate-700">Anne / Baba Adı ve Doğum Yeri</span>
        </div>
      </div>

      {/* Onay Kutusu */}
      <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-amber-300/80 cursor-pointer hover:bg-amber-50/50 transition-colors">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => onToggleConfirm(e.target.checked)}
          className="mt-0.5 w-4 h-4 text-[#1769E0] border-slate-300 rounded focus:ring-[#1769E0]"
        />
        <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
          Belgemdeki TCKN, IBAN ve açık adres gibi kişisel verileri kapattığımı / maskelediğimi onaylıyorum.
        </span>
      </label>
    </div>
  );
}
