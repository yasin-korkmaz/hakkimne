/**
 * overtime.test.ts — Fazla Çalışma ve Fazla Sürelerle Çalışma Birim Testleri
 * Dayanak: 4857 Sayılı İş Kanunu Madde 41 ve Madde 63
 */

import { describe, it, expect } from "vitest";
import { calculateOvertime } from "@/features/overtime";

describe("Fazla Mesai Hesaplama Motoru (4857 md. 41)", () => {
  // ─── 1. Normal Senaryo ──────────────────────────────────────────────────
  describe("Normal Senaryo (45 Saat Sözleşme)", () => {
    it("45 saat sözleşmeli, 50 saat çalışan (5 saat %50 zamlı)", () => {
      // 45.000 TL brüt -> Saatlik: 45000 / 225 = 200 TL
      // Fazla çalışma: 5 saat * (200 * 1.5) = 1500 TL
      const result = calculateOvertime({
        grossSalary: 45000,
        weeklyContractHours: 45,
        weeklyWorkedHours: 50,
      });

      expect(result.ok).toBe(true);
      expect(result.hourlyGrossRate).toBe(200);
      expect(result.extraHours25).toBe(0);
      expect(result.extraHours50).toBe(5);
      expect(result.totalOvertimeHours).toBe(5);
      expect(result.grossPay25).toBe(0);
      expect(result.grossPay50).toBe(1500);
      expect(result.totalGrossOvertimePay).toBe(1500);
      expect(result.toplamMesaiUcreti).toBe(1500);
    });

    it("Sözleşme süresi belirtilmediğinde varsayılan 45 saat kabul edilmeli", () => {
      const result = calculateOvertime({
        grossSalary: 22500, // 22500 / 225 = 100 TL saatlik
        weeklyWorkedHours: 47, // 2 saat fazla çalışma
      });

      expect(result.hourlyGrossRate).toBe(100);
      expect(result.extraHours50).toBe(2);
      expect(result.grossPay50).toBe(300); // 2 * 100 * 1.5 = 300 TL
      expect(result.totalGrossOvertimePay).toBe(300);
    });
  });

  // ─── 2. İstisna Senaryo: Fazla Sürelerle Çalışma (< 45 Saat Sözleşme) ────
  describe("İstisna Senaryo (Sözleşme < 45 Saat, md. 41/3)", () => {
    it("40 saat sözleşmeli, 48 saat çalışan (5 saat %25 zamlı, 3 saat %50 zamlı)", () => {
      // 45.000 TL brüt -> Saatlik: 200 TL
      // 40 -> 45 arası (5 saat): 5 * (200 * 1.25) = 1250 TL
      // 45 -> 48 arası (3 saat): 3 * (200 * 1.50) = 900 TL
      // Toplam: 1250 + 900 = 2150 TL
      const result = calculateOvertime({
        grossSalary: 45000,
        weeklyContractHours: 40,
        weeklyWorkedHours: 48,
      });

      expect(result.hourlyGrossRate).toBe(200);
      expect(result.extraHours25).toBe(5);
      expect(result.extraHours50).toBe(3);
      expect(result.totalOvertimeHours).toBe(8);
      expect(result.grossPay25).toBe(1250);
      expect(result.grossPay50).toBe(900);
      expect(result.totalGrossOvertimePay).toBe(2150);
      expect(result.fazlaSureUcreti).toBe(1250);
      expect(result.fazlaCalismaUcreti).toBe(900);
    });

    it("40 saat sözleşmeli, 44 saat çalışan (yalnızca 4 saat %25 zamlı)", () => {
      // 45 saati aşmadığı için %50 zamlı mesai oluşmaz
      const result = calculateOvertime({
        grossSalary: 45000,
        weeklyContractHours: 40,
        weeklyWorkedHours: 44,
      });

      expect(result.extraHours25).toBe(4);
      expect(result.extraHours50).toBe(0);
      expect(result.grossPay25).toBe(1000); // 4 * 200 * 1.25 = 1000 TL
      expect(result.grossPay50).toBe(0);
      expect(result.totalGrossOvertimePay).toBe(1000);
    });
  });

  // ─── 3. Kuruş Yuvarlama ve Saatlik Ücret (Brüt / 225) ─────────────────────
  describe("Kuruş Yuvarlama ve Hassasiyet (DECISIONS.md Karar 3)", () => {
    it("50.000 TL brüt ile saatlik ücret ve 2 saat mesai yuvarlama doğrulaması", () => {
      // 50000 / 225 = 222.222222... -> saatlik: 222.22 TL
      // 2 saat %50 zamlı: 2 * (50000 / 225 * 1.5) = 2 * 333.3333... = 666.6666... -> 666.67 TL
      const result = calculateOvertime({
        grossSalary: 50000,
        weeklyContractHours: 45,
        weeklyWorkedHours: 47,
      });

      expect(result.hourlyGrossRate).toBe(222.22);
      expect(result.extraHours50).toBe(2);
      expect(result.grossPay50).toBe(666.67);
      expect(result.totalGrossOvertimePay).toBe(666.67);
    });

    it("Sözleşme süresini aşmayan çalışmada mesai ücreti 0 TL olmalı", () => {
      const result = calculateOvertime({
        grossSalary: 30000,
        weeklyContractHours: 45,
        weeklyWorkedHours: 45,
      });

      expect(result.totalOvertimeHours).toBe(0);
      expect(result.totalGrossOvertimePay).toBe(0);
    });
  });

  // ─── 4. Hata ve Sınır Durumları ──────────────────────────────────────────
  describe("Hata ve Doğrulama Durumları", () => {
    it("Negatif brüt maaş hata fırlatır", () => {
      expect(() =>
        calculateOvertime({ grossSalary: -100, weeklyWorkedHours: 45 })
      ).toThrow("Aylık brüt maaş negatif olamaz.");
    });

    it("Negatif çalışma saati hata fırlatır", () => {
      expect(() =>
        calculateOvertime({ grossSalary: 30000, weeklyWorkedHours: -5 })
      ).toThrow("Haftalık çalışma saati negatif olamaz.");
    });

    it("0 veya negatif sözleşme saati hata fırlatır", () => {
      expect(() =>
        calculateOvertime({
          grossSalary: 30000,
          weeklyContractHours: 0,
          weeklyWorkedHours: 40,
        })
      ).toThrow("Haftalık sözleşme süresi 0'dan büyük olmalıdır.");
    });

    it("45 saati aşan sözleşme süresi yasal sınır uyarınca hata fırlatır", () => {
      expect(() =>
        calculateOvertime({
          grossSalary: 30000,
          weeklyContractHours: 48,
          weeklyWorkedHours: 50,
        })
      ).toThrow("Haftalık sözleşme süresi yasal sınır olan 45 saati aşamaz.");
    });
  });
});
