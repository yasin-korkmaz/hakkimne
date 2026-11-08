/**
 * rehberMdx.test.tsx — MDX Dinamik Rehber, JSON-LD Schema ve MEVZUAT Testleri
 * Dayanak: 4857 sayılı İş Kanunu md. 24 & Next.js SSG Mimarisi
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RehberPage from "@/app/rehber/page";
import RehberPostPage, { generateStaticParams, generateMetadata } from "@/app/rehber/[slug]/page";
import MdxComponents from "@/components/MdxComponents";
import MEVZUAT from "@/constants/mevzuat";
import JsonLd from "@/components/JsonLd";

vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: ({ source, components }: { source: string; components?: Record<string, React.ComponentType> }) => (
    <div data-testid="mdx-remote-mock">
      <div className="mdx-text">{source}</div>
      {components?.Calculator && <components.Calculator />}
    </div>
  ),
}));

describe("MDX Blog Altyapısı Aşama 2 & 3 Testleri", () => {
  it("MEVZUAT deposu beklenen güncel sabitleri içermeli", () => {
    expect(MEVZUAT.KIDEM_TAVANI).toBeGreaterThan(50000);
    expect(MEVZUAT.ASGARI_UCRET_BRUT).toBeGreaterThan(20000);
    expect(MEVZUAT.ASGARI_UCRET_NET).toBeGreaterThan(15000);
    expect(MEVZUAT.DAMGA_VERGISI_ORANI).toBe(0.00759);
    expect(MEVZUAT.YIL).toBe(2026);
  });

  it("JsonLd bileşeni veriyi script etiketiyle güvenle basmalı", () => {
    const { container: emptyContainer } = render(<JsonLd data={null} />);
    expect(emptyContainer.querySelector("script")).toBeNull();

    const sampleSchema = { "@context": "https://schema.org", "@type": "Thing", name: "Test" };
    const { container } = render(<JsonLd data={sampleSchema} />);
    const script = container.querySelector("script[type='application/ld+json']");
    expect(script).not.toBeNull();
    expect(script?.textContent).toContain('"@type":"Thing"');
  });

  it("generateStaticParams en az 1 slug döndürmeli ve istifa slug'ını içermeli", () => {
    const params = generateStaticParams();
    expect(params.length).toBeGreaterThan(0);
    expect(params.some((p) => p.slug === "istifa-ettim-kidem-tazminati")).toBe(true);
  });

  it("generateMetadata doğru SEO başlık ve açıklamasını üretmeli", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: "istifa-ettim-kidem-tazminati" }) });
    expect(meta.title).toContain("İstifa Eden İşçi Kıdem Tazminatı");
    expect(meta.description).toContain("haklı nedenle fesih");
  });

  it("RehberPage vitrini kartları ve 'İşçi Hakları Rehberi' H1 başlığını render etmeli", () => {
    render(<RehberPage />);
    expect(screen.getByRole("heading", { level: 1, name: "İşçi Hakları Rehberi" })).toBeInTheDocument();
    expect(screen.getByText("İstifa Eden İşçi Kıdem Tazminatı Alabilir mi? (2026 Güncel Rehber)")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /İstifa Eden İşçi Kıdem Tazminatı/i })
    ).toHaveAttribute("href", "/rehber/istifa-ettim-kidem-tazminati");
  });

  it("MdxComponents nesnesi Calculator ve temel tipografi bileşenlerini içermeli", () => {
    expect(MdxComponents.Calculator).toBeDefined();
    expect(MdxComponents.h1).toBeDefined();
    expect(MdxComponents.h2).toBeDefined();
    expect(MdxComponents.p).toBeDefined();
    expect(MdxComponents.a).toBeDefined();
  });

  it("RehberPostPage geçerli slug için başlık, içerik ve Article JSON-LD render etmeli", async () => {
    const Component = await RehberPostPage({ params: Promise.resolve({ slug: "istifa-ettim-kidem-tazminati" }) });
    const { container } = render(Component);

    expect(
      screen.getByRole("heading", { level: 1, name: "İstifa Eden İşçi Kıdem Tazminatı Alabilir mi? (2026 Güncel Rehber)" })
    ).toBeInTheDocument();
    expect(screen.getByText("Kıdem Tazminatı")).toBeInTheDocument();
    expect(screen.getByText("2026-11-08")).toBeInTheDocument();
    expect(screen.getByTestId("mdx-remote-mock")).toBeInTheDocument();

    const scripts = container.querySelectorAll("script[type='application/ld+json']");
    expect(scripts.length).toBeGreaterThanOrEqual(1);

    const articleJson = Array.from(scripts)
      .map((s) => s.textContent || "")
      .find((t) => t.includes('"@type":"Article"'));

    expect(articleJson).toBeDefined();
    expect(articleJson).toContain("Yasin Korkmaz");
    expect(articleJson).toContain("HakkımNedir");
  });
});
