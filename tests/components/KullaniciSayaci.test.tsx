/**
 * KullaniciSayaci.test.tsx
 * Canlı Kullanıcı / Hesaplama Sayacı Birim Testleri
 */

import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import KullaniciSayaci, { formatSayacDegeri, FALLBACK_COUNT } from "@/components/KullaniciSayaci";
import Hero from "@/components/Hero";

describe("formatSayacDegeri", () => {
  it("1000'den küçük sayıları doğrudan dönmeli", () => {
    expect(formatSayacDegeri(950)).toBe("950");
  });

  it("1000 ve üzeri sayıları K formatına çevirmeli", () => {
    expect(formatSayacDegeri(14800)).toBe("14.8K");
    expect(formatSayacDegeri(25000)).toBe("25K");
    expect(formatSayacDegeri(1250)).toBe("1.3K");
  });
});

describe("KullaniciSayaci Bileşeni", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("başlangıçta '---' animasyonlu durumunu göstermeli ve başarılı API yanıtında formatlı değeri basmalı", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ toplam: 14800 }),
    } as Response);

    render(<KullaniciSayaci />);

    // Başlangıçta --- olmalı
    expect(screen.getByText("---")).toBeInTheDocument();

    // API tamamlanınca 14.8K olmalı
    await waitFor(() => {
      expect(screen.getByText("14.8K")).toBeInTheDocument();
    });
  });

  it("API hatası oluştuğunda '14.800+' fallback değerini göstermeli", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Ağ hatası"));

    render(<KullaniciSayaci />);

    await waitFor(() => {
      expect(screen.getByText(FALLBACK_COUNT)).toBeInTheDocument();
    });
  });

  it("Hero bileşeninde hesaplama sayısı kartı içinde KullaniciSayaci render edilmeli", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ toplam: 14800 }),
    } as Response);

    render(<Hero />);

    expect(screen.getByText(/Hesaplama Sayısı/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("14.8K")).toBeInTheDocument();
    });
  });
});
