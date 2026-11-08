/**
 * NextStepsCard.test.tsx — Hesaplama Sonrası Hukuki Eylem Kartı Testleri
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NextStepsCard from "@/components/NextStepsCard";

describe("NextStepsCard Bileşeni", () => {
  it("başlığı ve 3 temel hukuki adımı eksiksiz render etmeli", () => {
    render(<NextStepsCard />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Şimdi Ne Yapmalıyım?" })
    ).toBeInTheDocument();

    expect(screen.getByText("Kanıtlarınızı Toplayın:")).toBeInTheDocument();
    expect(screen.getByText("Arabulucuya Başvurun:")).toBeInTheDocument();
    expect(screen.getByText("Zamanaşımına Dikkat Edin:")).toBeInTheDocument();

    expect(
      screen.getByText(/dava açmadan önce arabulucuya gitmek yasal zorunluluktur/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/yasal zamanaşımı süresi 5 yıldır/i)
    ).toBeInTheDocument();
  });
});
