/**
 * mdx.test.ts — MDX Core Utils Testleri
 * Dayanak: 4857 sayılı İş Kanunu md. 24 & Rehber İçerik Yönetimi
 */

import { describe, it, expect, vi } from "vitest";
import fs from "fs";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";

describe("MDX Core Utils (src/lib/mdx.ts)", () => {
  it("getAllPosts() örnek rehber içeriğini başarıyla listelemeli", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);

    const post = posts.find((p) => p.slug === "istifa-ettim-kidem-tazminati");
    expect(post).toBeDefined();
    expect(post?.frontmatter.title).toBe("İstifa Ettim Kıdem Tazminatı Alabilir Miyim? (2026)");
    expect(post?.frontmatter.category).toBe("Kıdem Tazminatı");
    expect(post?.frontmatter.date).toBe("2026-11-08");
    expect(post?.frontmatter.description).toContain("Haklı nedenle fesih");
    expect(post?.content).toContain("<Calculator />");
  });

  it("getPostBySlug() geçerli slug ile çağrıldığında doğru içeriği dönmeli", () => {
    const post = getPostBySlug("istifa-ettim-kidem-tazminati");
    expect(post).not.toBeNull();
    expect(post?.slug).toBe("istifa-ettim-kidem-tazminati");
    expect(post?.frontmatter.title).toContain("İstifa Ettim");
    expect(post?.content).toContain("İş Kanunu madde 24");
  });

  it("getPostBySlug() var olmayan slug için null dönmeli", () => {
    const post = getPostBySlug("var-olmayan-yazi-slug-123");
    expect(post).toBeNull();
  });

  it("getAllPosts() klasör bulunamadığında çökmeyip boş dizi dönmeli", () => {
    const originalExistsSync = fs.existsSync;
    vi.spyOn(fs, "existsSync").mockReturnValue(false);

    const posts = getAllPosts();
    expect(posts).toEqual([]);

    const post = getPostBySlug("istifa-ettim-kidem-tazminati");
    expect(post).toBeNull();

    vi.spyOn(fs, "existsSync").mockImplementation(originalExistsSync);
  });
});
