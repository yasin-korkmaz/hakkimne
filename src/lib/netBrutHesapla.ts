/**
 * netBrutHesapla.ts — 2026 Türkiye Net-Brüt Maaş Hesaplama Motoru
 * Dayanak: 193 Sayılı GVK Md. 103, 5510 Sayılı Kanun Md. 80, 4447 Sayılı Kanun Md. 49, 488 Sayılı Kanun.
 * Algoritma: SGK (%14), İşsizlik (%1), GVK 103 artan oranlı dilimler, Damga vergisi (%0.759).
 * Netten brüte dönüşümde 60 iterasyonlu ikili arama (Binary Search) kullanılır.
 */

import { roundToKurus } from "@/lib/utils/money";

export type HesaplamaYonu = "brut_to_net" | "net_to_brut";

export interface VergiDilimi {
  tavan: number;
  oran: number;
  etiket: string;
}

/** 2026 Yılı Gelir Vergisi Dilimleri (193 Sayılı GVK Md. 103) */
export const VERGI_DILIMLERI_2026: VergiDilimi[] = [
  { tavan: 158000, oran: 0.15, etiket: "%15" },
  { tavan: 330000, oran: 0.20, etiket: "%20" },
  { tavan: 1200000, oran: 0.27, etiket: "%27" },
  { tavan: 4300000, oran: 0.35, etiket: "%35" },
  { tavan: Infinity, oran: 0.40, etiket: "%40" },
];

export const SGK_ISCI_ORANI = 0.14;         // %14
export const ISSIZLIK_ISCI_ORANI = 0.01;    // %1
export const DAMGA_VERGISI_ORANI = 0.00759; // %0.759 (Binde 7.59)

export interface NetBrutSonuc {
  hesaplamaYonu: HesaplamaYonu;
  brutUcret: number;
  netUcret: number;
  sgkIsci: number;
  issizlikIsci: number;
  toplamSgk: number;
  gelirVergisiMatrahi: number;
  gelirVergisi: number;
  damgaVergisi: number;
  toplamKesinti: number;
  efektifVergiOrani: number;
  vergiDilimi: string;
}

function vergiToplamiHesapla(toplamMatrah: number): number {
  if (toplamMatrah <= 0) return 0;
  let vergi = 0;
  let oncekiTavan = 0;

  for (const dilim of VERGI_DILIMLERI_2026) {
    if (toplamMatrah > dilim.tavan) {
      vergi += (dilim.tavan - oncekiTavan) * dilim.oran;
      oncekiTavan = dilim.tavan;
    } else {
      vergi += (toplamMatrah - oncekiTavan) * dilim.oran;
      break;
    }
  }
  return vergi;
}

export function gelirVergisiHesapla(
  matrah: number,
  kumulatifMatrah = 0
): { vergi: number; dilimEtiketi: string } {
  if (matrah <= 0) return { vergi: 0, dilimEtiketi: "%15" };

  const bitisVergisi = vergiToplamiHesapla(kumulatifMatrah + matrah);
  const baslangicVergisi = vergiToplamiHesapla(kumulatifMatrah);
  const vergi = bitisVergisi - baslangicVergisi;

  const sonNokta = kumulatifMatrah + matrah;
  let dilimEtiketi = "%15";
  for (const d of VERGI_DILIMLERI_2026) {
    if (sonNokta <= d.tavan) {
      dilimEtiketi = d.etiket;
      break;
    }
  }
  return { vergi, dilimEtiketi };
}

export function bruttenNete(
  brutUcret: number,
  kumulatifMatrah = 0,
  yon: HesaplamaYonu = "brut_to_net"
): NetBrutSonuc {
  if (brutUcret <= 0 || isNaN(brutUcret)) {
    return {
      hesaplamaYonu: yon,
      brutUcret: 0,
      netUcret: 0,
      sgkIsci: 0,
      issizlikIsci: 0,
      toplamSgk: 0,
      gelirVergisiMatrahi: 0,
      gelirVergisi: 0,
      damgaVergisi: 0,
      toplamKesinti: 0,
      efektifVergiOrani: 0,
      vergiDilimi: "%15",
    };
  }

  const sgkIsci = brutUcret * SGK_ISCI_ORANI;
  const issizlikIsci = brutUcret * ISSIZLIK_ISCI_ORANI;
  const toplamSgk = sgkIsci + issizlikIsci;
  const gelirVergisiMatrahi = brutUcret - toplamSgk;

  const { vergi: gelirVergisi, dilimEtiketi } = gelirVergisiHesapla(
    gelirVergisiMatrahi,
    kumulatifMatrah
  );
  const damgaVergisi = brutUcret * DAMGA_VERGISI_ORANI;
  const toplamKesinti = toplamSgk + gelirVergisi + damgaVergisi;
  const netUcret = brutUcret - toplamKesinti;
  const efektifVergiOrani = (toplamKesinti / brutUcret) * 100;

  return {
    hesaplamaYonu: yon,
    brutUcret: roundToKurus(brutUcret),
    netUcret: roundToKurus(netUcret),
    sgkIsci: roundToKurus(sgkIsci),
    issizlikIsci: roundToKurus(issizlikIsci),
    toplamSgk: roundToKurus(toplamSgk),
    gelirVergisiMatrahi: roundToKurus(gelirVergisiMatrahi),
    gelirVergisi: roundToKurus(gelirVergisi),
    damgaVergisi: roundToKurus(damgaVergisi),
    toplamKesinti: roundToKurus(toplamKesinti),
    efektifVergiOrani: roundToKurus(efektifVergiOrani),
    vergiDilimi: dilimEtiketi,
  };
}

export function nettenBrute(hedefNet: number, kumulatifMatrah = 0): NetBrutSonuc {
  if (hedefNet <= 0 || isNaN(hedefNet)) {
    return bruttenNete(0, kumulatifMatrah, "net_to_brut");
  }

  let altSinir = hedefNet;
  let ustSinir = hedefNet * 3;

  for (let i = 0; i < 60; i++) {
    const orta = (altSinir + ustSinir) / 2;
    const sgk = orta * (SGK_ISCI_ORANI + ISSIZLIK_ISCI_ORANI);
    const matrah = orta - sgk;
    const { vergi } = gelirVergisiHesapla(matrah, kumulatifMatrah);
    const damga = orta * DAMGA_VERGISI_ORANI;
    const net = orta - (sgk + vergi + damga);

    if (net < hedefNet) altSinir = orta;
    else ustSinir = orta;
  }

  const kesinBrut = roundToKurus((altSinir + ustSinir) / 2);
  return bruttenNete(kesinBrut, kumulatifMatrah, "net_to_brut");
}

export function netBrutHesapla(
  tutar: number,
  tur: HesaplamaYonu = "brut_to_net",
  kumulatifMatrah = 0
): NetBrutSonuc {
  return tur === "brut_to_net"
    ? bruttenNete(tutar, kumulatifMatrah, "brut_to_net")
    : nettenBrute(tutar, kumulatifMatrah);
}
