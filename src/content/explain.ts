/* TASLAK — hukuk/İK kontrolü gerekli */

/**
 * explain.ts — Hesaplama Mantığı ve Örnek Hesaplama Verisi
 * Dayanak: 1475 Sayılı Kanun md. 14 & 4857 Sayılı Kanun md. 17
 * Rakamlar: Yalnızca PRD.md Senaryo 1 verileridir (AGENTS.md Kural 4).
 */

export interface FormulaStep {
  stepNumber: number;
  title: string;
  description: string;
  formula?: string;
  lawReference?: string;
}

export interface ExampleRow {
  label: string;
  value: string;
  note?: string;
}

export const HOW_IT_WORKS_STEPS: FormulaStep[] = [
  {
    stepNumber: 1,
    title: "Çalışma Süresinin Hesaplanması",
    description:
      "İşe giriş ve işten çıkış tarihleri esas alınarak takvim aritmetiğiyle çalışılan tam yıl, tam ay ve artık günler hesaplanır. Çıkış günü çalışılmış kabul edilir.",
    lawReference: "1475 Sayılı Kanun md. 14 & 4857 Sayılı Kanun md. 17",
  },
  {
    stepNumber: 2,
    title: "Giydirilmiş Brüt Ücretin Tespiti",
    description:
      "Çıplak aylık brüt ücrete, süreklilik arz eden düzenli aylık ek ödemeler ile son 1 yılda ödenen brüt ikramiye/prim toplamının 12'ye bölünmüş payı eklenir.",
    formula: "Giydirilmiş Brüt = Çıplak Brüt + Aylık Ek + (Yıllık İkramiye / 12)",
  },
  {
    stepNumber: 3,
    title: "Kıdem Baz Ücreti ve Tavan Kontrolü",
    description:
      "Kıdem tazminatına esas baz ücret belirlenirken, giydirilmiş brüt ücret işten çıkış tarihindeki resmî kıdem tavanı ile karşılaştırılır ve küçük olan tutar baz alınır.",
    formula: "Kıdem Bazı = min(Giydirilmiş Brüt, Dönem Tavanı)",
    lawReference: "1475 Sayılı Kanun md. 14",
  },
  {
    stepNumber: 4,
    title: "Brüt Kıdem ve Damga Vergisi Kesintisi",
    description:
      "Her tam yıl için bir aylık baz ücret ödenir; artık aylar ve günler oransal olarak eklenir. Yalnızca binde 7,59 damga vergisi kesilerek net kıdem tutarına ulaşılır.",
    formula: "Brüt Kıdem = (Yıl × Baz) + (Ay × Baz / 12) + (Gün × Baz / 365)",
    lawReference: "488 Sayılı Damga Vergisi Kanunu",
  },
  {
    stepNumber: 5,
    title: "İhbar Tazminatı (Hak Kazanıldıysa)",
    description:
      "İhbar öneli kullandırılmadıysa hizmet süresine göre (2, 4, 6 veya 8 hafta) günlük giydirilmiş brüt ücret üzerinden hesaplanır. Gelir vergisi ve damga vergisi kesilir.",
    formula: "Brüt İhbar = (Giydirilmiş Brüt / 30) × (Hafta × 7)",
    lawReference: "4857 Sayılı Kanun md. 17",
  },
];

export const SCENARIO_1_EXAMPLE: {
  title: string;
  parameters: ExampleRow[];
  results: ExampleRow[];
} = {
  title: "Örnek Hesaplama (PRD Senaryo 1: 4 Yıl Çalışma, Haksız Fesih)",
  parameters: [
    { label: "İşe Giriş Tarihi", value: "15.08.2022" },
    { label: "İşten Çıkış Tarihi", value: "14.08.2026" },
    { label: "Hesaplanan Hizmet Süresi", value: "4 yıl 0 ay 0 gün" },
    { label: "Fesih Nedeni", value: "İşveren tarafından haksız fesih" },
    { label: "İhbar Öneli", value: "Kullandırılmadı (İhbar tazminatı talep ediliyor)" },
    { label: "Aylık Çıplak Brüt Maaş", value: "50.000,00 TL" },
    { label: "Ek Menfaatler ve İkramiye", value: "0,00 TL" },
    { label: "Giydirilmiş Aylık Brüt", value: "50.000,00 TL" },
  ],
  results: [
    { label: "Kıdem Baz Ücreti", value: "50.000,00 TL", note: "Maaş tavanın altında kaldığından brüt ücret esas alınmıştır" },
    { label: "Brüt Kıdem Tazminatı", value: "200.000,00 TL", note: "4 yıl × 50.000,00 TL" },
    { label: "Kıdem Damga Vergisi (%0,759)", value: "1.518,00 TL" },
    { label: "Net Kıdem Tazminatı", value: "198.482,00 TL", note: "200.000,00 TL - 1.518,00 TL" },
    { label: "İhbar Süresi Kademesi", value: "8 hafta (56 gün)", note: "Hizmet süresi 3 yıldan fazla olduğu için" },
    { label: "Brüt İhbar Tazminatı", value: "93.333,33 TL", note: "(50.000,00 TL / 30) × 56 gün" },
    { label: "İhbar Gelir Vergisi (Tahmini %15)", value: "14.000,00 TL" },
    { label: "İhbar Damga Vergisi (%0,759)", value: "708,40 TL" },
    { label: "Tahmini Net İhbar Tazminatı", value: "78.624,93 TL" },
    { label: "Toplam Brüt Tazminat", value: "293.333,33 TL" },
    { label: "Toplam Tahmini Net Ele Geçen", value: "277.106,93 TL" },
  ],
};
