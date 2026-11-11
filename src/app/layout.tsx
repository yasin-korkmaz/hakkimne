import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrivacyAnalytics from "@/components/PrivacyAnalytics";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

/**
 * RootLayout Metadata — Kapsamlı SEO, OpenGraph ve Twitter Card Tanımları
 * Next.js App Router standartlarına ve SSG (output: 'export') mimarisine %100 uyumludur.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "HakkımNedir? | Kıdem ve İhbar Tazminatı Hesaplama 2026",
    template: `%s | ${siteConfig.siteName}`,
  },
  description:
    "İşçi haklarınızı ücretsiz öğrenin, kıdem ve ihbar tazminatınızı güncel tavan oranlarıyla saniyeler içinde hesaplayın.",
  keywords: [
    "kıdem tazminatı hesaplama",
    "ihbar tazminatı hesaplama",
    "kıdem tazminatı tavanı 2026",
    "işçi hakları",
    "tazminat hesaplama 2026",
    "ihbar süresi hesaplama",
  ],
  authors: [{ name: "HakkımNedir?" }],
  creator: "HakkımNedir?",
  publisher: "HakkımNedir?",
  robots: siteConfig.allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HakkımNedir? | Kıdem ve İhbar Tazminatı Hesaplama 2026",
    description:
      "İşçi haklarınızı ücretsiz öğrenin, kıdem ve ihbar tazminatınızı güncel tavan oranlarıyla saniyeler içinde hesaplayın.",
    url: siteConfig.siteUrl,
    siteName: siteConfig.siteName,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "HakkımNedir? — Kıdem ve İhbar Tazminatı Hesaplama 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HakkımNedir? | Kıdem ve İhbar Tazminatı Hesaplama 2026",
    description:
      "İşçi haklarınızı ücretsiz öğrenin, kıdem ve ihbar tazminatınızı güncel tavan oranlarıyla saniyeler içinde hesaplayın.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: [
      { url: "/logo-icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo-icon.svg",
    apple: "/logo-icon.svg",
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
    <html lang="tr" className="overflow-x-hidden">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans overflow-x-hidden w-full">
        {/* Klavye Erişilebilirliği: İçeriğe Atla Bağlantısı */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-blue-600 focus:text-white focus:font-semibold focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
          İçeriğe Atla
        </a>

        {/* Üst Menü (Responsive Header) */}
        <Header />

        {/* Ana İçerik */}
        <main id="main-content" tabIndex={-1} className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-10 focus:outline-none overflow-x-hidden">
          {children}
        </main>

        {/* Alt Bilgi (Footer) */}
        <Footer />

        {/* Çerezsiz ve Gizlilik Odaklı Analitik (Devre dışı ise render edilmez) */}
        <PrivacyAnalytics />

        {/* KVKK Uyumlu Çerez Onay Bildirimi */}
        <CookieBanner />
      </body>
    </html>
  );
}
