/**
 * BelgeKontrolUploader.test.tsx
 * Belge Yükleme ve Risk Arayüzü Birim Testleri
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BelgeKontrolUploader from "@/components/BelgeKontrolUploader";
import * as analizModulu from "@/lib/belgeAnaliz";

describe("BelgeKontrolUploader Arayüzü", () => {
  it("başlangıçta dosya yükleme alanını ve gizlilik garantisini render etmeli", () => {
    render(<BelgeKontrolUploader />);

    expect(
      screen.getByText(/Sözleşmenizi buraya sürükleyin veya seçin/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Sunucuya veri gitmez/i)
    ).toBeInTheDocument();
  });

  it("risk bulunmadığında tebrik mesajını göstermeli", async () => {
    vi.spyOn(analizModulu, "belgeAnaliziYap").mockResolvedValueOnce([]);

    render(<BelgeKontrolUploader />);

    const input = screen.getByLabelText(/İş sözleşmesi yükleyin/i);
    const mockFile = new File(["temiz metin"], "temiz_sozlesme.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(input, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(
        screen.getByText(/Tebrikler, bilinen riskli bir madde tespit edilmedi/i)
      ).toBeInTheDocument();
    });
  });

  it("riskli maddeler bulunduğunda kartlar ve inceleme önerisi görünmeli", async () => {
    vi.spyOn(analizModulu, "belgeAnaliziYap").mockResolvedValueOnce([
      {
        id: "rekabet_yasagi",
        baslik: "Rekabet Yasağı Maddesi Tespit Edildi",
        aciklama: "TBK 444 gereği sınırlandırılmamış rekabet yasakları geçersizdir.",
        seviye: "yuksek",
      },
    ]);

    render(<BelgeKontrolUploader />);

    const input = screen.getByLabelText(/İş sözleşmesi yükleyin/i);
    const mockFile = new File(["riskli icerik"], "sozlesme.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(input, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(
        screen.getByText("Rekabet Yasağı Maddesi Tespit Edildi")
      ).toBeInTheDocument();
      expect(screen.getByText("Yüksek Risk")).toBeInTheDocument();
    });

    // Yeni Belge Yükle butonuna basınca sıfırlanmalı
    fireEvent.click(screen.getByRole("button", { name: /Yeni Belge Yükle/i }));

    expect(
      screen.getByText(/Sözleşmenizi buraya sürükleyin veya seçin/i)
    ).toBeInTheDocument();
  });
});
