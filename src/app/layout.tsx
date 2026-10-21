import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `Kıdem ve İhbar Tazminatı Hesaplama | ${siteConfig.siteName}`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description:
    "1475 ve 4857 sayılı kanunlar kapsamında güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
  robots: siteConfig.allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `Kıdem ve İhbar Tazminatı Hesaplama | ${siteConfig.siteName}`,
    description:
      "1475 ve 4857 sayılı kanunlar kapsamında güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
    url: siteConfig.siteUrl,
    siteName: siteConfig.siteName,
    locale: "tr_TR",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
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
        <footer className="w-full bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
          <div className="max-w-4xl mx-auto px-4 flex flex-col gap-6">
            {/* Yasal Bağlantılar */}
            <nav aria-label="Yasal Bağlantılar" className="flex flex-wrap gap-x-6 gap-y-2 justify-center sm:justify-start">
              <Link href="/gizlilik" className="hover:text-slate-800 transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/kvkk" className="hover:text-slate-800 transition-colors">
                KVKK Aydınlatma Metni
              </Link>
              <Link href="/cerez-politikasi" className="hover:text-slate-800 transition-colors">
                Çerez Politikası
              </Link>
              <Link href="/kullanim-kosullari" className="hover:text-slate-800 transition-colors">
                Kullanım Koşulları
              </Link>
              <Link href="/hakkinda" className="hover:text-slate-800 transition-colors">
                Hakkında
              </Link>
              <Link href="/iletisim" className="hover:text-slate-800 transition-colors">
                İletişim
              </Link>
            </nav>

            {/* Sorumluluk Reddi (Disclaimer) ve Güncelleme Bilgisi */}
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-slate-600 leading-relaxed">
              <p>
                <strong>Yasal Uyarı:</strong> Bu araç bilgilendirme amaçlıdır, hukuki danışmanlık değildir. Sonuç, fesih nedeni ve ek koşullara göre değişebilir.
              </p>
              <p className="text-slate-600">
                Son Mevzuat ve İçerik Güncellemesi: {siteConfig.lastContentUpdate}
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
