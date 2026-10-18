# MİMARİ VE HUKUKİ KARAR GÜNLÜĞÜ
- Karar 1 (Tarih ve Süre Kuralı): Tarihler YYYY-MM-DD metnidir. Yerel saat dilimine bağlı Date kullanılmaz, saf takvim aritmetiği kullanılır. Çıkış günü çalışılmış sayılır (dahildir): bitiş sınırı (hariç) = çıkış tarihi + 1 gün. Hedef ayda o gün yoksa ayın son gününe kırpılır (clamping).
- Karar 2 (İhbar Kademeleri - 4857 Md. 17): <6 ay: 2 hafta (14 gün) | Tam 6 ay – Tam 18 ay (1.5 yıl) dahil: 4 hafta (28 gün) | >18 ay – Tam 36 ay (3 yıl) dahil: 6 hafta (42 gün) | >36 ay (3 yıl + en az 1 gün): 8 hafta (56 gün).
- Karar 3 (Yuvarlama Standardı): Ara değerler yuvarlanmaz, yalnızca nihai tutarlar `Math.round((n + Number.EPSILON) * 100) / 100` ile 2 kuruş hanesine yuvarlanır.
- Karar 4 (Barındırma): Statik çıktı (`output: 'export'`) ile Cloudflare Pages hedeflenmektedir.
