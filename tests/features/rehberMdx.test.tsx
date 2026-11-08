/**
 * rehberMdx.test.tsx — MDX Dinamik Rehber ve Bileşen Haritası Testleri
 * Dayanak: 4857 sayılı İş Kanunu md. 24 & Next.js SSG Mimarisi
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RehberPage from "@/app/rehber/page";
import RehberPostPage, { generateStaticParams, generateMetadata } from "@/app/rehber/[slug]/page";
import MdxComponents from "@/components/MdxComponents";

vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: ({ source, components }: { source: string; components?: Record<string, React.ComponentType> }) => (
    <div data-testid="mdx-remote-mock">
      <div className="mdx-text">{source}</div>
      {components?.Calculator && <components.Calculator />}
    </div>
  ),
}));

describe("MDX Blog Altyapısı Aşama 2 Testleri", () => {
  it("generateStaticParams en az 1 slug döndürmeli ve istifa slug'ını içermeli", () => {
    const params = generateStaticParams();
    expect(params.length).toBeGreaterThan(0);
    expect(params.some((p) => p.slug === "istifa-ettim-kidem-tazminati")).toBe(true);
  });

  it("generateMetadata doğru SEO başlık ve açıklamasını üretmeli", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: "istifa-ettim-kidem-tazminati" }) });
    expect(meta.title).toContain("İstifa Ettim Kıdem Tazminatı");
    expect(meta.description).toContain("Haklı nedenle fesih halleri");
  });

  it("RehberPage vitrini kartları ve 'İşçi Hakları Rehberi' H1 başlığını render etmeli", () => {
    render(<RehberPage />);
    expect(screen.getByRole("heading", { level: 1, name: "İşçi Hakları Rehberi" })).toBeInTheDocument();
    expect(screen.getByText("İstifa Ettim Kıdem Tazminatı Alabilir Miyim? (2026)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /İstifa Ettim/i })).toHaveAttribute(
      "href",
      "/rehber/istifa-ettim-kidem-tazminati"
    );
  });

  it("MdxComponents nesnesi Calculator ve temel tipografi bileşenlerini içermeli", () => {
    expect(MdxComponents.Calculator).toBeDefined();
    expect(MdxComponents.h1).toBeDefined();
    expect(MdxComponents.h2).toBeDefined();
    expect(MdxComponents.p).toBeDefined();
    expect(MdxComponents.a).toBeDefined();
  });

  it("RehberPostPage geçerli slug için başlık ve içeriği render etmeli", async () => {
    const Component = await RehberPostPage({ params: Promise.resolve({ slug: "istifa-ettim-kidem-tazminati" }) });
    render(Component);

    expect(
      screen.getByRole("heading", { level: 1, name: "İstifa Ettim Kıdem Tazminatı Alabilir Miyim? (2026)" })
    ).toBeInTheDocument();
    expect(screen.getByText("Kıdem Tazminatı")).toBeInTheDocument();
    expect(screen.getByText("2026-11-08")).toBeInTheDocument();
    expect(screen.getByTestId("mdx-remote-mock")).toBeInTheDocument();
  });
});
