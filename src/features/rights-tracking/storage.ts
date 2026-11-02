import type { UserProfile } from "./types";

/**
 * storage.ts — Hak Takip Merkezi Yerel Depolama (localStorage) Katmanı
 * Sunucuya kesinlikle veri gönderilmez; tüm işlemler istemci cihazında yürütülür.
 */

export const STORAGE_KEY = "hakkimnedir_user_profile";

export const DEFAULT_PROFILE: UserProfile = {
  startDate: "",
  grossSalary: 0,
  monthlyExtra: 0,
  weeklyContractHours: 45,
  age: 30,
  usedLeaveDays: 0,
  sector: "Özel Sektör / Bilişim",
  overtimeEntries: [],
  lastUpdated: new Date().toISOString(),
};

export function loadUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    if (!parsed.startDate) return null;
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      overtimeEntries: Array.isArray(parsed.overtimeEntries)
        ? parsed.overtimeEntries
        : [],
    };
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    const dataToSave: UserProfile = {
      ...profile,
      lastUpdated: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (err) {
    console.error("Profil kaydedilemedi:", err);
  }
}

export function clearUserProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Profil silinemedi:", err);
  }
}

export function exportProfileJson(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  const jsonStr = JSON.stringify(profile, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hakkimnedir-calisma-profili-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseImportedProfile(jsonString: string): UserProfile {
  const parsed = JSON.parse(jsonString) as Partial<UserProfile>;
  if (!parsed.startDate || typeof parsed.grossSalary !== "number") {
    throw new Error("Geçersiz profil dosyası biçimi.");
  }
  return {
    ...DEFAULT_PROFILE,
    ...parsed,
    overtimeEntries: Array.isArray(parsed.overtimeEntries)
      ? parsed.overtimeEntries
      : [],
    lastUpdated: new Date().toISOString(),
  };
}
