import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.siteName} — Kıdem ve İhbar Tazminatı Hesaplama`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description:
    "Türk İş Hukuku mevzuatına uygun, güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        {/* Üst Menü (Header) */}
        <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {siteConfig.siteName}
            </Link>

            <nav aria-label="Ana Menü" className="flex items-center gap-4 text-sm font-medium">
              <Link
                href="/kidem-tazminati-hesaplama"
                className="text-slate-600 hover:text-blue-600 transition-colors py-1"
              >
                Kıdem Tazminatı
              </Link>
              <Link
                href="/ihbar-tazminati-hesaplama"
                className="text-slate-600 hover:text-blue-600 transition-colors py-1"
              >
                İhbar Tazminatı
              </Link>
            </nav>
          </div>
        </header>

        {/* Ana İçerik */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-10">
          {children}
        </main>

        {/* Alt Bilgi (Footer) */}
        <footer className="w-full bg-white border-t border-slate-200 text-xs text-slate-500 py-8 mt-12">
          <div className="max-w-4xl mx-auto px-4 flex flex-col gap-6">
            {/* Yasal Bağlantılar */}
            <nav
              aria-label="Yasal ve Kurumsal Bağlantılar"
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-600 font-medium"
            >
              <Link href="/gizlilik" className="hover:text-blue-600 transition-colors">
                Gizlilik
              </Link>
              <Link href="/kvkk" className="hover:text-blue-600 transition-colors">
                KVKK
              </Link>
              <Link href="/cerez-politikasi" className="hover:text-blue-600 transition-colors">
                Çerez Politikası
              </Link>
              <Link href="/kullanim-kosullari" className="hover:text-blue-600 transition-colors">
                Kullanım Koşulları
              </Link>
              <Link href="/hakkinda" className="hover:text-blue-600 transition-colors">
                Hakkında
              </Link>
              <Link href="/iletisim" className="hover:text-blue-600 transition-colors">
                İletişim
              </Link>
            </nav>

            {/* Yasal Çekince (DISCLAIMER) */}
            <div className="text-center text-slate-500 max-w-2xl mx-auto leading-relaxed border-t border-slate-100 pt-4">
              <p>
                Bu araç bilgilendirme amaçlıdır, hukuki danışmanlık değildir. Sonuç, fesih nedeni ve ek koşullara göre değişebilir.
              </p>
              <p className="mt-2 text-slate-400">
                Son güncelleme: {siteConfig.lastContentUpdate} · Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
