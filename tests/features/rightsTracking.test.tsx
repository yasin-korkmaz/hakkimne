/**
 * rightsTracking.test.ts — Hak Takip Merkezi Birim ve Motor Testleri
 * Dayanak: FAZ 4 — Hak Takip Merkezi (localStorage & İstemci Taraflı Hesaplama)
 */

import { describe, it, expect } from "vitest";
import {
  computeProfileSummary,
  parseImportedProfile,
  DEFAULT_PROFILE,
  type UserProfile,
} from "@/features/rights-tracking";

describe("FAZ 4: computeProfileSummary Motor Testleri", () => {
  const sampleProfile: UserProfile = {
    startDate: "2024-01-15",
    grossSalary: 45000,
    monthlyExtra: 5000,
    weeklyContractHours: 45,
    age: 32,
    usedLeaveDays: 4,
    sector: "Özel Sektör / Bilişim ve Teknoloji",
    overtimeEntries: [
      { id: "1", date: "2026-05-10", hours: 4, type: "overtime_50" },
      { id: "2", date: "2026-05-17", hours: 8, type: "weekend_100" },
    ],
    lastUpdated: "2026-06-01T10:00:00.000Z",
  };

  it("tam 2 yıl 4 ay 16 gün kıdemde doğru hizmet süresi ve kıdem hak edişi", () => {
    // 2024-01-15 -> 2026-06-01
    const summary = computeProfileSummary(sampleProfile, "2026-06-01");

    expect(summary.completedYears).toBe(2);
    expect(summary.isEligibleForSeverance).toBe(true);
    expect(summary.duration.years).toBe(2);
  });

  it("giydirilmiş brüt çıplak maaş ve yan hakları kuruş hassasiyetiyle toplamalı", () => {
    const summary = computeProfileSummary(sampleProfile, "2026-06-01");
    expect(summary.dressedMonthlyGross).toBe(50000); // 45000 + 5000
  });

  it("saatlik ücret 225 standart bölen üzerinden hesaplanmalı", () => {
    const summary = computeProfileSummary(sampleProfile, "2026-06-01");
    // 45000 / 225 = 200 TL
    expect(summary.hourlyGrossRate).toBe(200);
  });

  it("yıllık izin hak edişi (2 yıl x 14 = 28 gün) ve kalan gün hesaplanmalı", () => {
    const summary = computeProfileSummary(sampleProfile, "2026-06-01");
    // 2 yıl kıdemde: 2 x 14 = 28 gün hak edilen, 4 gün kullanılan -> 24 gün kalan
    expect(summary.totalEarnedLeaveDays).toBe(28);
    expect(summary.remainingLeaveDays).toBe(24);
    // Günlük brüt: 45000 / 30 = 1500 TL. 24 x 1500 = 36000 TL
    expect(summary.estimatedLeavePay).toBe(36000);
  });

  it("fazla mesai kayıtları %50 ve %100 zam farkıyla toplanmalı", () => {
    const summary = computeProfileSummary(sampleProfile, "2026-06-01");
    // Saatlik: 200 TL
    // 4 saat %50 zamlı: 4 * 200 * 1.5 = 1200 TL
    // 8 saat %100 zamlı: 8 * 200 * 2.0 = 3200 TL
    // Toplam: 12 saat, 4400 TL
    expect(summary.totalOvertimeHours).toBe(12);
    expect(summary.estimatedOvertimePay).toBe(4400);
  });

  it("ihbar önel süresi çalışma süresi kademesine göre 6 hafta olmalı (1.5 - 3 yıl)", () => {
    const summary = computeProfileSummary(sampleProfile, "2026-06-01");
    expect(summary.noticeWeeks).toBe(6);
  });

  it("yasal dönüm noktaları ve hatırlatıcılar eksiksiz üretilmeli", () => {
    const summary = computeProfileSummary(sampleProfile, "2026-06-01");
    expect(summary.milestones.length).toBeGreaterThanOrEqual(3);

    const sevMilestone = summary.milestones.find((m) => m.id === "severance_threshold");
    expect(sevMilestone).toBeDefined();
    expect(sevMilestone?.isReached).toBe(true);

    const leaveMilestone = summary.milestones.find((m) => m.id === "next_leave_anniversary");
    expect(leaveMilestone).toBeDefined();
    expect(leaveMilestone?.title).toContain("3. Yıl İzin Hak Edişi");
  });
});

describe("FAZ 4: storage İçe ve Dışa Aktarma Testleri", () => {
  it("geçerli JSON string profili başarıyla parse edilmeli", () => {
    const jsonStr = JSON.stringify({
      startDate: "2025-05-01",
      grossSalary: 60000,
      monthlyExtra: 0,
      weeklyContractHours: 45,
      usedLeaveDays: 0,
    });
    const parsed = parseImportedProfile(jsonStr);
    expect(parsed.startDate).toBe("2025-05-01");
    expect(parsed.grossSalary).toBe(60000);
    expect(parsed.weeklyContractHours).toBe(45);
  });

  it("eksik veya geçersiz JSON string hata fırlatmalı", () => {
    expect(() => parseImportedProfile("")).toThrow();
    expect(() => parseImportedProfile('{"invalid": true}')).toThrow();
  });

  it("varsayılan profil değerleri geçerli olmalı", () => {
    expect(DEFAULT_PROFILE.weeklyContractHours).toBe(45);
    expect(DEFAULT_PROFILE.grossSalary).toBe(0);
  });
});

describe("FAZ 4: HakTakipMerkeziPage Render Testi", () => {
  it("sayfa H1 başlığı ve gizlilik güvencesi render edilmeli", async () => {
    const { default: HakTakipMerkeziPage } = await import("@/app/hak-takip-merkezi/page");
    const { render, screen } = await import("@testing-library/react");
    render(<HakTakipMerkeziPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Hak Takip Merkezi" })).toBeInTheDocument();
    expect(screen.getByText(/Sıfır Sunucu & Cihazda Saklanan Veri/i)).toBeInTheDocument();
  });
});
