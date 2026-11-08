/**
 * MostReadArticles.test.tsx — En Çok Okunan Rehber Yazıları Bileşeni Testleri
 * Dayanak: 4857 ve 1475 sayılı kanun rehber içeriklerinin ana sayfa entegrasyonu.
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MostReadArticles from "@/components/MostReadArticles";
import * as mdxModule from "@/lib/mdx";

describe("MostReadArticles Bileşeni", () => {
  it("başlığı, açıklamayı ve en fazla ilk 3 makaleyi render etmeli", () => {
    render(<MostReadArticles />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "İşçi Hakları Rehberi (En Çok Okunanlar)",
      })
    ).toBeInTheDocument();

    const readLinks = screen.getAllByRole("link", { name: /Rehberi Oku/i });
    expect(readLinks.length).toBeGreaterThan(0);
    expect(readLinks.length).toBeLessThanOrEqual(3);

    // İlk makalenin linki doğru slug'a işaret etmeli
    expect(readLinks[0].getAttribute("href")).toMatch(/^\/rehber\//);
  });

  it("hiç makale yoksa boş (null) dönmeli", () => {
    vi.spyOn(mdxModule, "getAllPosts").mockReturnValueOnce([]);
    const { container } = render(<MostReadArticles />);
    expect(container.firstChild).toBeNull();
  });
});
