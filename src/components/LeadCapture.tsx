"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * LeadCapture.tsx — Mevzuat Güncelleme & İhtarname Taslağı E-Posta Toplama Kartı
 * Dayanak: 6698 sayılı KVKK md. 5 & Açık Rıza ilkeleri (Sunucusuz İstemci Durumu).
 */

export default function LeadCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Lütfen geçerli bir e-posta adresi giriniz.");
      return;
    }

    setError("");
    console.log("Email kaydedildi:", cleanEmail);
    trackEvent("email_signup");
    setSubmitted(true);
  };

  return (
    <section
      aria-labelledby="lead-capture-heading"
      className="w-full bg-gradient-to-br from-blue-50/90 via-slate-50 to-indigo-50/60 border border-blue-200/80 rounded-2xl p-5 sm:p-7 shadow-xs"
    >
      {submitted ? (
        <div
          role="status"
          className="flex flex-col sm:flex-row items-center gap-4 py-2 text-center sm:text-left"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Başarıyla Kaydoldunuz!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mevzuat ve kıdem tavanı değişikliklerinde anında bilgilendirileceksiniz.
              Ücretsiz hak arama ve ihtarname rehberimiz e-posta kutunuza iletilecektir.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
              <Mail className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3
                id="lead-capture-heading"
                className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
              >
                Mevzuat Değiştiğinde Haber Ver & Ücretsiz İhtarname Taslağını Al
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                2026 Temmuz kıdem tavanı ve asgari ücret artışlarından ilk siz haberdar olun.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="lead-email" className="sr-only">
                E-posta Adresiniz
              </label>
              <input
                id="lead-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="ornek@eposta.com"
                aria-invalid={!!error}
                aria-describedby={error ? "lead-email-err" : undefined}
                className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1769E0]"
              />
              {error && (
                <span id="lead-email-err" role="alert" className="text-xs text-red-600 font-medium">
                  {error}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1769E0] hover:bg-[#123C68] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"
            >
              <span>Gönder</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span>Spam yok. Bilgileriniz KVKK ilkeleri gereği gizli tutulur.</span>
          </div>
        </div>
      )}
    </section>
  );
}
