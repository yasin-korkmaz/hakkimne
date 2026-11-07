import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Hero from "@/components/Hero";
import AracGrid from "@/components/AracGrid";
import JsonLd from "@/components/JsonLd";
import {
  buildOrganizationAndWebsiteSchema,
  buildWebApplicationSchema,
} from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "Kıdem ve İhbar Tazminatı Hesaplama",
  description:
    "HakkımNedir? — 1475 ve 4857 sayılı kanunlar kapsamında güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `Kıdem ve İhbar Tazminatı Hesaplama | ${siteConfig.siteName}`,
    description:
      "HakkımNedir? — 1475 ve 4857 sayılı kanunlar kapsamında güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
    url: siteConfig.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `Kıdem ve İhbar Tazminatı Hesaplama | ${siteConfig.siteName}`,
    description:
      "HakkımNedir? — 1475 ve 4857 sayılı kanunlar kapsamında güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
  },
};

export default function Home() {
  const orgAndWebSchema = buildOrganizationAndWebsiteSchema();
  const appSchema = buildWebApplicationSchema({
    name: "Kıdem ve İhbar Tazminatı Hesaplama",
    path: "/",
    description:
      "1475 ve 4857 sayılı kanunlar kapsamında güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
  });

  return (
    <div className="flex flex-col gap-10 w-full">
      <JsonLd data={orgAndWebSchema} />
      <JsonLd data={appSchema} />

      {/* 1. Hero Bölümü (Başlık, CTA ve İstatistik Kartları) */}
      <Hero />

      {/* 2. Hesaplama ve Karar Destek Araçları Menüsü */}
      <AracGrid />
    </div>
  );
}
