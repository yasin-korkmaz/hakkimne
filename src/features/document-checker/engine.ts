import type {
  DocumentCheckInput,
  DocumentCheckResult,
  FindingCategory,
} from "./types";
import { DOCUMENT_RULES, DOCUMENT_NAMES } from "./rules";
import { formatFileSize } from "./fileValidation";

/**
 * engine.ts — AI Belge Kontrolü Analiz Motoru
 * İstemci tarafında çalışan deterministik hukuki denetim motoru.
 * Sunucuya dosya veya veri aktarılmaz (AGENTS.md Kural 6).
 */

export function analyzeDocument(input: DocumentCheckInput): DocumentCheckResult {
  const findings = DOCUMENT_RULES[input.documentType] || [];

  const summaryCounts: Record<FindingCategory, number> = {
    info: 0,
    warning: 0,
    danger: 0,
    missing: 0,
    legal_consultation: 0,
  };

  for (const f of findings) {
    summaryCounts[f.category] = (summaryCounts[f.category] || 0) + 1;
  }

  return {
    ok: true,
    documentType: input.documentType,
    documentTypeName: DOCUMENT_NAMES[input.documentType] || "İş Belgesi",
    fileName: input.fileName,
    fileSizeFormatted: formatFileSize(input.fileSizeBytes),
    analyzedAt: new Date().toISOString(),
    findings,
    summaryCounts,
    disclaimer:
      "Bu analiz yalnızca genel hukuki bilgilendirme ve farkındalık amaçlıdır; avukatlık veya resmi hukuki danışmanlık yerine geçmez. Somut uyuşmazlıklarda uzman bir iş hukuku avukatına veya resmi arabulucuya başvurulmalıdır.",
  };
}
