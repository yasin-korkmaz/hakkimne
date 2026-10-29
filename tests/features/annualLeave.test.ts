/**
 * annualLeave.test.ts — Yıllık Ücretli İzin Motoru Birim Testleri
 * Dayanak: 4857 Sayılı İş Kanunu Madde 53 ve Madde 59
 */

import { describe, it, expect } from "vitest";
import { calculateAnnualLeave, getDaysForServiceYear } from "@/features/annual-leave";

describe("Yıllık İzin Motoru (4857 md. 53 ve 59)", () => {
  describe("Normal Senaryolar", () => {
    it("3 yıllık çalışan, 25 yaşında: 42 gün hak ediş ve brüt ücret hesabı", () => {
      const res = calculateAnnualLeave({ completedYears: 3, age: 25, grossSalary: 30000, usedDays: 0 });
      expect(res.ok).toBe(true);
      expect(res.totalEarnedDays).toBe(42);
      expect(res.remainingDays).toBe(42);
      expect(res.dailyGross).toBe(1000);
      expect(res.grossLeavePay).toBe(42000);
      expect(res.hakEdilenToplamGun).toBe(42);
      expect(res.kalanGun).toBe(42);
      expect(res.brutUcret).toBe(42000);
    });

    it("3 yıllık çalışan, 25 yaşında, 12 gün kullanılmış, 45.000 TL brüt", () => {
      const res = calculateAnnualLeave({ completedYears: 3, age: 25, grossSalary: 45000, usedDays: 12 });
      expect(res.totalEarnedDays).toBe(42);
      expect(res.usedDays).toBe(12);
      expect(res.remainingDays).toBe(30);
      expect(res.dailyGross).toBe(1500);
      expect(res.grossLeavePay).toBe(45000);
    });

    it("7 yıllık çalışan (5-15 yıl kademesi): 5x14 + 2x20 = 110 gün", () => {
      const res = calculateAnnualLeave({ completedYears: 7, age: 35, grossSalary: 30000 });
      expect(res.totalEarnedDays).toBe(110);
      expect(res.breakdown[4]!.earnedDays).toBe(14); // 5. yıl (5 dahil: 14)
      expect(res.breakdown[5]!.earnedDays).toBe(20); // 6. yıl (>5 yıl: 20)
    });

    it("16 yıllık çalışan (15 yıl dahil ve üzeri): 5x14 + 9x20 + 2x26 = 302 gün", () => {
      const res = calculateAnnualLeave({ completedYears: 16, age: 42 });
      expect(res.totalEarnedDays).toBe(302);
      expect(res.breakdown[14]!.earnedDays).toBe(26); // 15. yıl (15 dahil: 26)
      expect(res.breakdown[15]!.earnedDays).toBe(26); // 16. yıl (26)
    });
  });

  describe("Sınır Durumları (Kıdem Eşikleri)", () => {
    it("1 yıldan az çalışanlar izne hak kazanamaz (0 gün)", () => {
      const res = calculateAnnualLeave({
        startDate: "2025-01-01",
        exitDate: "2025-12-30", // 0y 11m 30d
        grossSalary: 30000,
      });
      expect(res.completedYears).toBe(0);
      expect(res.totalEarnedDays).toBe(0);
      expect(res.remainingDays).toBe(0);
      expect(res.grossLeavePay).toBe(0);
      expect(res.breakdown).toHaveLength(0);
    });

    it("Tam 1. yılını doldurduğu gün: 14 gün hak edilir", () => {
      const res = calculateAnnualLeave({ startDate: "2025-01-01", exitDate: "2025-12-31", age: 25 });
      expect(res.completedYears).toBe(1);
      expect(res.totalEarnedDays).toBe(14);
      expect(res.remainingDays).toBe(14);
    });

    it("Tam 5. yılını doldurduğu gün: 5 dahil kuralıyla 5x14 = 70 gün", () => {
      const res = calculateAnnualLeave({ startDate: "2020-01-01", exitDate: "2024-12-31", age: 30 });
      expect(res.completedYears).toBe(5);
      expect(res.totalEarnedDays).toBe(70);
      expect(res.breakdown[4]!.earnedDays).toBe(14);
    });

    it("Tam 6. yılını doldurduğu gün: 5x14 + 1x20 = 90 gün", () => {
      const res = calculateAnnualLeave({ startDate: "2020-01-01", exitDate: "2025-12-31", age: 31 });
      expect(res.completedYears).toBe(6);
      expect(res.totalEarnedDays).toBe(90);
    });
  });

  describe("İstisna Durumları (18 Yaş Altı ve 50 Yaş Üstü)", () => {
    it("17 yaşında (18 yaş altı) 1 yıllık çalışma -> en az 20 gün almalı", () => {
      const res = calculateAnnualLeave({ completedYears: 1, age: 17 });
      expect(res.totalEarnedDays).toBe(20);
      expect(res.breakdown[0]!.isProtectedAge).toBe(true);
    });

    it("Tam 18 yaşında 1 yıllık çalışma (18 yaş dahil) -> en az 20 gün almalı", () => {
      const res = calculateAnnualLeave({ completedYears: 1, age: 18 });
      expect(res.totalEarnedDays).toBe(20);
      expect(res.breakdown[0]!.isProtectedAge).toBe(true);
    });

    it("Tam 50 yaşında 1 yıllık çalışma (50 yaş dahil) -> en az 20 gün almalı", () => {
      const res = calculateAnnualLeave({ completedYears: 1, age: 50 });
      expect(res.totalEarnedDays).toBe(20);
      expect(res.breakdown[0]!.isProtectedAge).toBe(true);
    });

    it("55 yaşında 1 yıllık çalışma (50 yaş üstü) -> en az 20 gün almalı", () => {
      const res = calculateAnnualLeave({ completedYears: 1, age: 55 });
      expect(res.totalEarnedDays).toBe(20);
      expect(res.breakdown[0]!.isProtectedAge).toBe(true);
    });

    it("Doğum tarihiyle yaş koruması testi (17 yaşında çalışan)", () => {
      const res = calculateAnnualLeave({
        startDate: "2025-01-01",
        exitDate: "2025-12-31",
        birthDate: "2008-05-15",
      });
      expect(res.totalEarnedDays).toBe(20);
      expect(res.breakdown[0]!.isProtectedAge).toBe(true);
    });

    it("getDaysForServiceYear yardımcısında yaş koruması kontrolü", () => {
      expect(getDaysForServiceYear(1, 16).days).toBe(20);
      expect(getDaysForServiceYear(1, 25).days).toBe(14);
      expect(getDaysForServiceYear(1, 60).days).toBe(20);
    });
  });

  describe("Günlük Ücret ve Parasal Çıktı Hesaplaması", () => {
    it("Günlük ücret (Brüt / 30) * Kalan Gün doğrulaması", () => {
      const res = calculateAnnualLeave({ completedYears: 1, age: 25, grossSalary: 60000, usedDays: 0 });
      expect(res.dailyGross).toBe(2000);
      expect(res.grossLeavePay).toBe(28000); // 2000 * 14 gün
    });

    it("Kuruş yuvarlaması (50.000 TL brüt, 14 gün kalan)", () => {
      const res = calculateAnnualLeave({ completedYears: 1, age: 25, grossSalary: 50000 });
      // (50000 / 30) * 14 = 23333.3333... -> 23333.33 TL
      expect(res.dailyGross).toBe(1666.67);
      expect(res.grossLeavePay).toBe(23333.33);
    });

    it("Kullanılan izin hak edilenden fazla ise kalan gün 0 olur", () => {
      const res = calculateAnnualLeave({ completedYears: 1, usedDays: 20, grossSalary: 30000 });
      expect(res.remainingDays).toBe(0);
      expect(res.grossLeavePay).toBe(0);
    });
  });

  describe("Hata Durumları", () => {
    it("Negatif brüt maaş hata fırlatır", () => {
      expect(() => calculateAnnualLeave({ completedYears: 1, grossSalary: -500 })).toThrow("Brüt maaş negatif olamaz.");
    });

    it("Negatif kullanılan gün hata fırlatır", () => {
      expect(() => calculateAnnualLeave({ completedYears: 1, usedDays: -2 })).toThrow("Kullanılan izin günü negatif olamaz.");
    });

    it("Çıkış < Giriş tarihi hata fırlatır", () => {
      expect(() => calculateAnnualLeave({ startDate: "2026-01-01", exitDate: "2025-01-01" })).toThrow();
    });
  });
});
