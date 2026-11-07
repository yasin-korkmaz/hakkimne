/**
 * kpssSlug.test.tsx
 * Programatik KPSS İlan Sayfası ve generateStaticParams Testleri
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import KpssIlanPage, {
  generateStaticParams,
  generateMetadata,
} from "@/app/kpss/[slug]/page";

describe("KPSS Programatik SEO [slug] Sayfası", () => {
  const sampleSlug = "sgk-45-sozlesmeli-programci-alimi-2026";

  it("generateStaticParams en fazla 200 adet slug üretmeli ve geçerli slug'ları içermeli", async () => {
    const params = await generateStaticParams();
    expect(Array.isArray(params)).toBe(true);
    expect(params.length).toBeGreaterThan(0);
    expect(params.length).toBeLessThanOrEqual(200);

    const hasSample = params.some((p) => p.slug === sampleSlug);
    expect(hasSample).toBe(true);
  });

  it("generateMetadata SEO uyumlu başlık, açıklama ve canonical URL üretmeli", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: sampleSlug }) });
    expect(meta.title).toContain("Sosyal Güvenlik Kurumu");
    expect(meta.description).toContain("3249");
    expect(meta.alternates?.canonical).toBe(`/kpss/${sampleSlug}`);
  });

  it("geçerli slug ile çağrıldığında ilanın detaylarını, kurumunu ve başvuru butonunu render etmeli", async () => {
    const Component = await KpssIlanPage({
      params: Promise.resolve({ slug: sampleSlug }),
    });

    render(Component);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Sosyal Güvenlik Kurumu 45 Sözleşmeli Programcı Alımı/i,
      })
    ).toBeInTheDocument();

    expect(screen.getAllByText("Sosyal Güvenlik Kurumu (SGK)").length).toBeGreaterThan(0);
    expect(screen.getByText("3249")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Resmî İlana Git ve Başvur/i })).toBeInTheDocument();
  });
});
