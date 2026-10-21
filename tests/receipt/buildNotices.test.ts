/**
 * buildNotices.test.ts
 * Uyarı ve bilgilendirme metinleri üreticisi birim testleri.
 * Dayanak: PRD ve prompt gereksinimleri.
 */

import { describe, it, expect } from "vitest";
import type { RatesConfig } from "@/lib/config/types";
import { calculateCompensation } from "@/lib/calculators/compensation";
import { buildNotices } from "@/lib/receipt/buildNotices";
import fixtureRaw from "../fixtures/rates.test.json";

const fixture = fixtureRaw as unknown as RatesConfig;

describe("buildNotices — Senaryo 2 (Tavan Uygulandı)", () => {
  const result = calculateCompensation(
    {
      reason: "retirement_military_marriage",
      startIso: "2024-10-01",
      exitIso: "2026-09-30",
      grossMonthly: 90000,
      extraMonthly: 5000,
      annualBonus: 60000,
    },
    fixture
  );

  const notices = buildNotices(result);

  it("S2'de CEILING_APPLIED uyarısı bulunmalı ve tavan tutarını içermeli", () => {
    const ceilingNotice = notices.find((n) => n.code === "CEILING_APPLIED");
    expect(ceilingNotice).toBeDefined();
    expect(ceilingNotice?.text).toBe(
      "Giydirilmiş brüt ücretiniz kıdem tazminatı tavanını aştığı için hesaplamada tavan tutar (73.729,87 TL) kullanıldı."
    );
  });

  it("emeklilik durumunda NO_NOTICE_REASON uyarısı bulunmalı", () => {
    const noNotice = notices.find((n) => n.code === "NO_NOTICE_REASON");
    expect(noNotice).toBeDefined();
    expect(noNotice?.text).toBe("Bu fesih nedeninde ihbar tazminatı hesaplanmaz.");
  });

  it("DISCLAIMER uyarısı dönmeli", () => {
    const disclaimer = notices.find((n) => n.code === "DISCLAIMER");
    expect(disclaimer).toBeDefined();
    expect(disclaimer?.text).toBe(
      "Bu araç bilgilendirme amaçlıdır, hukuki danışmanlık değildir. Sonuç, fesih nedeni ve ek koşullara göre değişebilir."
    );
  });
});

describe("buildNotices — İstifa (RESIGNATION)", () => {
  const result = calculateCompensation(
    {
      reason: "voluntary_resignation",
      startIso: "2022-08-15",
      exitIso: "2026-08-14",
      grossMonthly: 50000,
    },
    fixture
  );

  const notices = buildNotices(result);

  it("RESIGNATION uyarısı birebir metinle bulunmalı", () => {
    const resNotice = notices.find((n) => n.code === "RESIGNATION");
    expect(resNotice).toBeDefined();
    expect(resNotice?.text).toBe(
      "Haklı bir neden olmadan kendi isteğinizle ayrılma durumunda kıdem tazminatı doğmaz. İhbar süresine uymadan ayrılırsanız işverene ihbar tazminatı ödemeniz gerekebilir."
    );
  });

  it("DISCLAIMER uyarısı bulunmalı", () => {
    expect(notices.some((n) => n.code === "DISCLAIMER")).toBe(true);
  });
});

describe("buildNotices — İşverenin Haklı Feshi (EMPLOYER_JUST_CAUSE)", () => {
  const result = calculateCompensation(
    {
      reason: "employer_just_cause",
      startIso: "2022-08-15",
      exitIso: "2026-08-14",
      grossMonthly: 50000,
    },
    fixture
  );

  const notices = buildNotices(result);

  it("EMPLOYER_JUST_CAUSE uyarısı birebir metinle bulunmalı", () => {
    const causeNotice = notices.find((n) => n.code === "EMPLOYER_JUST_CAUSE");
    expect(causeNotice).toBeDefined();
    expect(causeNotice?.text).toBe(
      "İşverenin haklı nedenle derhal feshi (4857 md. 25/II) durumunda kıdem ve ihbar tazminatı doğmaz."
    );
  });
});

describe("buildNotices — İhbar Öneli Kullandırıldı (NOTICE_USED)", () => {
  const result = calculateCompensation(
    {
      reason: "employer_unfair",
      noticeUsed: "yes",
      startIso: "2022-08-15",
      exitIso: "2026-08-14",
      grossMonthly: 50000,
    },
    fixture
  );

  const notices = buildNotices(result);

  it("NOTICE_USED uyarısı bulunmalı", () => {
    const noticeUsed = notices.find((n) => n.code === "NOTICE_USED");
    expect(noticeUsed).toBeDefined();
    expect(noticeUsed?.text).toBe(
      "İhbar süresi kullandırıldığı için ihbar tazminatı 0 TL gösterilmiştir."
    );
  });
});

describe("buildNotices — 1 Yıldan Az Çalışma (LESS_THAN_ONE_YEAR)", () => {
  const result = calculateCompensation(
    {
      reason: "employer_unfair",
      noticeUsed: "no",
      startIso: "2025-08-01",
      exitIso: "2026-06-30",
      grossMonthly: 50000,
    },
    fixture
  );

  const notices = buildNotices(result);

  it("LESS_THAN_ONE_YEAR uyarısı bulunmalı", () => {
    const lessNotice = notices.find((n) => n.code === "LESS_THAN_ONE_YEAR");
    expect(lessNotice).toBeDefined();
    expect(lessNotice?.text).toBe(
      "Kıdem tazminatı için aynı işyerinde en az 1 tam yıl çalışmış olmak gerekir. Çalışma süreniz 1 yıldan az olduğu için kıdem tazminatı 0 TL gösterilmiştir."
    );
  });
});

describe("buildNotices — Diğer / Emin Değilim (UNSURE)", () => {
  const result = calculateCompensation(
    {
      reason: "other_unsure",
      startIso: "2022-08-15",
      exitIso: "2026-08-14",
      grossMonthly: 50000,
    },
    fixture
  );

  const notices = buildNotices(result);

  it("UNSURE uyarısı bulunmalı", () => {
    const unsureNotice = notices.find((n) => n.code === "UNSURE");
    expect(unsureNotice).toBeDefined();
    expect(unsureNotice?.text).toBe(
      "Seçtiğiniz durumda hesap yapılamıyor. Lütfen bir iş hukuku uzmanına danışın."
    );
  });

  it("DISCLAIMER uyarısı bulunmalı", () => {
    expect(notices.some((n) => n.code === "DISCLAIMER")).toBe(true);
  });
});

describe("buildNotices — Senaryo 1 (ESTIMATE uyarısı)", () => {
  const result = calculateCompensation(
    {
      reason: "employer_unfair",
      noticeUsed: "no",
      startIso: "2022-08-15",
      exitIso: "2026-08-14",
      grossMonthly: 50000,
    },
    fixture
  );

  const notices = buildNotices(result);

  it("ihbar hesaplandığı için ESTIMATE uyarısı bulunmalı", () => {
    const estNotice = notices.find((n) => n.code === "ESTIMATE");
    expect(estNotice).toBeDefined();
    expect(estNotice?.text).toBe(
      "Tahmini net tutar, seçtiğiniz gelir vergisi oranı ve damga vergisiyle hesaplanmıştır; gerçek vergi yıllık kümülatif matrahınıza göre değişir."
    );
  });
});
