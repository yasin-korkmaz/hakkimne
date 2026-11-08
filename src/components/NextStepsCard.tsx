import React from "react";
import { HelpCircle, FileCheck, Scale, Clock } from "lucide-react";

/**
 * NextStepsCard.tsx — Hesaplama Sonrası Hukuki Eylem ve Yol Haritası Kartı
 * Dayanak:
 *  1. HMK md. 189 & Yargıtay İspat Kuralları (Maaş dekontu, SGK dökümü delilleri)
 *  2. 7036 sayılı İş Mahkemeleri Kanunu md. 3 (Dava Şartı Zorunlu Arabuluculuk)
 *  3. 4857 sayılı İş Kanunu Ek Madde 3 (Kıdem ve ihbar tazminatında 5 yıllık zamanaşımı)
 */

export default function NextStepsCard() {
  const STEPS = [
    {
      icon: FileCheck,
      title: "Kanıtlarınızı Toplayın:",
      desc: "Maaş dekontları, SGK dökümleri ve şirket içi yazışmalarınızı yedekleyin.",
      badge: "Ön Hazırlık",
    },
    {
      icon: Scale,
      title: "Arabulucuya Başvurun:",
      desc: "İşçi alacakları için dava açmadan önce arabulucuya gitmek yasal zorunluluktur.",
      badge: "Yasal Zorunluluk",
    },
    {
      icon: Clock,
      title: "Zamanaşımına Dikkat Edin:",
      desc: "Kıdem, ihbar ve maaş alacaklarında yasal zamanaşımı süresi 5 yıldır.",
      badge: "5 Yıl Sınırı",
    },
  ];

  return (
    <section
      aria-labelledby="next-steps-heading"
      className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4"
    >
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="p-2 bg-blue-50 text-[#1769E0] rounded-xl">
          <HelpCircle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h3
            id="next-steps-heading"
            className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
          >
            Şimdi Ne Yapmalıyım?
          </h3>
          <p className="text-xs text-slate-500">
            Tazminat hakkınızı korumak için izlemeniz gereken yasal adımlar
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/70 rounded-xl p-4 flex flex-col justify-between gap-2.5 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100/70 text-[#1769E0] flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                  {step.badge}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                  <Icon className="w-3.5 h-3.5 text-[#1769E0] shrink-0" aria-hidden="true" />
                  <span>{step.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
