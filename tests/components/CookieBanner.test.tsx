/**
 * CookieBanner.test.tsx — Çerez Onay Bildirimi Testleri
 */

import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CookieBanner from "@/components/CookieBanner";
import { CONSENT_STORAGE_KEY } from "@/lib/analytics";

describe("CookieBanner Bileşeni", () => {
  beforeEach(() => {
    localStorage.clear();
    const existing = document.getElementById("ga4-script");
    if (existing) existing.remove();
  });

  it("henüz tercih yapılmamışsa banner görünmeli", () => {
    render(<CookieBanner />);

    expect(screen.getByRole("region", { name: "Çerez ve Gizlilik Tercihleri" })).toBeInTheDocument();
    expect(screen.getByText(/KVKK/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Çerezleri Kabul Et" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Çerezleri Reddet" })).toBeInTheDocument();
  });

  it("daha önce onay verildiyse banner gizli kalmalı", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "true");
    const { container } = render(<CookieBanner />);

    expect(container.firstChild).toBeNull();
  });

  it("Kabul Et tıklandığında localStorage güncellenmeli ve banner kapanmalı", () => {
    render(<CookieBanner />);

    const acceptBtn = screen.getByRole("button", { name: "Çerezleri Kabul Et" });
    fireEvent.click(acceptBtn);

    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("true");
    expect(screen.queryByRole("region", { name: "Çerez ve Gizlilik Tercihleri" })).not.toBeInTheDocument();
  });

  it("Reddet tıklandığında localStorage false kaydedilmeli ve banner kapanmalı", () => {
    render(<CookieBanner />);

    const declineBtn = screen.getByRole("button", { name: "Çerezleri Reddet" });
    fireEvent.click(declineBtn);

    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("false");
    expect(screen.queryByRole("region", { name: "Çerez ve Gizlilik Tercihleri" })).not.toBeInTheDocument();
  });
});
