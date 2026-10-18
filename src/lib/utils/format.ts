/**
 * format.ts — Türkçe para/sayı biçimleme ve ayrıştırma yardımcıları.
 *
 * Türkçe sayı kuralı: nokta → binlik ayırıcı, virgül → ondalık ayırıcı.
 * Harici paket kullanılmaz; yalnızca Intl.NumberFormat ve regex kullanılır.
 * AGENTS.md Kural 6: Ağ isteği, çerez veya harici CDN yoktur.
 */

// ─── formatNumberTR ───────────────────────────────────────────────────────────

/**
 * Algoritma: Intl.NumberFormat 'tr-TR' locale'i ile her zaman 2 ondalık
 * basamak gösterir. Çevre bağımsız tutarlı çıktı için locale sabittir.
 * Örnek: 1234.5 → "1.234,50"
 */
const trFormatter = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNumberTR(n: number): string {
  return trFormatter.format(n);
}

/** Türk Lirası gösterimi: formatNumberTR(n) + " TL" */
export function formatTRY(n: number): string {
  return `${formatNumberTR(n)} TL`;
}

// ─── formatPercent ────────────────────────────────────────────────────────────

/**
 * Algoritma: Ondalık oranı (0.00759) yüzde değerine çevirir (0.759).
 * maxDecimals parametresi gereksiz sıfırları kırpar:
 *   0.15 → %15,000 değil %15; 0.00759 → %0,759.
 * Yöntem: sayıyı 100 ile çarpıp Intl.NumberFormat tr-TR ile biçimlendir,
 * ardından sağdaki fazladan sıfırları ve virgülü temizle.
 */
export function formatPercent(rate: number, maxDecimals = 3): string {
  const pct = rate * 100;
  const formatter = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
  return `%${formatter.format(pct)}`;
}

// ─── parseTRNumber ────────────────────────────────────────────────────────────

/**
 * Algoritma: Türkçe girişten sayı çıkarır.
 *   1. Boş / yalnızca boşluk → null.
 *   2. Biçim doğrulama regex: isteğe bağlı negatif işareti, ardından
 *      rakam grupları (binlik nokta ayırıcılı olabilir), isteğe bağlı
 *      virgüllü ondalık kısım. Başka karakter varsa → null.
 *   3. Birden fazla ondalık virgül (5,00,00) → null.
 *   4. Noktaları sil, virgülü noktayla değiştir, parseFloat ile sayıya çevir.
 *   5. NaN veya sonuç yanlışsa → null.
 */
export function parseTRNumber(text: string): number | null {
  if (typeof text !== "string") return null;
  const trimmed = text.trim();
  if (trimmed === "") return null;

  // İzin verilen biçim: isteğe bağlı -, rakamlar, isteğe bağlı binlik noktalar,
  // isteğe bağlı tek virgül + ondalık rakamlar.
  // Geçersiz: birden fazla virgül, harf, özel karakter.
  if (!/^-?(\d{1,3}(\.\d{3})*|\d+)(,\d+)?$/.test(trimmed)) return null;

  // Nokta (binlik ayırıcı) → kaldır; virgül (ondalık) → nokta
  const normalized = trimmed.replace(/\./g, "").replace(",", ".");
  const result = parseFloat(normalized);

  return isNaN(result) ? null : result;
}
