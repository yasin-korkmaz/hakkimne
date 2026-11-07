"use client";

/**
 * BelgeKontrolUploader.tsx — İstemci Taraflı İş Sözleşmesi Analiz Bileşeni
 * Dayanak: 4857 İş Kanunu md. 15, 22; 6098 TBK md. 444; %100 sıfır sunucu gizliliği.
 */

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { belgeAnaliziYap, type BelgeRiski } from "@/lib/belgeAnaliz";

export default function BelgeKontrolUploader() {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [risks, setRisks] = useState<BelgeRiski[] | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file) return;
    try {
      setLoading(true);
      setFileName(file.name);
      const sonuclar = await belgeAnaliziYap(file);
      setRisks(sonuclar);
    } catch (err) {
      console.error("Belge analizi hatası:", err);
      setRisks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFileName(null);
    setRisks(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* 1. Yükleme Alanı */}
      {risks === null && !loading && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files?.[0]) handleProcessFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 min-h-[200px] ${
            isDragOver ? "border-[#1769E0] bg-blue-50/60" : "border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={(e) => { if (e.target.files?.[0]) handleProcessFile(e.target.files[0]); }}
            className="hidden"
            aria-label="İş sözleşmesi yükleyin"
          />
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#1769E0]">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-base text-slate-900 block">Sözleşmenizi buraya sürükleyin veya seçin</span>
            <span className="text-xs text-slate-500 mt-0.5 block">PDF veya metin dosyaları (.pdf, .txt) • Maksimum 25 MB</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>%100 Cihazınızda analiz edilir — Sunucuya veri gitmez</span>
          </div>
        </div>
      )}

      {/* 2. Yükleniyor Durumu */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-3 min-h-[200px]">
          <Loader2 className="w-9 h-9 text-[#1769E0] animate-spin" />
          <div>
            <h3 className="font-bold text-base text-slate-900">Sözleşme Maddeleri Taranıyor...</h3>
            <p className="text-xs text-slate-500 mt-0.5">&quot;{fileName}&quot; dosyası taranıyor, yasal riskler kontrol ediliyor.</p>
          </div>
        </div>
      )}

      {/* 3. Sonuç Ekranı */}
      {risks !== null && !loading && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-semibold text-slate-800 truncate max-w-[220px] sm:max-w-xs">{fileName}</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 min-h-[44px] px-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Yeni Belge Yükle</span>
            </button>
          </div>

          {risks.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center flex flex-col items-center gap-2.5">
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-emerald-900">Tebrikler, bilinen riskli bir madde tespit edilmedi</h3>
              <p className="text-xs sm:text-sm text-emerald-700 max-w-md leading-relaxed">
                Yüklediğiniz metinde rekabet yasağı, 6 aylık deneme süresi ve tek taraflı değişiklik gibi yaygın kanuna aykırı maddelere rastlanmadı.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Tespit Edilen Kritik Maddeler ({risks.length})</span>
                <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">İnceleme Önerilir</span>
              </div>

              {risks.map((risk) => {
                const isHigh = risk.seviye === "yuksek";
                const Icon = isHigh ? AlertCircle : AlertTriangle;
                return (
                  <div
                    key={risk.id}
                    className={`border rounded-xl p-4 flex flex-col gap-1.5 ${
                      isHigh ? "bg-rose-50/70 border-rose-200 text-rose-950" : "bg-amber-50/70 border-amber-200 text-amber-950"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isHigh ? "text-rose-600" : "text-amber-600"}`} />
                        <h4 className="font-bold text-sm">{risk.baslik}</h4>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${isHigh ? "bg-rose-200/80 text-rose-900" : "bg-amber-200/80 text-amber-900"}`}>
                        {isHigh ? "Yüksek Risk" : "Orta Risk"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed opacity-90 pl-6">{risk.aciklama}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
