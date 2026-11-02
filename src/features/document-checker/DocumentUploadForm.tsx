"use client";

import React, { useState, useRef } from "react";
import type { DocumentType, DocumentCheckInput } from "./types";
import { validateUploadedFile, formatFileSize } from "./fileValidation";
import PrivacyMaskingGuide from "./PrivacyMaskingGuide";

interface DocumentUploadFormProps {
  onAnalyze: (input: DocumentCheckInput) => void;
}

const DOC_OPTIONS: { type: DocumentType; label: string; desc: string }[] = [
  {
    type: "pay_slip",
    label: "Maaş Bordrosu",
    desc: "Ücret pusulası, mesai tahakkuku ve vergi kesintileri",
  },
  {
    type: "employment_contract",
    label: "İş Sözleşmesi",
    desc: "Deneme süresi, 270 saat mesai ve cezai şart maddeleri",
  },
  {
    type: "termination_notice",
    label: "Fesih Bildirimi",
    desc: "Yazılı gerekçe, savunma şartı ve ihbar süresi kontrolü",
  },
  {
    type: "leave_form",
    label: "İzin Belgesi",
    desc: "10 gün bölünme şartı, kıdem kademesi ve yaş koruması",
  },
];

export default function DocumentUploadForm({ onAnalyze }: DocumentUploadFormProps) {
  const [selectedType, setSelectedType] = useState<DocumentType>("pay_slip");
  const [file, setFile] = useState<File | null>(null);
  const [hasRedactedPii, setHasRedactedPii] = useState(false);
  const [userNotes, setUserNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setErrorMessage(null);
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Lütfen incelemek istediğiniz belgeyi yükleyin.");
      return;
    }

    const validation = validateUploadedFile(file, hasRedactedPii);
    if (!validation.ok) {
      setErrorMessage(validation.message);
      return;
    }

    onAnalyze({
      documentType: selectedType,
      fileName: file.name,
      fileSizeBytes: file.size,
      mimeType: file.type || "application/octet-stream",
      hasRedactedPii,
      userNotes: userNotes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* 1. Belge Türü Seçimi */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-[#0B1F33]">
          1. İncelemek İstediğiniz Belge Türünü Seçin:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DOC_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => setSelectedType(opt.type)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-1 min-h-[44px] ${
                selectedType === opt.type
                  ? "border-[#1769E0] bg-blue-50/50 ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="font-bold text-sm text-slate-900">{opt.label}</span>
              <span className="text-xs text-slate-500">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. KVKK ve Kişisel Veri Maskeleme Rehberi */}
      <PrivacyMaskingGuide
        confirmed={hasRedactedPii}
        onToggleConfirm={setHasRedactedPii}
      />

      {/* 3. Dosya Yükleme Alanı */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-[#0B1F33]">
          2. Belgenizi Yükleyin (PDF veya Resim):
        </label>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-[#1769E0] bg-slate-50/50 hover:bg-blue-50/20 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
        >
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-xs sm:text-sm font-semibold text-slate-700">
            {file ? file.name : "Dosya seçmek için tıklayın veya buraya sürükleyin"}
          </span>
          <span className="text-[11px] text-slate-500">
            {file ? `${formatFileSize(file.size)} • Değiştirmek için tıklayın` : "PDF, PNG, JPG veya WEBP (Azami 10 MB)"}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      </div>

      {/* 4. Opsiyonel Açıklama / Not */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-700">
          Özel Bir Notunuz veya Sormak İstediğiniz Madde Var mı? (Opsiyonel)
        </label>
        <textarea
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          placeholder="Örn: 2. maddedeki fazla mesai klozu ve fesih önel süresi..."
          rows={2}
          className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1769E0] focus:outline-none"
        />
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl">
          {errorMessage}
        </div>
      )}

      {/* 5. Gönder Butonu */}
      <button
        type="submit"
        className="w-full py-3.5 px-6 bg-[#1769E0] hover:bg-[#123C68] text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-xs min-h-[44px]"
      >
        Belgeyi Güvenle İncele →
      </button>
    </form>
  );
}
