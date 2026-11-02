"use client";

import React, { useState } from "react";
import { SECTORS, type UserProfile } from "./types";

interface ProfileFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export default function ProfileForm({
  initialProfile,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const [startDate, setStartDate] = useState(initialProfile.startDate || "");
  const [grossSalary, setGrossSalary] = useState(
    initialProfile.grossSalary ? String(initialProfile.grossSalary) : ""
  );
  const [monthlyExtra, setMonthlyExtra] = useState(
    initialProfile.monthlyExtra ? String(initialProfile.monthlyExtra) : ""
  );
  const [weeklyHours, setWeeklyHours] = useState(
    String(initialProfile.weeklyContractHours || 45)
  );
  const [age, setAge] = useState(String(initialProfile.age || 30));
  const [usedDays, setUsedDays] = useState(
    String(initialProfile.usedLeaveDays || 0)
  );
  const [sector, setSector] = useState(initialProfile.sector || SECTORS[0]!);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) {
      setError("Lütfen geçerli bir işe giriş tarihi belirtin.");
      return;
    }
    const salaryNum = parseFloat(grossSalary.replace(/\./g, "").replace(",", ".")) || 0;
    const extraNum = parseFloat(monthlyExtra.replace(/\./g, "").replace(",", ".")) || 0;

    onSave({
      ...initialProfile,
      startDate,
      grossSalary: salaryNum,
      monthlyExtra: extraNum,
      weeklyContractHours: parseInt(weeklyHours, 10) || 45,
      age: parseInt(age, 10) || 30,
      usedLeaveDays: parseInt(usedDays, 10) || 0,
      sector,
      lastUpdated: new Date().toISOString(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-5 text-slate-900"
    >
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-xl font-bold text-[#0B1F33]">
          Çalışma Profilini {initialProfile.startDate ? "Güncelle" : "Oluştur"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Verileriniz yalnızca bu tarayıcıda saklanır. Dilediğiniz zaman değiştirebilirsiniz.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs sm:text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            İşe Giriş Tarihi <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1769E0] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Çalışma Sektörü</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1769E0] focus:outline-none bg-white"
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Aylık Çıplak Brüt Maaş (TL)</label>
          <input
            type="number"
            min="0"
            step="any"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
            placeholder="Örn: 45000"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1769E0] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Aylık Düzenli Yan Haklar (Yol/Yemek/Prim TL)</label>
          <input
            type="number"
            min="0"
            step="any"
            value={monthlyExtra}
            onChange={(e) => setMonthlyExtra(e.target.value)}
            placeholder="Örn: 5000"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1769E0] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Kullanılan Yıllık İzin Günü</label>
          <input
            type="number"
            min="0"
            value={usedDays}
            onChange={(e) => setUsedDays(e.target.value)}
            placeholder="Örn: 5"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1769E0] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Yaşınız (18/50 Yaş İzin Koruması İçin)</label>
          <input
            type="number"
            min="14"
            max="100"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1769E0] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Vazgeç
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#1769E0] hover:bg-[#123C68] rounded-xl transition-all shadow-xs"
        >
          Profili Kaydet
        </button>
      </div>
    </form>
  );
}
