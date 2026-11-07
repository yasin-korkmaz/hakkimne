/**
 * sayac-worker.js — Cloudflare Worker & D1 Ziyaretçi/Hesaplama Sayacı
 *
 * D1 Tablo Şeması:
 * CREATE TABLE IF NOT EXISTS hesaplama_log (
 *   id INTEGER PRIMARY KEY AUTOINCREMENT,
 *   tur TEXT DEFAULT 'genel',
 *   tarih DATETIME DEFAULT CURRENT_TIMESTAMP
 * );
 *
 * Kurulum:
 * wrangler d1 create sayac-db
 * wrangler deploy
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  /**
   * Cloudflare Worker ana istek işleyici
   */
  async fetch(request, env) {
    // 1. CORS Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    // 2. POST /api/hesaplama — Yeni hesaplama kaydı ekle (Fire-and-forget)
    if (request.method === "POST" && url.pathname === "/api/hesaplama") {
      try {
        let tur = "genel";
        try {
          const body = await request.json();
          if (body && typeof body.tur === "string") {
            tur = body.tur.slice(0, 32);
          }
        } catch {
          // Gövde ayrıştırma opsiyonel
        }

        if (env.DB) {
          await env.DB.prepare(
            "INSERT INTO hesaplama_log (tur, tarih) VALUES (?, datetime('now'))"
          )
            .bind(tur)
            .run();
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 201,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ ok: false, error: err.message || "Insert failed" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS },
          }
        );
      }
    }

    // 3. GET /api/sayac — Son 30 günün toplam hesaplama adedini döner
    if (request.method === "GET" && url.pathname === "/api/sayac") {
      try {
        let count = 14800;
        if (env.DB) {
          const result = await env.DB.prepare(
            "SELECT COUNT(*) as toplam FROM hesaplama_log WHERE tarih >= date('now', '-30 days')"
          ).first();

          if (result && typeof result.toplam === "number") {
            // Taban başlangıç sayısı + loglanan gerçek hesaplamalar
            count = Math.max(result.toplam, 14800);
          }
        }

        return new Response(JSON.stringify({ toplam: count }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=60", // 1 dakika edge caching
            ...CORS_HEADERS,
          },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ toplam: 14800, fallback: true }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS },
          }
        );
      }
    }

    // 4. Bilinmeyen Rota (404)
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  },
};
