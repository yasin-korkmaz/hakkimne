/**
 * belgeAnaliz.test.ts
 * İş Sözleşmesi Kural Tabanlı Risk Analiz Motoru Birim Testleri
 */

import { describe, it, expect } from "vitest";
import { belgeAnaliziYap } from "@/lib/belgeAnaliz";

function createMockFile(content: string, name = "sozlesme.txt"): File {
  return new File([content], name, { type: "text/plain" });
}

describe("belgeAnaliz — belgeAnaliziYap Motoru", () => {
  it("rekabet yasağı maddesi içeren metinde ilgili riski 'yuksek' seviye olarak tespit etmeli", async () => {
    const text = "İşbu sözleşmenin sona ermesinden sonra çalışan 3 yıl boyunca rekabet yasağı hükümlerine tabidir.";
    const file = createMockFile(text);
    const risks = await belgeAnaliziYap(file);

    expect(risks.some((r) => r.id === "rekabet_yasagi")).toBe(true);
    const risk = risks.find((r) => r.id === "rekabet_yasagi");
    expect(risk?.seviye).toBe("yuksek");
  });

  it("tek taraflı değişiklik yetkisi içeren metinde 'tek_tarafli_degisiklik' riskini bulmalı", async () => {
    const text = "İşveren dilediği zaman çalışanın görev yerini ve maaşını tek taraflı değiştirme hakkına sahiptir.";
    const file = createMockFile(text);
    const risks = await belgeAnaliziYap(file);

    expect(risks.some((r) => r.id === "tek_tarafli_degisiklik")).toBe(true);
  });

  it("6 aylık deneme süresi içeren metinde 'deneme_suresi_asimi' riskini bulmalı", async () => {
    const text = "Sözleşmede belirlenen deneme süresi altı ay olarak kararlaştırılmıştır.";
    const file = createMockFile(text);
    const risks = await belgeAnaliziYap(file);

    expect(risks.some((r) => r.id === "deneme_suresi_asimi")).toBe(true);
    const risk = risks.find((r) => r.id === "deneme_suresi_asimi");
    expect(risk?.seviye).toBe("yuksek");
  });

  it("fikri mülkiyet devri içeren metinde 'fikri_mulkiyet' riskini 'orta' seviye olarak bulmalı", async () => {
    const text = "Çalışanın mesai saatleri dışında ürettiği her türlü fikri mülk ve buluş münhasıran şirkete aittir.";
    const file = createMockFile(text);
    const risks = await belgeAnaliziYap(file);

    expect(risks.some((r) => r.id === "fikri_mulkiyet")).toBe(true);
    const risk = risks.find((r) => r.id === "fikri_mulkiyet");
    expect(risk?.seviye).toBe("orta");
  });

  it("hiçbir riskli ifade içermeyen standart sözleşmede boş liste dönmeli", async () => {
    const text = "Çalışan haftada 45 saat çalışacak olup yıllık ücretli izin hakkı 4857 sayılı kanuna tabidir.";
    const file = createMockFile(text);
    const risks = await belgeAnaliziYap(file);

    expect(risks).toEqual([]);
  });

  it("birden fazla riskli madde içeren sözleşmede tüm riskleri eksiksiz tespit etmeli", async () => {
    const text = `
      1. Sözleşmede deneme süresi 6 ay olacaktır.
      2. İşten ayrıldıktan sonra rekabet yasağı geçerlidir.
      3. Şirket görev tanımını tek taraflı değiştirme hakkına sahiptir.
    `;
    const file = createMockFile(text);
    const risks = await belgeAnaliziYap(file);

    expect(risks.length).toBe(3);
    const ids = risks.map((r) => r.id);
    expect(ids).toContain("deneme_suresi_asimi");
    expect(ids).toContain("rekabet_yasagi");
    expect(ids).toContain("tek_tarafli_degisiklik");
  });
});
