"use client";

import React, { useState, useEffect, useRef } from "react";
import type { UserProfile, OvertimeLog } from "./types";
import {
  loadUserProfile,
  saveUserProfile,
  clearUserProfile,
  exportProfileJson,
  parseImportedProfile,
  DEFAULT_PROFILE,
} from "./storage";
import { computeProfileSummary } from "./engine";
import ProfileForm from "./ProfileForm";
import DashboardSummary from "./DashboardSummary";
import LeaveAndOvertimeCard from "./LeaveAndOvertimeCard";
import MilestonesCard from "./MilestonesCard";

export default function RightsTracker() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const existing = loadUserProfile();
    if (existing) setProfile(existing);
  }, []);

  if (!isMounted) return null;

  const handleSaveProfile = (newProfile: UserProfile) => {
    saveUserProfile(newProfile);
    setProfile(newProfile);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm("Kayıtlı çalışma profilinizi bu cihazdan silmek istediğinize emin misiniz?")) {
      clearUserProfile();
      setProfile(null);
      setIsEditing(false);
    }
  };

  const handleAddOvertime = (entry: Omit<OvertimeLog, "id">) => {
    if (!profile) return;
    const newEntry: OvertimeLog = { ...entry, id: `ot_${Date.now()}` };
    const updated: UserProfile = {
      ...profile,
      overtimeEntries: [newEntry, ...(profile.overtimeEntries || [])],
    };
    handleSaveProfile(updated);
  };

  const handleDeleteOvertime = (id: string) => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      overtimeEntries: (profile.overtimeEntries || []).filter((e) => e.id !== id),
    };
    handleSaveProfile(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = parseImportedProfile(content);
        handleSaveProfile(imported);
      } catch (err) {
        alert("Dosya yüklenemedi: Geçersiz profil JSON biçimi.");
      }
    };
    reader.readAsText(file);
  };

  const summary = profile && profile.startDate ? computeProfileSummary(profile) : null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      {/* 1. Gizlilik Bildirimi (Privacy Banner) */}
      <div className="bg-blue-50/70 border border-blue-200/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-slate-800 shadow-xs">
        <svg className="w-5 h-5 text-[#1769E0] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="text-[#0B1F33]">Sıfır Sunucu & Cihazda Saklanan Veri:</strong> Girdiğiniz tüm çalışma bilgileri ve mesai kayıtları sadece kendi tarayıcınızda (yerel hafızada) saklanır. Sunucularımıza hiçbir kişisel veri aktarılmaz.
        </div>
      </div>

      {/* 2. Profil Yoksa veya Düzenleme Modundaysa Form Göster */}
      {(!profile || isEditing) ? (
        <ProfileForm
          initialProfile={profile || DEFAULT_PROFILE}
          onSave={handleSaveProfile}
          onCancel={profile ? () => setIsEditing(false) : undefined}
        />
      ) : summary ? (
        <div className="flex flex-col gap-8">
          <DashboardSummary
            profile={profile}
            summary={summary}
            onEditProfile={() => setIsEditing(true)}
          />

          <LeaveAndOvertimeCard
            profile={profile}
            hourlyGrossRate={summary.hourlyGrossRate}
            onAddOvertime={handleAddOvertime}
            onDeleteOvertime={handleDeleteOvertime}
          />

          <MilestonesCard
            milestones={summary.milestones}
            profile={profile}
          />

          {/* Profil Yönetim Butonları (Dışa Aktar, İçe Aktar, Sıfırla) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              Son güncelleme: {new Date(profile.lastUpdated).toLocaleDateString("tr-TR")}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => exportProfileJson(profile)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                JSON Dışa Aktar
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                İçe Aktar
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 font-semibold rounded-lg transition-colors"
              >
                Verileri Sıfırla
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
