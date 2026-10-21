# HakkımNe? Dağıtım Rehberi (DEPLOY.md)

Bu doküman, **HakkımNe?** uygulamasının derleme, Cloudflare Pages üzerinde statik dağıtım, güvenlik başlıkları denetimi ve altı aylık güncelleme süreçlerini açıklar.

---

## 1. Derleme ve Statik Çıktı

- **Komut:** `npm run build:release`
  - Bu komut sırasıyla iki aşamadan oluşur:
    1. `npm run check:rates`: `scripts/check-rates.mjs` betiği ile `src/config/rates.json` dosyasındaki tüm oranların, kaynak bağlantıların ve aktif kıdem tavanının doğrulanmış (`verified: true`) olduğunu teyit eder. Doğrulanmamış veya tarihi geçmiş bir veri varsa derleme başlamadan kesilir.
    2. `next build`: `next.config.ts` içindeki `output: 'export'` direktifine göre tüm rotaları statik HTML/JS/CSS olarak derler.
- **Yayın Dizini:** Derleme sonucunda projenin kök dizininde oluşan `out/` klasörü Cloudflare Pages için yayın dizinidir (Build Output Directory).

---

## 2. Cloudflare Pages Dağıtımı (Adım Adım)

### Adımlar:
1. **Cloudflare Paneli:** Cloudflare Dashboard > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. **Depo Seçimi:** GitHub hesabınızı yetkilendirip `hakkimne` deposunu seçin.
3. **Yapılandırma Ayarları (Build settings):**
   - **Framework preset:** `None` veya `Next.js Static`
   - **Build command:** `npm run build:release` *(Not: Oranlar henüz resmi olarak doğrulanmadıysa `npm run build` kullanılır [DOĞRULANACAK])*
   - **Build output directory:** `out`
   - **Root directory:** `/` (boş bırakın)
4. **Ortam Değişkenleri (Environment variables):**
   - Değişken adı: `NODE_VERSION`
   - Değer: `20` veya `22` (Next.js 15+ LTS gereksinimidir).
5. **Save and Deploy:** İlk dağıtımı başlatın.

### Neden Cloudflare Pages? (Workers + Static Assets Kıyaslaması)
- **Pages Tercih Gerekçesi:** HakkımNe? tüm hesaplamaları istemci tarafında (tarayıcıda) yapar; veritabanı veya SSR sunucu maliyeti gerektirmez. Pages; statik dosyalar için küresel CDN, sıfır soğuk başlangıç (cold start), otomatik git preview dağıtımları ve `_headers` desteğini ek karmaşıklık olmadan sunar.
- **Workers:** Dinamik sunucu taraflı kod (Edge compute / API) için tasarlanmıştır. Bu aşamada sunucu taraflı yürütmeye ihtiyaç olmadığı için veri gizliliği ve mimari sadelik açısından Pages en ideal çözümdür.

---

## 3. Alan Adı, HTTPS ve Yönlendirmeler

1. **Özel Alan Adı (Custom Domain):**
   - Cloudflare Pages projesinde **Custom domains** sekmesine gidin > **Set up a custom domain** butonuna tıklayın.
   - Alan adınızı girin (ör. `hakkimne.com` veya `www.hakkimne.com`).
2. **HTTPS ve SSL:**
   - Cloudflare Universal SSL sertifikası alan adı bağlandığında otomatik olarak sağlanır ve yönetilir.
3. **Kanonik Yönlendirme (Apex <-> WWW):**
   - Tek bir kanonik adres (`https://hakkimne.com` veya `https://www.hakkimne.com`) belirlenir.
   - Diğer varyasyon, Cloudflare Dashboard > **Page Rules** veya **Bulk Redirects** [DOĞRULANACAK] üzerinden 301 kalıcı yönlendirme ile kanonik domaine aktarılır.

---

## 4. Güvenlik Başlıklarının Doğrulanması

Statik yayın sırasında `public/_headers` dosyası Cloudflare Pages tarafından otomatik okunur ve tüm yanıtlara eklenir.

**Doğrulama Adımları:**
1. Canlı sitede herhangi bir sayfayı Chrome / Firefox / Edge tarayıcısında açın.
2. `F12` ile **Geliştirici Araçları (DevTools)** > **Network (Ağ)** sekmesine geçin.
3. Sayfayı yenileyin (`F5`) ve ilk HTML isteğine tıklayın.
4. **Headers (Başlıklar)** > **Response Headers (Yanıt Başlıkları)** alanında şu başlıkların varlığını doğrulayın:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
   - `Content-Security-Policy-Report-Only: ...`

---

## 5. Yayın Öncesi Kontrol Listesi (Checklist)

Canlı yayına çıkmadan veya `main` dalına merge etmeden önce:
- [ ] `npm run check:rates` komutu hatasız geçiyor mu (`process.exit(0)`)?
- [ ] `src/config/rates.json` içindeki tüm oranlar ve dönemler resmi HMB genelgesiyle dolduruldu ve `verified: true` yapıldı mı?
- [ ] `src/config/rates.json` içindeki `source_url` resmi genelge URL'si mi (`DOĞRULANACAK` temizlendi mi)?
- [ ] `src/config/site.ts` dosyasında `ALLOW_INDEXING = true` olarak ayarlandı mı?
- [ ] `npm test` çalıştırıldığında tüm testler başarılı mı?
- [ ] `npm run lint` hatasız ve uyarısız geçiyor mu?
- [ ] `npm run build` ile `out/` statik çıktısı hatasız üretiliyor mu?

---

## 6. Geri Alma (Rollback) Prosedürü

Beklenmeyen bir hata veya yanlış veri yayına çıktığında:
1. Cloudflare Dashboard > **Workers & Pages** > `hakkimne` projesini seçin.
2. **Deployments** sekmesine tıklayın.
3. Çalıştığından emin olunan önceki başarılı dağıtımı listeden bulun.
4. Sağdaki üç nokta menüsünden **Rollback to this deployment** seçeneğini onaylayın.
5. Değişiklik anında (birkaç saniye içinde) tüm dünyadaki Cloudflare uç noktalarına yansıtılır.

---

## 7. Altı Aylık Dönem Güncellemesi (Ocak & Temmuz Rutini)

Hazine ve Maliye Bakanlığı her yılın Ocak ve Temmuz aylarında Mali ve Sosyal Haklar Genelgesi ile yeni kıdem tazminatı tavanını ve katsayıları ilan eder.

**Güncelleme Adımları:**
1. **Yeni Dal Açın:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b chore/oran-guncellemesi-YYYY-[1|2]
   ```
2. **Genelgeyi İnceleyin:** Resmi HMB sitesinden genelgeyi edinin ve tavan tutarını teyit edin.
3. **`src/config/rates.json` Dosyasını Güncelleyin:**
   - Yeni dönemi `ceiling_periods` dizisine ekleyin (`valid_from`, `valid_to`, `ceiling_gross_try`).
   - `verified` değerini `true`, `source_url` değerini genelge bağlantısı yapın.
   - Damga vergisi veya katsayılarda değişiklik varsa ilgili alanları güncelleyin.
   - `meta.last_updated` alanına bugünün tarihini yazın.
4. **Doğrulayın:**
   ```bash
   npm run check:rates
   npm test
   npm run build
   ```
5. **PR ve Yayın:** Değişikliği GitHub üzerinden `main` dalına Pull Request olarak gönderin. İnceleme onaylandıktan sonra Cloudflare Pages otomatik olarak yeni sürümü derleyip yayına alacaktır.
