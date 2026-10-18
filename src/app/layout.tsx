import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HakkımNe?",
  description: "Kıdem ve ihbar tazminatı hesaplayıcı",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
