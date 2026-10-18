/**
 * money.ts — Para yuvarlama yardımcısı.
 *
 * Algoritma (DECISIONS.md Karar 3):
 *   Ara değerler ASLA yuvarlanmaz; yalnızca nihai tutarlar bu fonksiyonla
 *   2 kuruş hanesine yuvarlanır.
 *   Formül: Math.round((n + Number.EPSILON) * 100) / 100
 *   Number.EPSILON eklenmesinin nedeni: kayan nokta gösterimindeki
 *   0.1 + 0.2 = 0.30000...4 gibi birikimli hatalardan arındırmak.
 */

/**
 * Verilen sayıyı 2 ondalık basamağa (kuruş) yuvarlar.
 * Yalnızca hesaplama zincirinin son adımında çağrılmalıdır.
 */
export function roundToKurus(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
