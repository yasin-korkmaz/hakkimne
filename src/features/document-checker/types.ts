/**
 * types.ts — AI Belge Kontrolü Tür Tanımları
 * Dayanak: 4857 Sayılı İş Kanunu ve KVKK Gizlilik Standartları
 */

export type DocumentType =
  | "pay_slip"          // Maaş Bordrosu
  | "employment_contract" // İş Sözleşmesi
  | "termination_notice"  // Fesih Bildirimi
  | "leave_form";       // İzin Belgesi / Talep Formu

export type FindingCategory =
  | "info"               // Bilgi
  | "warning"            // Kontrol edilmeli
  | "danger"             // Muhtemel risk
  | "missing"            // Eksik bilgi
  | "legal_consultation"; // Uzman incelemesi önerilir

export interface RelatedToolLink {
  label: string;
  href: string;
}

export interface DocumentFinding {
  id: string;
  category: FindingCategory;
  title: string;
  description: string;
  legalBase: string; // Örn: "4857 SK md. 19"
  recommendation: string;
  relatedTool?: RelatedToolLink;
}

export interface DocumentCheckInput {
  documentType: DocumentType;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  hasRedactedPii: boolean;
  userNotes?: string;
}

export interface DocumentCheckResult {
  ok: true;
  documentType: DocumentType;
  documentTypeName: string;
  fileName: string;
  fileSizeFormatted: string;
  analyzedAt: string;
  findings: DocumentFinding[];
  summaryCounts: Record<FindingCategory, number>;
  disclaimer: string;
}

export interface FileValidationError {
  ok: false;
  code: "INVALID_FILE_TYPE" | "FILE_TOO_LARGE" | "PII_CONFIRMATION_REQUIRED";
  message: string;
}
