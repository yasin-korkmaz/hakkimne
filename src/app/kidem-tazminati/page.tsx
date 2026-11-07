import React from "react";
import type { Metadata } from "next";
import KidemTazminatiPage from "@/app/kidem-tazminati-hesaplama/page";

export const metadata: Metadata = {
  title: "Kıdem ve İhbar Tazminatı Hesaplama Motoru",
  description:
    "1475 sayılı Kanun md. 14 ve 4857 sayılı Kanun md. 17 uyarınca güncel tavan ve oranlarla çalışan kıdem ve ihbar tazminatı hesaplama aracı.",
  alternates: {
    canonical: "/kidem-tazminati-hesaplama",
  },
};

export default KidemTazminatiPage;
