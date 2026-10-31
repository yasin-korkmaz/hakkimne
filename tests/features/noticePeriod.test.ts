/**
 * noticePeriod.test.ts — İhbar Süresi ve Olası Bitiş Tarihi Birim Testleri
 * Dayanak: 4857 Sayılı İş Kanunu Madde 17
 */

import { describe, it, expect } from "vitest";
import { calculateNoticePeriod } from "@/features/notice-period";

describe("İhbar Süresi ve Olası Bitiş Tarihi Motoru (4857 md. 17)", () => {
  // ─── 1. Dört Farklı Kıdem Kademesi Testleri ───────────────────────────────
  describe("4 Kıdem Kademesi (2, 4, 6 ve 8 Hafta)", () => {
    it("Kademe 1: 6 aydan az çalışma -> 2 hafta (14 gün)", () => {
      // 3 ay çalışma: 2026-01-01 -> 2026-04-01
      const result = calculateNoticePeriod({
        startDate: "2026-01-01",
        notificationDate: "2026-04-01",
      });

      expect(result.ok).toBe(true);
      expect(result.noticeWeeks).toBe(2);
      expect(result.noticeDays).toBe(14);
      expect(result.ihbarHaftasi).toBe(2);
      expect(result.ihbarGunu).toBe(14);
      // 2026-04-01 + 14 gün = 2026-04-15
      expect(result.endDate).toBe("2026-04-15");
      expect(result.olasiBitisTarihi).toBe("2026-04-15");
    });

    it("Kademe 2: 6 ay ile 1.5 yıl (18 ay) arası çalışma -> 4 hafta (28 gün)", () => {
      // 1 yıl çalışma: 2025-01-01 -> 2026-01-01
      const result = calculateNoticePeriod({
        startDate: "2025-01-01",
        notificationDate: "2026-01-01",
      });

      expect(result.noticeWeeks).toBe(4);
      expect(result.noticeDays).toBe(28);
      // 2026-01-01 + 28 gün = 2026-01-29
      expect(result.endDate).toBe("2026-01-29");
    });

    it("Kademe 3: 1.5 yıl ile 3 yıl (36 ay) arası çalışma -> 6 hafta (42 gün)", () => {
      // 2 yıl çalışma: 2024-01-01 -> 2026-01-01
      const result = calculateNoticePeriod({
        startDate: "2024-01-01",
        notificationDate: "2026-01-01",
      });

      expect(result.noticeWeeks).toBe(6);
      expect(result.noticeDays).toBe(42);
      // 2026-01-01 + 42 gün: Ocak 30 gün kalır, Şubat'a 12 gün kalır -> 2026-02-12
      expect(result.endDate).toBe("2026-02-12");
    });

    it("Kademe 4: 3 yıldan fazla çalışma -> 8 hafta (56 gün)", () => {
      // 4 yıl çalışma: 2022-01-01 -> 2026-01-01
      const result = calculateNoticePeriod({
        startDate: "2022-01-01",
        notificationDate: "2026-01-01",
      });

      expect(result.noticeWeeks).toBe(8);
      expect(result.noticeDays).toBe(56);
      // 2026-01-01 + 56 gün: Ocak 30 gün kalır, Şubat 2026 28 gün çeker -> 2026-02-26
      expect(result.endDate).toBe("2026-02-26");
    });
  });

  // ─── 2. Sınır Durumları (DECISIONS.md Karar 2) ─────────────────────────────
  describe("Kademe Eşik ve Sınır Durumları", () => {
    it("Tam 6 ay: 4 hafta uygulanmalı", () => {
      // 2025-01-01 -> 2025-06-30 (tam 6 ay)
      const result = calculateNoticePeriod({
        startDate: "2025-01-01",
        notificationDate: "2025-06-30",
      });
      expect(result.noticeWeeks).toBe(4);
    });

    it("Tam 18 ay: 4 hafta uygulanmalı (18 ay dahil)", () => {
      // 2024-01-01 -> 2025-06-30 (tam 18 ay)
      const result = calculateNoticePeriod({
        startDate: "2024-01-01",
        notificationDate: "2025-06-30",
      });
      expect(result.noticeWeeks).toBe(4);
    });

    it("Tam 36 ay: 6 hafta uygulanmalı (36 ay dahil)", () => {
      // 2022-01-01 -> 2024-12-31 (tam 36 ay / 3 yıl)
      const result = calculateNoticePeriod({
        startDate: "2022-01-01",
        notificationDate: "2024-12-31",
      });
      expect(result.noticeWeeks).toBe(6);
    });

    it("36 ay + 1 gün: 8 hafta uygulanmalı", () => {
      // 2022-01-01 -> 2025-01-01 (3 yıl + 1 gün)
      const result = calculateNoticePeriod({
        startDate: "2022-01-01",
        notificationDate: "2025-01-01",
      });
      expect(result.noticeWeeks).toBe(8);
    });
  });

  // ─── 3. Takvim Matematiği (Artık Yıl ve Ay / Yıl Geçişleri) ───────────────
  describe("Takvim Matematiği Doğrulaması", () => {
    it("2024 Artık Yılı: 2024-02-20 + 14 gün = 2024-03-05 (Şubat 29 gün çeker)", () => {
      const result = calculateNoticePeriod({
        startDate: "2023-11-01", // ~3.5 ay -> 2 hafta (14 gün)
        notificationDate: "2024-02-20",
      });

      expect(result.noticeDays).toBe(14);
      expect(result.endDate).toBe("2024-03-05");
    });

    it("Normal Yıl (2025): 2025-02-20 + 14 gün = 2025-03-06 (Şubat 28 gün çeker)", () => {
      const result = calculateNoticePeriod({
        startDate: "2024-11-01", // ~3.5 ay -> 2 hafta (14 gün)
        notificationDate: "2025-02-20",
      });

      expect(result.noticeDays).toBe(14);
      expect(result.endDate).toBe("2025-03-06");
    });

    it("Yıl Sonu Geçişi: 2025-12-15 + 56 gün (8 hafta) = 2026-02-09", () => {
      const result = calculateNoticePeriod({
        startDate: "2020-01-01", // >3 yıl -> 8 hafta (56 gün)
        notificationDate: "2025-12-15",
      });

      // 15 Aralık + 16 gün = 31 Aralık
      // 56 - 16 = 40 gün
      // Ocak 31 gün çeker -> 40 - 31 = 9 gün Şubat
      expect(result.noticeDays).toBe(56);
      expect(result.endDate).toBe("2026-02-09");
    });
  });

  // ─── 4. Hata ve Doğrulama Durumları ──────────────────────────────────────
  describe("Hata ve Doğrulama Durumları", () => {
    it("Bildirim tarihi işe giriş tarihinden önce ise hata fırlatır", () => {
      expect(() =>
        calculateNoticePeriod({
          startDate: "2026-05-01",
          notificationDate: "2026-01-01",
        })
      ).toThrow("Bildirim tarihi (2026-01-01) işe giriş tarihinden (2026-05-01) önce olamaz.");
    });

    it("Geçersiz tarih formatında hata fırlatır", () => {
      expect(() =>
        calculateNoticePeriod({
          startDate: "invalid-date",
          notificationDate: "2026-01-01",
        })
      ).toThrow();
    });

    it("Eksik tarih parametresinde hata fırlatır", () => {
      expect(() =>
        calculateNoticePeriod({
          startDate: "2026-01-01",
        })
      ).toThrow("İşe giriş tarihi ve bildirim tarihi girilmelidir.");
    });
  });
});
