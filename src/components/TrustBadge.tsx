"use client";

/**
 * TrustBadge.tsx — Güven ve Veri Doğrulama Rozeti
 * Dayanak: AGENTS.md Kural 3 (Doğrulama Kilidi)
 *
 * Algoritma:
 *  1. SSR hydration hatasını önlemek için bileşen istemcide mount olana dek
 *     hafif bir yer tutucu (skeleton) gösterir.
 *  2. isTestData === true ise doğrudan kırmızı TEST VERİSİ uyarısı döner.
 *  3. Verilen veya bugünün tarihine denk gelen tavan dönemi aranır.
 *  4. Dönem var ve verified: true ise YEŞİL güncel veri rozeti döner.
 *  5. Dönem var ve verified: false ise SARI doğrulanmamış veri rozeti döner (yeşil gösterilmez).
 *  6. Dönem bulunamazsa NÖTR/GRİ yayımlanmadı rozeti döner.
 */

import React, { useState, useEffect } from "react";
import type { RatesConfig } from "@/lib/config/types";
import { getRates } from "@/lib/config/ratesSource";
import { formatTRY } from "@/lib/utils/format";

export interface TrustBadgeProps {
  rates?: RatesConfig;
  isTestData?: boolean;
  currentDateIso?: string;
}

export default function TrustBadge({
  rates: propRates,
  isTestData: propIsTestData,
  currentDateIso: propCurrentDateIso,
}: TrustBadgeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR aşamasında hydration uyumsuzluğunu önlemek için yer tutucu
  if (!mounted) {
    return (
      <div
        data-testid="trust-badge-skeleton"
        className="min-h-[38px] w-full max-w-2xl mx-auto rounded-lg bg-gray-100/60 animate-pulse motion-reduce:animate-none"
        aria-hidden="true"
      />
    );
  }

  // Değerleri kaynak üzerinden veya prop'lardan belirle
  const defaultSource = getRates();
  const rates = propRates ?? defaultSource.rates;
  const isTestData = propIsTestData ?? defaultSource.isTestData;

  // Bugünün ISO tarihi (UTC referanslı YYYY-MM-DD)
  const todayIso = propCurrentDateIso ?? new Date().toISOString().slice(0, 10);

  // DURUM 4 (KIRMIZI): Test Verisi
  if (isTestData) {
    return (
      <div
        role="status"
        className="w-full max-w-2xl mx-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-300 bg-red-50 text-red-800 text-xs sm:text-sm font-semibold tracking-wide shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse motion-reduce:animate-none shrink-0" />
        <span>TEST VERİSİ — gerçek oran değildir</span>
      </div>
    );
  }

  // Çıkış / Referans tarihine denk gelen dönemi bul
  const currentPeriod = rates.severance_ceiling_periods.find(
    (p) => p.from <= todayIso && todayIso <= p.to
  );

  // DURUM 1 (YEŞİL): Doğrulanmış Dönem
  if (currentPeriod && currentPeriod.verified) {
    return (
      <div
        role="status"
        className="w-full max-w-2xl mx-auto flex items-center justify-center text-center gap-2 px-4 py-2 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs sm:text-sm font-medium shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
        <span>
          Güncel veriler: {currentPeriod.label} · Kıdem tavanı{" "}
          <strong className="font-semibold">
            {formatTRY(currentPeriod.amount_try)}
          </strong>{" "}
          · Son güncelleme {rates.meta.last_updated}
        </span>
      </div>
    );
  }

  // DURUM 2 (SARI): Doğrulanmamış Dönem
  if (currentPeriod && !currentPeriod.verified) {
    return (
      <div
        role="alert"
        className="w-full max-w-2xl mx-auto flex items-center justify-center text-center gap-2 px-4 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs sm:text-sm font-medium shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
        <span>Doğrulanmamış veri — bu site henüz yayında değil.</span>
      </div>
    );
  }

  // DURUM 3 (NÖTR / GRİ): Tanımlı Dönem Yok
  return (
    <div
      role="status"
      className="w-full max-w-2xl mx-auto flex items-center justify-center text-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium shadow-sm"
    >
      <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
      <span>Bu dönem için kıdem tavanı henüz yayımlanmadı.</span>
    </div>
  );
}
