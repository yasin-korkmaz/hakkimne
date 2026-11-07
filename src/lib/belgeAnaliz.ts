/**
 * belgeAnaliz.ts — İş Sözleşmesi Tarayıcı İçi Risk Analiz Motoru
 *
 * Dayanak Kanunlar:
 *  - 4857 Sayılı İş Kanunu Madde 15 (Deneme Süresi Sınırı)
 *  - 4857 Sayılı İş Kanunu Madde 22 (Çalışma Koşullarında Esaslı Değişiklik)
 *  - 6098 Sayılı Türk Borçlar Kanunu Madde 444-447 (Rekabet Yasağı Sınırları)
 *  - 5846 Sayılı FSEK & 6769 Sayılı SMK (Fikri Mülkiyet Hakları)
 *
 * Algoritma:
 *  1. Yüklenen File nesnesini alır (PDF ise pdfjs-dist ile, metin ise file.text ile çıkarır).
 *  2. Kanuna aykırı veya işçi aleyhine orantısız 4 kritik kalıbı regex ile tarar.
 *  3. Bulunan riskleri id, başlık, açıklama ve seviye ile liste olarak döner.
 *  4. Kişisel veri sunucuya gitmez; tüm işlem istemci RAM belleğinde gerçekleşir.
 */

export type RiskSeviyesi = "yuksek" | "orta";

export interface BelgeRiski {
  id: string;
  baslik: string;
  aciklama: string;
  seviye: RiskSeviyesi;
}

interface KuralTanimi {
  id: string;
  regex: RegExp;
  baslik: string;
  aciklama: string;
  seviye: RiskSeviyesi;
}

const RISK_KURALLARI: KuralTanimi[] = [
  {
    id: "rekabet_yasagi",
    regex: /rekabet yasağ[ıi]/i,
    baslik: "Rekabet Yasağı Maddesi Tespit Edildi",
    aciklama:
      "6098 sayılı TBK md. 444-447 uyarınca yer, zaman (maks. 2 yıl) ve konu bakımından sınırlandırılmamış rekabet yasakları geçersizdir. İşçinin ekonomik geleceğini tehlikeye düşüren orantısız cezai şartlar mahkemelerce iptal edilir.",
    seviye: "yuksek",
  },
  {
    id: "tek_tarafli_degisiklik",
    regex: /tek tarafl[ıi] değiştir/i,
    baslik: "Tek Taraflı Çalışma Koşulu Değişikliği",
    aciklama:
      "4857 sayılı İş Kanunu md. 22 uyarınca işveren ücret, görev tanımı veya çalışma yerini tek taraflı olarak işçi aleyhine değiştiremez. Sözleşmedeki bu yöndeki feragat hükümleri geçersizdir; işçinin 6 iş günü içinde yazılı onayı şarttır.",
    seviye: "yuksek",
  },
  {
    id: "deneme_suresi_asimi",
    regex: /deneme süresi.{0,30}(altı|6) ay/i,
    baslik: "Yasal Sınırı Aşan Deneme Süresi (6 Ay)",
    aciklama:
      "4857 sayılı İş Kanunu md. 15 emredici hükmüne göre bireysel iş sözleşmelerinde deneme süresi en fazla 2 ay olabilir. Sözleşmeye 6 ay yazılmış olsa dahi 2 aydan sonra yapılan fesihlerde ihbar ve kıdem tazminatı hakkı doğar.",
    seviye: "yuksek",
  },
  {
    id: "fikri_mulkiyet",
    regex: /fikr[iı] mülk/i,
    baslik: "Geniş Kapsamlı Fikri Mülkiyet Devri",
    aciklama:
      "5846 sayılı FSEK ve 6769 sayılı SMK uyarınca işçinin mesai saatleri dışında ve şirket imkanlarını kullanmadan ürettiği bağımsız projelerin peşinen devredilmesi hakkın kötüye kullanımı teşkil edebilir.",
    seviye: "orta",
  },
];

/**
 * Dosyadan saf metin içeriğini asenkron olarak çıkarır.
 */
export async function dosyaMetniniCikar(file: File): Promise<string> {
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return await file.text();
  }

  try {
    const pdfjsLib = await import("pdfjs-dist");
    if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
    });
    const pdf = await loadingTask.promise;
    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageStr = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");
      text += pageStr + " ";
    }

    return text;
  } catch (err) {
    console.warn("PDF metin çıkarma hatası, ham metne dönülüyor:", err);
    return await file.text();
  }
}

/**
 * belgeAnaliziYap — Yüklenen iş sözleşmesi dosyasını analiz eder ve riskleri listeler.
 */
export async function belgeAnaliziYap(file: File): Promise<BelgeRiski[]> {
  if (!file) return [];

  const text = await dosyaMetniniCikar(file);
  if (!text || text.trim().length === 0) return [];

  const tespitEdilenler: BelgeRiski[] = [];

  for (const kural of RISK_KURALLARI) {
    if (kural.regex.test(text)) {
      tespitEdilenler.push({
        id: kural.id,
        baslik: kural.baslik,
        aciklama: kural.aciklama,
        seviye: kural.seviye,
      });
    }
  }

  return tespitEdilenler;
}
