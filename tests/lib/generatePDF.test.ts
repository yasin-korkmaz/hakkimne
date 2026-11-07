/**
 * generatePDF.test.ts
 * PDF oluşturma fonksiyonu birim testi
 */

import { describe, it, expect, vi } from "vitest";
import { generatePDF, type HesaplamaSonucu } from "@/lib/generatePDF";

const { saveMock, MockJsPDF } = vi.hoisted(() => {
  const saveMock = vi.fn();
  const mockInstance = {
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    },
    save: saveMock,
    text: vi.fn(),
    line: vi.fn(),
    roundedRect: vi.fn(),
    setFont: vi.fn(),
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    setFillColor: vi.fn(),
    setDrawColor: vi.fn(),
    setLineWidth: vi.fn(),
  };
  function MockJsPDF() {
    return mockInstance;
  }
  return { saveMock, MockJsPDF };
});

vi.mock("jspdf", () => ({
  default: MockJsPDF,
}));

vi.mock("jspdf-autotable", () => ({
  default: vi.fn(),
}));

describe("generatePDF", () => {
  it("hesaplama verilerini alarak PDF üretmeli ve 'hakkimnedir-tazminat-hesaplama.pdf' adıyla kaydetmeli", () => {
    const data: HesaplamaSonucu = {
      netKidem: 100000,
      grossKidem: 100759,
      netIhbar: 18000,
      grossIhbar: 22000,
      toplamNet: 118000,
      serviceDuration: "2 yıl 4 ay",
      monthlySalary: 30000,
      extraBenefits: 2500,
    };

    generatePDF(data);

    expect(saveMock).toHaveBeenCalledWith("hakkimnedir-tazminat-hesaplama.pdf");
  });
});
