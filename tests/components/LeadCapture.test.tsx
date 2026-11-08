/**
 * LeadCapture.test.tsx — E-posta Toplama (Lead) Kartı Testleri
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeadCapture from "@/components/LeadCapture";

describe("LeadCapture Bileşeni", () => {
  it("başlığı, e-posta alanını ve Gönder butonunu render etmeli", () => {
    render(<LeadCapture />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /Mevzuat Değiştiğinde Haber Ver & Ücretsiz İhtarname Taslağını Al/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("ornek@eposta.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gönder" })).toBeInTheDocument();
  });

  it("geçersiz e-posta girildiğinde hata mesajı göstermeli", async () => {
    const user = userEvent.setup();
    render(<LeadCapture />);

    const emailInput = screen.getByPlaceholderText("ornek@eposta.com");
    await user.type(emailInput, "gecersiz-eposta");

    const submitBtn = screen.getByRole("button", { name: "Gönder" });
    await user.click(submitBtn);

    expect(
      screen.getByText("Lütfen geçerli bir e-posta adresi giriniz.")
    ).toBeInTheDocument();
  });

  it("geçerli e-posta girildiğinde başarı mesajı göstermeli", async () => {
    const user = userEvent.setup();
    render(<LeadCapture />);

    const emailInput = screen.getByPlaceholderText("ornek@eposta.com");
    await user.type(emailInput, "isci@example.com");

    const submitBtn = screen.getByRole("button", { name: "Gönder" });
    await user.click(submitBtn);

    expect(screen.getByText("Başarıyla Kaydoldunuz!")).toBeInTheDocument();
    expect(
      screen.getByText(/ücretsiz hak arama ve ihtarname rehberimiz e-posta kutunuza iletilecektir/i)
    ).toBeInTheDocument();
  });
});
