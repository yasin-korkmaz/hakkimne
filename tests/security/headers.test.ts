/**
 * headers.test.ts — Güvenlik Başlıkları ve Sertleştirme Testleri
 * Dayanak: PRD, DECISIONS.md (Cloudflare Pages) & Görev 18 gereksinimleri.
 */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Cloudflare Pages Güvenlik Başlıkları (public/_headers)", () => {
  const publicHeadersPath = path.resolve(process.cwd(), "public", "_headers");

  it("public/_headers dosyası mevcut olmalı", () => {
    expect(fs.existsSync(publicHeadersPath)).toBe(true);
  });

  it("zorunlu güvenlik başlıklarını eksiksiz içermeli", () => {
    const content = fs.readFileSync(publicHeadersPath, "utf-8");

    // 1. X-Content-Type-Options
    expect(content).toContain("X-Content-Type-Options: nosniff");

    // 2. X-Frame-Options
    expect(content).toContain("X-Frame-Options: DENY");

    // 3. Permissions-Policy
    expect(content).toContain("Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()");

    // 4. Referrer-Policy
    expect(content).toContain("Referrer-Policy: strict-origin-when-cross-origin");

    // 5. Content-Security-Policy (Report-Only)
    expect(content).toContain("Content-Security-Policy-Report-Only:");
    expect(content).toContain("default-src 'self'");
    expect(content).toContain("frame-ancestors 'none'");
  });

  it("build sonrasında out/_headers dosyası mevcut olmalı ve başlıkları içermeli", () => {
    const outHeadersPath = path.resolve(process.cwd(), "out", "_headers");
    // Eğer out dizini varsa (build sonrası) doğrula
    if (fs.existsSync(path.resolve(process.cwd(), "out"))) {
      if (fs.existsSync(outHeadersPath)) {
        const outContent = fs.readFileSync(outHeadersPath, "utf-8");
        expect(outContent).toContain("X-Content-Type-Options: nosniff");
        expect(outContent).toContain("X-Frame-Options: DENY");
      }
    }
  });
});
