/**
 * PdfExportButton.test.tsx — PDF Dışa Aktarma Butonu Testleri
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PdfExportButton from "@/components/PdfExportButton";

describe("PdfExportButton Bileşeni", () => {
  it("Resmi Hak Raporunu PDF İndir butonunu erişilebilir niteliklerle render etmeli", () => {
    render(<PdfExportButton />);

    const btn = screen.getByRole("button", {
      name: "Resmi Hak Raporunu PDF İndir",
    });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("type", "button");
    expect(btn.className).toContain("min-h-[44px]");
  });
});
