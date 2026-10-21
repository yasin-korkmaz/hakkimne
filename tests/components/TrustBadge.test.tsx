/**
 * TrustBadge.test.tsx
 * Güven rozeti (TrustBadge) birim testleri.
 * Dayanak: AGENTS.md Kural 3 (Doğrulama Kilidi) ve prompt gereksinimleri.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TrustBadge from "@/components/TrustBadge";
import fixtureRaw from "../fixtures/rates.test.json";
import type { RatesConfig } from "@/lib/config/types";

const fixture = fixtureRaw as unknown as RatesConfig;

describe("TrustBadge — Görünüm ve Durum Testleri", () => {
  it("DURUM 1 (YEŞİL): verified: true olan dönemde yeşil rozet ve beklenen metin render edilmeli", () => {
    // 2026-06-30 -> 2026-1 dönemi, verified: true
    const { container } = render(
      <TrustBadge
        rates={fixture}
        isTestData={false}
        currentDateIso="2026-06-30"
      />
    );

    const badge = screen.getByRole("status");
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toContain("Güncel veriler: Ocak - Haziran 2026");
    expect(badge.textContent).toContain("64.948,77 TL");
    expect(badge.textContent).toContain("Son güncelleme 2026-10-18");

    // Yeşil sınıflara sahip olmalı
    expect(badge.className).toContain("bg-emerald-50");
    expect(badge.className).toContain("text-emerald-900");
  });

  it("DURUM 2 (SARI): verified: false olan dönemde sarı rozet ve 'Doğrulanmamış veri' metni gösterilmeli, ASLA yeşil renk içermemeli", () => {
    // 2027-02-01 -> 2027-1 dönemi, fixture'da verified: false
    render(
      <TrustBadge
        rates={fixture}
        isTestData={false}
        currentDateIso="2027-02-01"
      />
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toBe(
      "Doğrulanmamış veri — bu site henüz yayında değil."
    );

    // Kesinlikle yeşil sınıfları içermemeli
    expect(alert.className).not.toContain("emerald");
    expect(alert.className).not.toContain("green");

    // Sarı / amber sınıfına sahip olmalı
    expect(alert.className).toContain("bg-amber-50");
    expect(alert.className).toContain("text-amber-900");
  });

  it("DURUM 3 (NÖTR / GRİ): dönem dışı bir tarihte nötr rozet ve 'henüz yayımlanmadı' metni dönmeli", () => {
    // 2024-01-01 -> hiçbir döneme girmiyor
    render(
      <TrustBadge
        rates={fixture}
        isTestData={false}
        currentDateIso="2024-01-01"
      />
    );

    const badge = screen.getByRole("status");
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toBe(
      "Bu dönem için kıdem tavanı henüz yayımlanmadı."
    );
    expect(badge.className).toContain("bg-gray-100");
  });

  it("2026-06-30 ve 2026-07-01 tarihlerinde iki farklı dönemin etiketleri doğru yansımalı", () => {
    // 2026-06-30 -> 2026-1
    const { unmount } = render(
      <TrustBadge
        rates={fixture}
        isTestData={false}
        currentDateIso="2026-06-30"
      />
    );
    expect(screen.getByText(/Ocak - Haziran 2026/i)).toBeInTheDocument();
    unmount();

    // 2026-07-01 -> 2026-2
    render(
      <TrustBadge
        rates={fixture}
        isTestData={false}
        currentDateIso="2026-07-01"
      />
    );
    expect(screen.getByText(/Temmuz - Aralık 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/73.729,87 TL/i)).toBeInTheDocument();
  });

  it("DURUM 4 (KIRMIZI): isTestData: true iken kırmızı rozet ve 'TEST VERİSİ' metni gösterilmeli", () => {
    render(
      <TrustBadge
        rates={fixture}
        isTestData={true}
        currentDateIso="2026-06-30"
      />
    );

    const badge = screen.getByRole("status");
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toBe("TEST VERİSİ — gerçek oran değildir");
    expect(badge.className).toContain("bg-red-50");
    expect(badge.className).toContain("text-red-800");
  });
});
