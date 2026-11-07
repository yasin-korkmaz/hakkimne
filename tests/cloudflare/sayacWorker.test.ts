/**
 * sayacWorker.test.ts
 * Cloudflare Worker Sayac API Birim Testleri
 */

import { describe, it, expect, vi } from "vitest";
// @ts-expect-error JS module without declaration file
import worker from "../../cloudflare/sayac-worker.js";

describe("Cloudflare Worker sayac-worker.js", () => {
  const mockPrepare = vi.fn();
  const mockBind = vi.fn();
  const mockRun = vi.fn().mockResolvedValue({ success: true });
  const mockFirst = vi.fn().mockResolvedValue({ toplam: 15200 });

  mockPrepare.mockReturnValue({
    bind: mockBind.mockReturnValue({
      run: mockRun,
    }),
    first: mockFirst,
  });

  const mockEnv = {
    DB: {
      prepare: mockPrepare,
    },
  };

  it("OPTIONS isteğine CORS headerları ile 204 yanıtı dönmeli", async () => {
    const req = new Request("https://sayac.hakkimnedir.workers.dev/api/sayac", {
      method: "OPTIONS",
    });

    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("POST /api/hesaplama geldiğinde D1 tablosuna kayıt atmalı ve 201 dönmeli", async () => {
    const req = new Request("https://sayac.hakkimnedir.workers.dev/api/hesaplama", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tur: "tazminat" }),
    });

    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(201);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(mockPrepare).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO hesaplama_log")
    );
  });

  it("GET /api/sayac geldiğinde D1 son 30 günün toplam sayısını dönmeli", async () => {
    const req = new Request("https://sayac.hakkimnedir.workers.dev/api/sayac", {
      method: "GET",
    });

    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    const json = await res.json();
    expect(json.toplam).toBe(15200);
    expect(mockPrepare).toHaveBeenCalledWith(
      expect.stringContaining("SELECT COUNT(*) as toplam FROM hesaplama_log")
    );
  });
});
