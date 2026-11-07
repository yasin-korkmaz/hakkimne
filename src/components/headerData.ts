import {
  Scale,
  FileText,
  Calendar,
  Clock,
  Hourglass,
  TrendingUp,
  ShieldCheck,
  Lock,
  Code2,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export const TOOL_CHIPS = [
  { href: "/kidem-tazminati-hesaplama", label: "Kıdem Tazminatı", icon: Scale },
  { href: "/ihbar-tazminati-hesaplama", label: "İhbar Tazminatı", icon: FileText },
  { href: "/yillik-izin-ucreti-hesaplama", label: "Yıllık İzin", icon: Calendar },
  { href: "/fazla-mesai-hesaplama", label: "Fazla Mesai", icon: Clock },
  { href: "/ihbar-suresi-hesaplama", label: "İhbar Süresi", icon: Hourglass },
];

export const MORE_TOOLS = [
  { href: "/net-brut-ucret-hesaplama", label: "Net / Brüt Maaş", desc: "2026 Gelir vergisi dilimleriyle maaş hesabı" },
  { href: "/hak-takip-merkezi", label: "Hak Takip Merkezi", desc: "Çalışma süresi, izin ve mesai takibi" },
  { href: "/belge-kontrolu", label: "Belge Kontrolü", desc: "Bordro ve sözleşme risk analizi" },
  { href: "/kariyerim", label: "Kariyerim", desc: "Teklif kıyaslama ve mülakat simülatörü" },
  { href: "/kamu", label: "Kamu & KPSS", desc: "Önlisans kadro ve 3249 nitelik rehberi" },
];

export const TRUST_METRICS = [
  { icon: TrendingUp, text: "Bu ay 14.800+ hesaplama" },
  { icon: ShieldCheck, text: `Mevzuat güncellendi: ${siteConfig.lastContentUpdate || "Eki 2026"}` },
  { icon: Lock, text: "Veriler tarayıcıdan çıkmaz" },
  { icon: Code2, text: "Açık kaynak & Ücretsiz" },
];
