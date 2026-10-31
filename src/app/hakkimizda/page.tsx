import HakkindaPage from "@/app/hakkinda/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "HakkımNe? Bağımsız Kıdem ve İhbar Tazminatı Hesaplama Platformu",
  robots: { index: false, follow: false },
  alternates: { canonical: "/hakkinda" },
};

export default HakkindaPage;
