# ANTIGRAVITY AJAN KURALLARI (AGENTS.md)
1. Teknoloji Yığını: Next.js (App Router, statik çıktı `output: 'export'`) + TypeScript (strict) + Tailwind CSS + Vitest.
2. Oranlar ve Mantık Ayrımı: Kıdem tavanı, damga vergisi ve ihbar kademelerini ASLA kodun içine sabit (hardcoded) yazma. Tüm verileri parametre olarak veya `src/config/rates.json` üzerinden oku.
3. Doğrulama Kilidi (Verification Lock): `verified: false` olan hiçbir oranı veya tanımlı olmayan hiçbir dönemi hesaplamada kullanma. Varsayılan tavan uydurma; doğrudan hata kodu döndür. `src/config/rates.json` içindeki `verified` alanlarını ASLA kendin `true` yapma.
4. Sıkı Test Disiplini: Beklenen test sonuçlarını (expected values) kendin üretme, yalnızca `PRD.md` veya prompt içinde verilen değerleri kullan. Bir test başarısız olursa testi değiştirerek geçirme; hatayı kodda bul ve düzelt.
5. Kod Okunabilirliği ve Sınırlar: Her ana fonksiyonun üstüne Türkçe olarak algoritmayı ve dayandığı kanun maddesini (1475 md. 14 veya 4857 md. 17) açıklayan yorum satırı ekle. Hiçbir dosya 200 satırı geçmemelidir.
6. Kişisel Veri ve Ağ Yasağı: Faz 1'de veritabanı, üyelik, çerez veya sunucuya veri gönderimi yoktur.
