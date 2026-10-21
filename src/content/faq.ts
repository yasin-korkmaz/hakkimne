/* TASLAK — hukuk/İK kontrolü gerekli */

/**
 * faq.ts — Sıkça Sorulan Sorular Verisi
 * Dayanak: 1475 Sayılı Kanun md. 14, 4857 Sayılı Kanun md. 17, 24, 25/II
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "kidem-nedir-kimler-alir",
    question: "Kıdem tazminatı nedir, kimler alır?",
    answer:
      "1475 sayılı Kanun md. 14 uyarınca, aynı işverene bağlı en az 1 tam yıl çalışan işçilere belirli fesih durumlarında ödenen toplu paradır. İşverenin haksız feshi, işçinin 4857 sayılı Kanun md. 24 kapsamındaki haklı feshi, emeklilik, askerlik veya kadın işçinin evliliği nedeniyle ayrılması hallerinde hak kazanılır. İstifa veya md. 25/II kapsamındaki ahlak ve iyi niyet kurallarına aykırılık hallerinde kıdem tazminatı ödenmez.",
  },
  {
    id: "ihbar-nedir",
    question: "İhbar tazminatı nedir?",
    answer:
      "4857 sayılı Kanun md. 17 uyarınca, belirsiz süreli iş sözleşmesini fesheden tarafın diğer tarafa çalışma süresine göre belirlenen bildirim (ihbar) süresini tanıması zorunludur. İşveren bu süreyi kullandırmadan işçiyi derhal işten çıkarırsa, bildirim süresine ait ücret tutarında ihbar tazminatı ödemekle yükümlüdür.",
  },
  {
    id: "kidem-nasil-hesaplanir",
    question: "Kıdem tazminatı nasıl hesaplanır?",
    answer:
      "Çalışılan her tam yıl için 30 günlük giydirilmiş brüt ücret (veya kıdem tavanı) esas alınır. Artan aylar için (Ay × Baz / 12) ve artan günler için (Gün × Baz / 365) oranında ekleme yapılır. Elde edilen brüt kıdem tazminatı tutarından yalnızca binde 7,59 oranında damga vergisi kesilir; gelir vergisi kesintisi yapılmaz.",
  },
  {
    id: "kidem-tavani-nedir",
    question: "Kıdem tavanı nedir, neden her dönem değişir?",
    answer:
      "1475 sayılı Kanun md. 14 gereğince, bir yıl için ödenecek kıdem tazminatı tutarı kanunda belirlenen azami devlet memuru maaş katsayısına bağlı tavanı aşamaz. Bu tavan Hazine ve Maliye Bakanlığı genelgeleriyle yılda iki kez güncellenir; güncel tavan sayfadaki rozetten okunur. Giydirilmiş brüt ücretiniz tavanı aşıyorsa hesaplamada tavan tutarı baz alınır.",
  },
  {
    id: "giydirilmis-brut-ucret-nedir",
    question: "Giydirilmiş brüt ücret nedir?",
    answer:
      "İşçinin bordrodaki çıplak aylık brüt maaşına ek olarak; işyerinde düzenli olarak sağlanan nakdi ve ayni menfaatlerin (yol, yemek, yakacak yardımı gibi) aylık tutarı ile son bir yılda ödenen brüt ikramiye/prim toplamının 12'ye bölünmesiyle elde edilen payın eklenmesiyle oluşan toplam brüt ücrettir.",
  },
  {
    id: "damga-vergisi-kesintisi",
    question: "Damga vergisi kıdem tazminatından nasıl kesilir?",
    answer:
      "Kıdem tazminatı 193 sayılı Gelir Vergisi Kanunu kapsamında gelir vergisinden tamamen muaftır. Yalnızca 488 sayılı Damga Vergisi Kanunu uyarınca brüt tutar üzerinden binde 7,59 (%0,759) oranında damga vergisi kesintisi uygulanır ve kalan tutar çalışana net olarak ödenir.",
  },
  {
    id: "istifa-edersem-kidem-alir-miyim",
    question: "İstifa edersem kıdem tazminatı alır mıyım?",
    answer:
      "1475 sayılı Kanun md. 14 gereğince, haklı bir gerekçe olmaksızın kendi isteğiyle istifa eden işçi kıdem tazminatına hak kazanamaz. Ancak işçi, iş sözleşmesini 4857 sayılı Kanun md. 24'te yer alan sağlık nedenleri, işverenin ahlak ve iyi niyet kurallarına aykırı davranışları veya zorlayıcı nedenlerle haklı feshederse en az 1 yıllık kıdemi bulunması şartıyla kıdem tazminatı alabilir.",
  },
  {
    id: "ihbar-sureleri-nasil-belirlenir",
    question: "İhbar süreleri nasıl belirlenir?",
    answer:
      "4857 sayılı Kanun md. 17 uyarınca bildirim süreleri kıdeme göre kademelendirilir: 6 aydan az çalışanlar için 2 hafta; tam 6 aydan 1,5 yıla kadar 4 hafta; 1,5 yıldan 3 yıla kadar 6 hafta; 3 yıldan fazla çalışanlar için 8 haftadır. Çalışma süreniz tam 1,5 yıl (18 ay) ise mevzuattaki sınır ayrımı gereği bir iş hukuku uzmanına danışmanız önerilir.",
  },
  {
    id: "cikis-gunu-hesaba-dahil-mi",
    question: "Çıkış günü hesaba dahil mi?",
    answer:
      "Evet, bu hesaplama aracında çalışanın işten çıkış tarihi çalışılmış kabul edilerek süreye tam gün olarak dahil edilir. Bu yaklaşım iş hukuku uygulamasında ve yerleşik kabulde işçi lehine uygulanan standart yöntemdir.",
  },
  {
    id: "arac-guvenilirligi",
    question: "Bu araç ne kadar güvenilir, sonuç kesin mi?",
    answer:
      "Bu araç yürürlükteki kanun maddelerine ve resmî parametrelere göre bilgilendirme amaçlı hesaplama yapar, hukuki danışmanlık yerine geçmez. Nihai tazminat tutarı somut fesih gerekçelerine, bordro kalemlerinin niteliğine ve iş sözleşmesi koşullarına göre değişebilir.",
  },
];
