import type { DocumentType, DocumentFinding } from "./types";

/**
 * rules.ts — Belge Türlerine Göre Hukuki Kontrol Listeleri ve İnceleme Kuralları
 * Dayanak: 4857 Sayılı İş Kanunu, 6098 Sayılı TBK ve Yerleşik Yargıtay İçtihatları
 */

export const DOCUMENT_NAMES: Record<DocumentType, string> = {
  pay_slip: "Maaş Bordrosu (Ücret Hesap Pusulası)",
  employment_contract: "İş Sözleşmesi (Hizmet Akdi)",
  termination_notice: "Fesih Bildirimi (İşten Çıkarma / İstifa)",
  leave_form: "Yıllık İzin Belgesi ve Talep Formu",
};

export const DOCUMENT_RULES: Record<DocumentType, DocumentFinding[]> = {
  pay_slip: [
    {
      id: "ps_1",
      category: "info",
      title: "Ücret Hesap Pusulası Yasal Zorunluluğu",
      description: "İşveren, işçiye her ay ödediği ücretin dökümünü gösteren imzalı veya elektronik onaylı hesap pusulası vermek zorundadır.",
      legalBase: "4857 SK md. 37",
      recommendation: "Bordronuzdaki temel brüt maaş ve yan hakların iş sözleşmenizdeki tutarlarla birebir örtüştüğünü teyit edin.",
    },
    {
      id: "ps_2",
      category: "warning",
      title: "Fazla Mesai Tahakkuk Kontrolü",
      description: "Haftalık 45 saati aşan fiili çalışmalarınız bordroda 'Fazla Çalışma' satırında %50 zamlı saat ücretiyle gösterilmelidir.",
      legalBase: "4857 SK md. 41",
      recommendation: "Mesai yaptığınız halde bordronuzda mesai saati '0' görünüyorsa imza atmadan önce ihtirazi kayıt koymayı değerlendirin.",
      relatedTool: { label: "Fazla Mesai Hesaplayıcı", href: "/fazla-mesai-hesaplama" },
    },
    {
      id: "ps_3",
      category: "danger",
      title: "İhtirazi Kayıtsız İmza Riski",
      description: "Yargıtay içtihatlarına göre, ihtirazi kayıt (çekince) konulmadan imzalanan bordronun aksini iddia etmek ancak yazılı belgeyle mümkündür.",
      legalBase: "Yargıtay HGK Kararları",
      recommendation: "Eksik mesai veya ücret ödemesi varsa bordroya 'Fazla mesai haklarım saklıdır' şerhi düşülmelidir.",
    },
    {
      id: "ps_4",
      category: "legal_consultation",
      title: "Banka / Elden Ödeme Ayrımı",
      description: "Maaşın asgari kısmının bankaya, kalanının elden ödenmesi hem vergi kaybı hem de kıdem tazminatı matrahının düşmesi riskini doğurur.",
      legalBase: "4857 SK md. 32 & 5510 SK",
      recommendation: "Gerçek maaşınız bordroda eksik görünüyorsa hak kaybınızı belirlemek için tazminat matrahınızı kontrol edin.",
      relatedTool: { label: "Kıdem Tazminatı Hesaplayıcı", href: "/kidem-tazminati-hesaplama" },
    },
  ],

  employment_contract: [
    {
      id: "ec_1",
      category: "info",
      title: "Belirsiz Süreli Sözleşme Karinesi",
      description: "İş sözleşmelerinde esas olan belirsiz süreli olmasıdır. Belirli bir iş veya süreye bağlı objektif neden yoksa sözleşme belirsiz süreli sayılır.",
      legalBase: "4857 SK md. 11",
      recommendation: "Belirli süreli gösterilen sözleşmelerde kıdem ve ihbar tazminatı hakkınızın korunup korunmadığını kontrol edin.",
      relatedTool: { label: "Kıdem Tazminatı Şartları", href: "/kidem-tazminati-hesaplama" },
    },
    {
      id: "ec_2",
      category: "warning",
      title: "'Fazla Mesai Ücrete Dahildir' Klozu Sınırı",
      description: "Sözleşmede mesainin ücrete dahil olduğu yazsa bile, yıllık azami 270 saati aşan mesailer her durumda ayrıca ödenmek zorundadır.",
      legalBase: "4857 SK md. 41 & Yargıtay 9. HD",
      recommendation: "Maaşınız asgari ücret seviyesindeyse bu madde tamamen geçersiz sayılır; tüm mesaileriniz talep edilebilir.",
      relatedTool: { label: "Fazla Mesai Hesaplayıcı", href: "/fazla-mesai-hesaplama" },
    },
    {
      id: "ec_3",
      category: "danger",
      title: "Tek Taraflı Cezai Şart Hükümsüzlüğü",
      description: "Sözleşmede sadece işçinin işten ayrılması durumuna bağlanan ve işveren için karşılığı bulunmayan cezai şartlar kanunen kesin hükümsüzdür.",
      legalBase: "6098 SK (TBK) md. 420",
      recommendation: "İstifa halinde tazminat ödeme baskısı yaratan tek taraflı şartlar yargı önünde geçersiz kabul edilmektedir.",
    },
    {
      id: "ec_4",
      category: "missing",
      title: "Deneme Süresi Azami Sınırı",
      description: "Bireysel iş sözleşmelerinde deneme süresi kanunen en çok 2 aydır. Bu süreyi aşan deneme süreleri geçersizdir.",
      legalBase: "4857 SK md. 15",
      recommendation: "2 ayı geçen çalışmalarda işten çıkarılma halinde ihbar öneli ve fesih güvencesi hükümleri devreye girer.",
      relatedTool: { label: "İhbar Süresi Hesaplayıcı", href: "/ihbar-suresi-hesaplama" },
    },
    {
      id: "ec_5",
      category: "legal_consultation",
      title: "Rekabet Yasağı ve Coğrafi Sınırlar",
      description: "İşçinin ekonomik geleceğini tehlikeye düşüren, süre (en çok 2 yıl), yer ve konu bakımından sınırlandırılmamış rekabet yasakları hükümsüzdür.",
      legalBase: "6098 SK (TBK) md. 444-447",
      recommendation: "Ağır tazminat içeren rekabet klozlarında işten ayrılmadan önce uzman bir avukata danışılması önerilir.",
    },
  ],

  termination_notice: [
    {
      id: "tn_1",
      category: "danger",
      title: "Yazılı Bildirim ve Açık Sebep Zorunluluğu",
      description: "İşveren fesih bildirimini yazılı yapmak ve fesih sebebini açık, kesin ve tereddüde yer bırakmayacak biçimde belirtmek zorundadır.",
      legalBase: "4857 SK md. 19/1",
      recommendation: "Sözlü veya belirsiz gerekçeyle yapılan fesihler usulen geçersizdir; işe iade davası açma hakkı doğurur.",
    },
    {
      id: "tn_2",
      category: "warning",
      title: "Savunma Alınması Şartı",
      description: "İşçinin davranışı veya verimi gerekçe gösteriliyorsa, fesihten önce işçiden yazılı savunma alınması yasal bir zorunluluktur.",
      legalBase: "4857 SK md. 19/2",
      recommendation: "Savunmanız alınmadan gerçekleştirilen performans fesihleri mahkemelerce doğrudan geçersiz kabul edilmektedir.",
    },
    {
      id: "tn_3",
      category: "info",
      title: "İhbar Süresi veya Peşin Ödeme",
      description: "Kıdeminize göre 2 ila 8 hafta arasında ihbar öneli tanınmalı veya bu sürenin brüt ücreti peşin ödenerek çıkış verilmelidir.",
      legalBase: "4857 SK md. 17",
      recommendation: "Son çalışma gününüzün takvime uygunluğunu ve ihbar tazminatınızı hesaplayın.",
      relatedTool: { label: "İhbar Süresi ve Bitiş Tarihi", href: "/ihbar-suresi-hesaplama" },
    },
    {
      id: "tn_4",
      category: "legal_consultation",
      title: "1 Aylık Arabuluculuk Hak Düşürücü Süresi",
      description: "İş güvencesi (işe iade) talepleri için fesih bildiriminin tebliğ edildiği tarihten itibaren 1 ay içinde arabulucuya başvurulmalıdır.",
      legalBase: "7036 SK md. 3 & 4857 SK md. 20",
      recommendation: "1 aylık sürenin kaçırılması hak kaybına yol açacağından vakit kaybetmeksizin hukuki destek almanız tavsiye edilir.",
    },
    {
      id: "tn_5",
      category: "info",
      title: "Kıdem Tazminatı Tahakkuku",
      description: "İşyerinde en az 1 yıl çalışmışsanız ve ahlak kurallarına aykırılık (md. 25/II) yoksa kıdem tazminatına hak kazanırsınız.",
      legalBase: "1475 SK md. 14",
      recommendation: "Yasal tavan ve hizmet sürenize göre hak ettiğiniz net kıdem tutarını hesaplayın.",
      relatedTool: { label: "Kıdem Tazminatı Hesaplayıcı", href: "/kidem-tazminati-hesaplama" },
    },
  ],

  leave_form: [
    {
      id: "lf_1",
      category: "info",
      title: "Kanuni Asgari İzin Süreleri",
      description: "1-5 yıl arası: en az 14 gün; 5-15 yıl arası: en az 20 gün; 15 yıl ve üzeri: en az 26 gündür.",
      legalBase: "4857 SK md. 53",
      recommendation: "Hizmet sürenize göre hak ettiğiniz yasal izin gün sayısını doğrulamak için hesaplayıcıyı kullanın.",
      relatedTool: { label: "Yıllık İzin Hesaplayıcı", href: "/yillik-izin-ucreti-hesaplama" },
    },
    {
      id: "lf_2",
      category: "warning",
      title: "18 Yaş Altı ve 50 Yaş Üstü Koruma",
      description: "18 ve daha küçük yaştaki işçilerle 50 ve daha yukarı yaştaki işçilere verilecek yıllık izin 20 günden az olamaz.",
      legalBase: "4857 SK md. 53/5",
      recommendation: "Yaş kriterini sağlıyorsanız 1. hizmet yılınızda dahi doğrudan 20 gün talep etme hakkınız mevcuttur.",
    },
    {
      id: "lf_3",
      category: "missing",
      title: "İznin Bölünme Şartı (10 Gün Kuralı)",
      description: "Yıllık izin tarafların anlaşmasıyla bölünebilir ancak bölümlerden birinin aralıksız en az 10 gün olması şarttır.",
      legalBase: "4857 SK md. 56",
      recommendation: "İzin formunda onaylanan günlerin 10 günlük dinlenme şartını karşıladığından emin olun.",
    },
    {
      id: "lf_4",
      category: "legal_consultation",
      title: "Kullanılmayan İznin Ücrete Dönüşmesi",
      description: "İş sözleşmesi devam ederken yıllık izin ücrete dönüştürülemez. Yalnızca fesih halinde son brüt ücret üzerinden nakden ödenir.",
      legalBase: "4857 SK md. 59",
      recommendation: "İşten ayrılma aşamasındaysanız kalan tüm izin alacağınızı net/brüt olarak hesaplayın.",
      relatedTool: { label: "Kalan İzin Ücreti Hesabı", href: "/yillik-izin-ucreti-hesaplama" },
    },
  ],
};
