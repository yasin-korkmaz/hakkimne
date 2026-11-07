"use client";

/**
 * NetBrutForm.tsx — 2026 Brütten Nete ve Netten Brüte Maaş Hesaplama Formu
 * Dayanak: 193 GVK md. 103, 5510 md. 80, 4447 md. 49, 488 Sayılı Kanun
 * %100 İstemci taraflı (client-side) anlık hesaplama. WCAG 2.1 AA uyumlu.
 */

import React, { useState, useEffect, useId } from "react";
import { ArrowLeftRight, Wallet } from "lucide-react";
import { netBrutHesapla, type HesaplamaYonu, type NetBrutSonuc } from "@/lib/netBrutHesapla";
import { formatTRY } from "@/lib/utils/format";

const QUICK_PRESETS = [30000, 45000, 65000, 85000, 120000];

export default function NetBrutForm() {
  const [yon, setYon] = useState<HesaplamaYonu>("brut_to_net");
  const [tutarInput, setTutarInput] = useState<string>("50000");
  const [kumulatifInput, setKumulatifInput] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const amountId = useId();
  const cumulativeId = useId();

  const parseNumber = (val: string): number => {
    const num = parseFloat(val.replace(/\./g, "").replace(",", "."));
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const sonuc: NetBrutSonuc = netBrutHesapla(parseNumber(tutarInput), yon, parseNumber(kumulatifInput));
  const netPct = sonuc.brutUcret > 0 ? (sonuc.netUcret / sonuc.brutUcret) * 100 : 0;
  const sgkPct = sonuc.brutUcret > 0 ? (sonuc.toplamSgk / sonuc.brutUcret) * 100 : 0;
  const vergiPct = sonuc.brutUcret > 0 ? ((sonuc.gelirVergisi + sonuc.damgaVergisi) / sonuc.brutUcret) * 100 : 0;

  // Fire-and-forget telemetri (debounced)
  useEffect(() => {
    if (sonuc.brutUcret <= 0) return;
    const timer = setTimeout(() => {
      fetch("https://sayac.hakkimnedir.workers.dev/api/hesaplama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tur: "net_brut" }),
      }).catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, [sonuc.brutUcret, yon]);

  const ROWS = [
    { label: "Aylık Brüt Ücret", val: formatTRY(sonuc.brutUcret), cls: "font-semibold text-slate-900" },
    { label: "SGK İşçi Payı (%14)", val: `− ${formatTRY(sonuc.sgkIsci)}`, cls: "text-rose-600 font-medium" },
    { label: "İşsizlik Sigortası (%1)", val: `− ${formatTRY(sonuc.issizlikIsci)}`, cls: "text-rose-600 font-medium" },
    { label: "Gelir Vergisi Matrahı", val: formatTRY(sonuc.gelirVergisiMatrahi), cls: "text-slate-500 text-xs" },
    { label: `Gelir Vergisi (${sonuc.vergiDilimi})`, val: `− ${formatTRY(sonuc.gelirVergisi)}`, cls: "text-rose-600 font-medium" },
    { label: "Damga Vergisi (%0,759)", val: `− ${formatTRY(sonuc.damgaVergisi)}`, cls: "text-rose-600 font-medium" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5">
      {/* 1. Yön Değiştirme */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => setYon("brut_to_net")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm min-h-[44px] flex items-center justify-center gap-2 ${
            yon === "brut_to_net" ? "bg-[#0B1F33] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Brütten Nete</span>
        </button>
        <button
          type="button"
          onClick={() => setYon("net_to_brut")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm min-h-[44px] flex items-center justify-center gap-2 ${
            yon === "net_to_brut" ? "bg-[#0B1F33] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Netten Brüte</span>
        </button>
      </div>

      {/* 2. Tutar Girişi ve Hızlı Seçim */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        <div>
          <label htmlFor={amountId} className="block text-sm font-semibold text-slate-800 mb-1.5">
            {yon === "brut_to_net" ? "Aylık Brüt Maaş Tutarı" : "Aylık Hedef Net Maaş Tutarı"}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₺</span>
            <input
              id={amountId}
              type="number"
              min="0"
              step="500"
              value={tutarInput}
              onChange={(e) => setTutarInput(e.target.value)}
              placeholder="Örn: 50000"
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all min-h-[48px]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Örnekler:</span>
          {QUICK_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setTutarInput(p.toString())}
              className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 bg-slate-50 hover:bg-blue-50 text-slate-700"
            >
              {p.toLocaleString("tr-TR")} TL
            </button>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-2">
          <button type="button" onClick={() => setShowAdvanced((prev) => !prev)} className="text-xs font-semibold text-blue-600 hover:underline">
            {showAdvanced ? "− Kümülatif matrah ayarını gizle" : "+ Kümülatif vergi matrahı gir (Yıl içi ay hesabı)"}
          </button>
          {showAdvanced && (
            <div className="mt-2">
              <label htmlFor={cumulativeId} className="block text-xs font-semibold text-slate-600 mb-1">Önceki Aylardan Devreden Kümülatif Matrah (TL)</label>
              <input id={cumulativeId} type="number" min="0" value={kumulatifInput} onChange={(e) => setKumulatifInput(e.target.value)} placeholder="Örn: 158000" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px]" />
            </div>
          )}
        </div>
      </div>

      {/* 3. Sonuç Kartı ve Kesinti Dökümü */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
        <div className="bg-gradient-to-br from-[#0B1F33] to-[#163554] text-white p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider block">
              {yon === "brut_to_net" ? "Ele Geçecek Net Maaş" : "Gereken Aylık Brüt Maaş"}
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-emerald-400">
              {formatTRY(yon === "brut_to_net" ? sonuc.netUcret : sonuc.brutUcret)}
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-1">
            <span className="text-xs text-slate-300">2026 Gelir Vergisi Dilimi:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 text-xs font-bold text-amber-300">
              {sonuc.vergiDilimi} Dilimi
            </span>
            <span className="text-[11px] text-slate-400">Toplam Kesinti: %{sonuc.efektifVergiOrani.toFixed(2)}</span>
          </div>
        </div>

        {sonuc.brutUcret > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Maaş Dağılımı</span>
              <span>Net: %{netPct.toFixed(1)} | Kesinti: %{(100 - netPct).toFixed(1)}</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div style={{ width: `${netPct}%` }} className="bg-emerald-500 h-full" title="Net Ücret" />
              <div style={{ width: `${sgkPct}%` }} className="bg-blue-500 h-full" title="SGK & İşsizlik" />
              <div style={{ width: `${vergiPct}%` }} className="bg-amber-500 h-full" title="Gelir & Damga Vergisi" />
            </div>
          </div>
        )}

        <div className="divide-y divide-slate-100 text-sm">
          {ROWS.map((r, i) => (
            <div key={i} className="py-2 flex justify-between text-slate-600">
              <span>{r.label}</span>
              <span className={r.cls}>{r.val}</span>
            </div>
          ))}
          <div className="py-2 flex justify-between font-bold text-slate-900 bg-slate-50/70 px-2 rounded-lg">
            <span>Toplam Yasal Kesinti</span>
            <span className="text-rose-700">− {formatTRY(sonuc.toplamKesinti)}</span>
          </div>
          <div className="py-2.5 flex justify-between font-extrabold text-base text-emerald-700 bg-emerald-50/60 px-2 rounded-lg">
            <span>Ele Geçecek Net Ücret</span>
            <span>{formatTRY(sonuc.netUcret)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
