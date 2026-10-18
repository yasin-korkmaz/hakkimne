# ÜRÜN GEREKSİNİM DOKÜMANI (FAZ 1 - MVP)
- Kapsam: Sadece Kıdem (1475 md. 14) ve İhbar (4857 md. 17) Tazminatı hesaplama ve "Adım Adım Hesaplama Fişi".
- Kapsam Dışı: Üyelik, veritabanı, PDF, ödeme, diğer hesaplayıcılar.
- Fesih Nedenleri: `employer_unfair` (Kıdem+İhbar), `employee_just_cause` (Sadece Kıdem), `retirement_military_marriage` (Sadece Kıdem), `voluntary_resignation` (0 TL), `employer_just_cause` (Md. 25/II - 0 TL).
- İhbar Öneli Kullandırıldı mı?: `yes` ise İhbar = 0 TL, `no` ise hesaplanır.
- Formüller: Giydirilmiş Brüt = Brüt + Aylık Ek + (Yıllık İkramiye / 12). Kıdem Baz = min(Giydirilmiş Brüt, Dönem Tavanı). Brüt Kıdem = (Yıl*Baz) + (Ay*Baz/12) + (Gün*Baz/365). Damga = Brüt * 0.00759. İhbarda tavan uygulanmaz: Günlük Brüt = Giydirilmiş Brüt / 30, Brüt İhbar = Günlük Brüt * (Hafta * 7).
- Doğrulama Senaryoları:
  * Senaryo 1: Giriş `2022-08-15`, Çıkış `2026-08-14` (4y 0m 0d), `employer_unfair`, ihbar kullandırılmadı, Brüt 50.000 -> Kıdem Brüt: 200.000, Damga: 1.518, Kıdem Net: 198.482, İhbar (8 hafta): Brüt 93.333,33.
  * Senaryo 2: Giriş `2024-10-01`, Çıkış `2026-09-30` (2y 0m 0d), `retirement_military_marriage`, Brüt 90.000, Ek 5.000, Yıllık İkramiye 60.000 (Giydirilmiş 100.000) -> Kıdem Baz: 73.729,87, Brüt Kıdem: 147.459,74, Damga: 1.119,22, Net Kıdem: 146.340,52, İhbar: 0.
  * Senaryo 3: Giriş `2025-03-10`, Çıkış `2026-03-09` (1y 0m 0d), Brüt 80.000, `employer_unfair` -> 2026-1 tavanı (64.948,77) uygulanır.
