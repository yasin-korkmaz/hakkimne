# HakkımNe? — Kıdem ve İhbar Tazminatı Hesaplama Platformu

**HakkımNe?**, Türk İş Hukuku (1475 sayılı Kanun md. 14 ve 4857 sayılı Kanun md. 17) mevzuatına uygun olarak işçilerin kıdem ve ihbar tazminatını adım adım, şeffaf ve güvenilir bir hesaplama fişiyle sunan açık kaynaklı bir web platformudur.

Tüm hesaplamalar kullanıcının tarayıcısında istemci taraflı gerçekleşir; kişisel veriler, maaş bilgileri veya tarihler hiçbir sunucuya aktarılmaz veya saklanmaz.

---

## Temel Özellikler

- **Şeffaf Adım Adım Hesaplama Fişi:** Brüt kıdem, tavan sınırı, damga vergisi, ihbar öneli haftası ve net tutarlar kalem kalem gösterilir.
- **Doğrulama Kilidi (Verification Lock):** `src/config/rates.json` dosyasında doğrulanmamış (`verified: false`) oran veya tanımlı olmayan dönem varsa motor varsayım üretmez, kullanıcıyı uyararak durur.
- **Sıfır Veri Toplama ve Tam Gizlilik:** Çerez, üyelik, veritabanı veya analitik takip mekanizması yoktur.
- **Erişilebilir ve Mobil Öncelikli:** WCAG AA kontrast standartları, ekran okuyucu etiketleri (ARIA), klavye gezintisi ve odak halkalarıyla tam erişilebilirlik.

---

## Kurulum ve Komutlar

Projeyi yerel ortamda çalıştırmak için Node.js (v20 veya v22 önerilir) gereklidir:

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (http://localhost:3000)
npm run dev

# Testleri çalıştır (Vitest)
npm test

# Statik kod analizi (ESLint)
npm run lint

# Statik çıktı derlemesi (out/ dizini)
npm run build

# Oran ve genelge doğrulama denetimi
npm run check:rates

# Doğrulamalı yayın derlemesi
npm run build:release
```

---

## Proje Klasör Yapısı

```text
├── src/
│   ├── app/            # Next.js App Router (sayfalar, sitemap, robots)
│   ├── calculators/    # Saf hesaplama motoru (kıdem, ihbar, birleşik)
│   ├── components/     # UI bileşenleri (Form, Fiş Tablosu, Uyarılar, Bilgi)
│   ├── config/         # Site ayarları ve yasal oranlar (rates.json)
│   ├── receipt/        # Hesaplama fişi ve uyarı kuralları motoru
│   ├── types/          # TypeScript veri modelleri ve tip tanımları
│   └── utils/          # Takvim süresi, para formatlama ve doğrulama araçları
├── scripts/            # check-rates.mjs (yayın öncesi oran doğrulama betiği)
├── tests/              # 22 test dosyası, 247 Vitest birim ve entegrasyon testi
│   └── fixtures/       # rates.test.json (testler için izole doğrulanmış oranlar)
└── public/             # Statik varlıklar ve _headers (Cloudflare güvenlik başlıkları)
```

---

## Test Stratejisi ve Doğrulama Kilidi

- Projede **22 test dosyasında 247 test** bulunmaktadır.
- **Fixture İzolasyonu:** Canlı oranlar (`rates.json`) henüz resmi genelgeyle kilitli (`verified: false`) iken hesaplama mantığının ve PRD senaryolarının test edilebilmesi için testler `tests/fixtures/rates.test.json` üzerinden izole edilmiştir.
- **Doğrulama Kilidi:** Canlıda `verified: false` olan hiçbir tavan veya oran hesaplamaya dahil edilmez; motor doğrudan `status: 'blocked'` döner ve eksik dönemi bildirir.

---

## Kapsam Dışı (Faz 1 MVP)

HakkımNe? Faz 1 kapsamında şu özellikler bilinçli olarak yer almaz:
- Kullanıcı kaydı, giriş ve üyelik sistemleri
- Veritabanı ve sunucu taraflı oturum yönetimi
- PDF çıktısı veya sunucu taraflı belge üretimi
- Reklam, ödeme veya bağış sistemleri

---

## Yasal Çekince

HakkımNe? üzerinde sunulan hesaplama sonuçları yalnızca genel bilgilendirme amaçlıdır; hukuki tavsiye, avukatlık hizmeti veya resmi bağlayıcılığı olan bilirkişi raporu niteliği taşımaz. Uyuşmazlıklarda bir avukata veya uzman iş hukuku danışmanına başvurulmalıdır.

---

## Lisans

MIT [DOĞRULANACAK: Resmi açık kaynak lisansı teyit edilecek].
