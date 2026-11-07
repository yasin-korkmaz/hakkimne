"use client";

/**
 * KullaniciSayaci.tsx — Canlı Hesaplama ve Kullanıcı Sayacı
 * Dayanak: WCAG 2.1 AA (canlı bölge), Cloudflare Workers D1 REST API.
 * Yüklenirken: Animasyonlu "---"
 * Hata anında: "14.800+" (Fallback)
 * Başarılı: "14.8K" (1000 üstü K formatı)
 */

import React, { useEffect, useState } from "react";

export const SAYAC_API_URL = "https://sayac.hakkimnedir.workers.dev/api/sayac";
export const FALLBACK_COUNT = "14.800+";

export function formatSayacDegeri(count: number): string {
  if (count < 1000) {
    return count.toLocaleString("tr-TR");
  }
  const k = count / 1000;
  return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
}

export default function KullaniciSayaci() {
  const [displayText, setDisplayText] = useState<string>("---");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSayac() {
      try {
        const response = await fetch(SAYAC_API_URL, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const rawCount =
          typeof data.toplam === "number"
            ? data.toplam
            : typeof data.count === "number"
            ? data.count
            : Number(data);

        if (isNaN(rawCount) || rawCount <= 0) {
          throw new Error("Geçersiz sayaç verisi");
        }

        if (isMounted) {
          setDisplayText(formatSayacDegeri(rawCount));
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setDisplayText(FALLBACK_COUNT);
          setLoading(false);
        }
      }
    }

    fetchSayac();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <span
      aria-label={`Hesaplama sayısı: ${displayText}`}
      className={`inline-block font-black tabular-nums transition-opacity duration-300 ${
        loading ? "animate-pulse text-slate-400" : ""
      }`}
    >
      {displayText}
    </span>
  );
}
