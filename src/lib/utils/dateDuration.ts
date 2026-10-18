/**
 * dateDuration.ts
 * Takvim tabanlı hizmet süresi hesap yardımcıları.
 * DECISIONS.md Karar 1: Tarihler YYYY-MM-DD metni; yerel saat dilimine bağlı
 * Date.getTime(), getHours(), getTimezoneOffset() KULLANILMAZ. Tüm işlemler
 * Date.UTC() ile UTC gece yarısı referanslı veya saf sayı aritmetiği ile yapılır.
 * Çıkış günü çalışılmış sayılır: bitiş sınırı (hariç) = çıkış tarihi + 1 gün.
 */

// ─── Yardımcı: Parçalara ayır ────────────────────────────────────────────────

/** ISO tarih metnini { y, m, d } sayı üçlüsüne dönüştürür. Doğrulama yapmaz. */
function parts(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split("-").map(Number);
  return { y: y!, m: m!, d: d! };
}

/** { y, m, d } → "YYYY-MM-DD" */
function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Verilen yıl ve ay için ayın son gün sayısını döner (UTC). */
function daysInMonth(y: number, m: number): number {
  // Date.UTC(y, m, 0) → m. ayın son günü (0. gün = önceki ayın sonu)
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

// ─── 1. parseIsoDate ─────────────────────────────────────────────────────────

/**
 * Algoritma: YYYY-MM-DD biçim kalıbını regex ile kontrol eder; ardından
 * Date.UTC ile geri-dönüşüm yaparak y/m/d değerlerinin takvimde gerçekten
 * var olduğunu doğrular (örn. 2026-02-30 → getUTCDate() 2 döner, 30 değil).
 */
export function parseIsoDate(s: string): boolean {
  if (typeof s !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const { y, m, d } = parts(s);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() + 1 === m &&
    dt.getUTCDate() === d
  );
}

// ─── 2. addDays ──────────────────────────────────────────────────────────────

/**
 * Algoritma: ISO tarihi UTC gece yarısı epoch'una çevirir, n * 86400000 ms
 * ekler, sonucu tekrar YYYY-MM-DD metnine dönüştürür. Ay/yıl sınırlarını
 * JavaScript Date motoru otomatik çözer; saat dilimi etkisi yoktur.
 */
export function addDays(iso: string, n: number): string {
  const { y, m, d } = parts(iso);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return toIso(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

// ─── 3. addMonthsClamped ─────────────────────────────────────────────────────

/**
 * Algoritma: Hedef ay = (m - 1 + n) mod 12 + 1; hedef yıl buna göre artar.
 * Hedef ayda gün yoksa (örn. 31 Ocak + 1 ay → Şubat'ta 31. gün yok)
 * ayın son gününe kırpar (clamping). DECISIONS.md Karar 1.
 */
export function addMonthsClamped(iso: string, n: number): string {
  const { y, m, d } = parts(iso);
  const totalMonths = (m - 1) + n;
  const newY = y + Math.floor(totalMonths / 12);
  const newM = (totalMonths % 12) + 1;
  const maxD = daysInMonth(newY, newM);
  return toIso(newY, newM, Math.min(d, maxD));
}

// ─── 4. addYearsClamped ──────────────────────────────────────────────────────

/**
 * Algoritma: Yılı n artırır; hedef yılda o gün yoksa (29 Şubat → artık olmayan yıl)
 * ayın son gününe kırpar. addMonthsClamped(iso, n * 12) ile eşdeğer.
 */
export function addYearsClamped(iso: string, n: number): string {
  return addMonthsClamped(iso, n * 12);
}

// ─── 5. computeDuration ──────────────────────────────────────────────────────

export interface Duration {
  years: number;
  months: number;
  days: number;
}

/**
 * Algoritma (1475 md. 14 kapsamında hizmet süresi):
 * 1. end = exitIso + 1 gün (çıkış günü dahil, DECISIONS.md Karar 1).
 * 2. Tam yıllar: giriş + y yıl (kırpamalı) <= end koşulunu sağlayan en büyük y.
 *    Döngü yerine binary search yerine: start + (y+1) yıl > end mi? kontrol et.
 * 3. Kalan kısım için cursor = start + y yıl. Tam aylar: benzer şekilde en büyük m.
 * 4. Kalan günler: cursor2 (UTC) ile end (UTC) arasındaki ms farkı / 86400000.
 *
 * Hata: exitIso < startIso veya geçersiz tarih → hata fırlatır.
 */
export function computeDuration(startIso: string, exitIso: string): Duration {
  if (!parseIsoDate(startIso)) {
    throw new Error(`Geçersiz giriş tarihi: "${startIso}"`);
  }
  if (!parseIsoDate(exitIso)) {
    throw new Error(`Geçersiz çıkış tarihi: "${exitIso}"`);
  }
  if (exitIso < startIso) {
    throw new Error(
      `Çıkış tarihi (${exitIso}) giriş tarihinden (${startIso}) önce olamaz.`
    );
  }

  // end = çıkış + 1 gün (hariç bitiş sınırı)
  const endIso = addDays(exitIso, 1);

  // Adım 2: Tam yıllar
  let years = 0;
  while (addYearsClamped(startIso, years + 1) <= endIso) {
    years++;
  }

  // Adım 3: Tam aylar (yıllar çıkarıldıktan sonra kalan)
  const afterYears = addYearsClamped(startIso, years);
  let months = 0;
  while (addMonthsClamped(afterYears, months + 1) <= endIso) {
    months++;
  }

  // Adım 4: Kalan günler (UTC epoch farkı)
  const afterMonths = addMonthsClamped(afterYears, months);
  const { y: ay, m: am, d: ad } = parts(afterMonths);
  const { y: ey, m: em, d: ed } = parts(endIso);
  const msAfter = Date.UTC(ay, am - 1, ad);
  const msEnd   = Date.UTC(ey, em - 1, ed);
  const days = Math.round((msEnd - msAfter) / 86400000);

  return { years, months, days };
}

// ─── 6. compareDurationToMonths ──────────────────────────────────────────────

/**
 * Algoritma (4857 md. 17 ihbar kademesi sınır testi):
 * Tam n ay = giriş + n ay (kırpamalı) ISO değeri bitiş sınırına (end = exit+1) eşit mi?
 * - threshold = addMonthsClamped(startIso, n)
 * - end < threshold  → -1 (n aydan az çalışılmış)
 * - end === threshold → 0  (tam n ay)
 * - end > threshold  → 1  (n aydan fazla)
 *
 * Hata: Geçersiz tarih veya exitIso < startIso durumunda hata fırlatır.
 */
export function compareDurationToMonths(
  startIso: string,
  exitIso: string,
  n: number
): -1 | 0 | 1 {
  if (!parseIsoDate(startIso)) {
    throw new Error(`Geçersiz giriş tarihi: "${startIso}"`);
  }
  if (!parseIsoDate(exitIso)) {
    throw new Error(`Geçersiz çıkış tarihi: "${exitIso}"`);
  }
  if (exitIso < startIso) {
    throw new Error(
      `Çıkış tarihi (${exitIso}) giriş tarihinden (${startIso}) önce olamaz.`
    );
  }

  const endIso = addDays(exitIso, 1);
  const threshold = addMonthsClamped(startIso, n);

  if (endIso < threshold) return -1;
  if (endIso === threshold) return 0;
  return 1;
}
