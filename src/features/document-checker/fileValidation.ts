import type { FileValidationError } from "./types";

/**
 * fileValidation.ts — Belge Tür ve Boyut Doğrulama Kuralları
 * Dayanak: İstemci taraflı güvenlik ve KVKK hassas veri koruması
 */

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];

export const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateUploadedFile(
  file: File | { name: string; size: number; type: string },
  hasRedactedPii: boolean
): { ok: true } | FileValidationError {
  if (!hasRedactedPii) {
    return {
      ok: false,
      code: "PII_CONFIRMATION_REQUIRED",
      message:
        "Lütfen belgenizdeki TCKN, IBAN ve açık adres gibi kişisel verileri maskelediğinizi onaylayın.",
    };
  }

  // Boyut Kontrolü
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      code: "FILE_TOO_LARGE",
      message: `Dosya boyutu 10 MB sınırını aşıyor (${formatFileSize(file.size)}). Lütfen daha küçük bir dosya seçin.`,
    };
  }

  // Tür / Uzantı Kontrolü
  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  const isValidMime = file.type ? ALLOWED_MIME_TYPES.includes(file.type) : true;
  const isValidExt = ALLOWED_EXTENSIONS.includes(ext);

  if (!isValidExt || !isValidMime) {
    return {
      ok: false,
      code: "INVALID_FILE_TYPE",
      message:
        "Desteklenmeyen dosya türü. Yalnızca PDF veya resim (PNG, JPG, WEBP) yükleyebilirsiniz.",
    };
  }

  return { ok: true };
}
