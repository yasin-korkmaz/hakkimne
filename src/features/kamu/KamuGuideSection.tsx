"use client";

/**
 * KamuGuideSection.tsx — KPSS Önlisans ve Nitelik Kodları Rehberi
 * 3249 avantajları, 6225 sertifika muafiyeti, merkezi vs açıktan atama rehberi.
 * Dayanak: ÖSYM KPSS Kılavuzu Genel Esaslar ve DPB Tebliğleri.
 */

import React from "react";

export function KamuGuideSection() {
  return (
    <div className="space-y-6 text-slate-800">
      {/* 1. Öne Çıkan Kart: 6225 Muafiyeti */}
      <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
          <h3 className="text-sm font-bold text-teal-900">
            Kritik Kural: 3249 Mezunları için 6225 Sertifika Muafiyeti
          </h3>
        </div>
        <p className="text-xs text-teal-950 leading-relaxed mb-3">
          ÖSYM Tercih Kılavuzu genel esaslarına göre; örgün eğitimde bilgisayar dersi alanlar veya
          <strong> 3249 Bilgisayar Programcılığı</strong> gibi doğrudan bilgisayar bölümlerinden mezun olanlar,
          ayrıca M.E.B. onaylı Bilgisayar İşletmeni Sertifikası (6225) almak zorunda değildir.
        </p>
        <div className="bg-white/80 rounded-lg p-3 text-xs text-teal-900 border border-teal-100 font-medium">
          📌 <strong>Belgelendirme:</strong> Mezuniyet diploması veya transkriptte bilgisayar dersi görülmesi atama esnasında yeterlidir.
        </div>
      </div>

      {/* 2. 3249 Kodunun Sunduğu Temel Avantajlar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-[#0B1F33] mb-3">
          3249 Bilgisayar Programcılığı Mezunlarının Kadro Avantajları
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="font-bold text-[#1769E0] block mb-1">1. Çift Kadro Havuzu</span>
            <p className="text-slate-600">
              Hem yalnızca 3249 mezunlarına açılan özel teknik kadrolara (Programcı, Tekniker) hem de 3001 genel kadrolarına başvurabilirsiniz.
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="font-bold text-[#1769E0] block mb-1">2. VHKİ & Bilgisayar İşletmeni</span>
            <p className="text-slate-600">
              Üniversite ve bakanlıkların en çok açtığı VHKİ ve Bilgisayar İşletmeni kadrolarında 6225 sertifika şartına takılmadan tercih yapabilirsiniz.
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="font-bold text-[#1769E0] block mb-1">3. Teknik Kadro Maaş Farkı</span>
            <p className="text-slate-600">
              Programcı veya Tekniker kadroları TH (Teknik Hizmetler) sınıfında yer aldığından GİH (Genel İdare) memurlarına göre ek özel hizmet tazminatı alır.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Atama Türleri Karşılaştırması */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-[#0B1F33] mb-3">
          Merkezi Atama (B Grubu) ve Açıktan Alım (4/B) Farkları
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="p-3">Kriter</th>
                <th className="p-3">Merkezi Atama (ÖSYM)</th>
                <th className="p-3">Kurumsal / Açıktan Alım (4/B)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3 font-semibold text-slate-800">Mülakat Şartı</td>
                <td className="p-3 text-emerald-700 font-semibold">Yok (Doğrudan Puan Sıralaması)</td>
                <td className="p-3 text-amber-700">Çoğunlukla Sözlü veya Uygulamalı Sınav Var</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Tercih Dönemi</td>
                <td className="p-3">Yılda 2 kez (ÖSYM Takvimi)</td>
                <td className="p-3">Yıl boyu Resmi Gazete ve Kariyer Kapısı</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Statü</td>
                <td className="p-3">Kadrolu Devlet Memuru (657 4/A) veya KİT (399)</td>
                <td className="p-3">Sözleşmeli Personel (657 4/B)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. KPSS P93 Tercih Tavsiyeleri */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-[#0B1F33] mb-2">Tercih Listesi Hazırlama Stratejisi</h3>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
          <li>
            <strong>30 Tercih Kuralı:</strong> Tercihlerin ilk 5-7 tanesini puanınızın üstündeki ideal yerlere, 15 tanesini puan aralığınıza denk yerlere, son 8-10 tanesini ise garanti görülebilecek taban puanı düşük kurumlara ayırın.
          </li>
          <li>
            <strong>Puan Geçerliliği:</strong> KPSS Önlisans puanı sınav sonuç tarihinden itibaren 2 yıl boyunca (yeni bir Önlisans KPSS yapılana dek) tüm merkezi ve açıktan alımlarda geçerlidir.
          </li>
          <li>
            <strong>Özel Şartları Dikkatle İnceleyin:</strong> YDS şartı (7111), sürücü belgesi (6506) veya cinsiyet şartı olan kadrolarda şartı sağlamayan adayların yerleştirilseler dahi atamaları iptal edilir.
          </li>
        </ul>
      </div>
    </div>
  );
}
