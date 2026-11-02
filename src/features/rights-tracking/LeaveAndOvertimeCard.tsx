"use client";

import React, { useState } from "react";
import type { UserProfile, OvertimeLog, OvertimeType } from "./types";
import { formatTRY } from "@/lib/utils/format";

interface LeaveAndOvertimeCardProps {
  profile: UserProfile;
  hourlyGrossRate: number;
  onAddOvertime: (entry: Omit<OvertimeLog, "id">) => void;
  onDeleteOvertime: (id: string) => void;
}

export default function LeaveAndOvertimeCard({
  profile,
  hourlyGrossRate,
  onAddOvertime,
  onDeleteOvertime,
}: LeaveAndOvertimeCardProps) {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [type, setType] = useState<OvertimeType>("overtime_50");
  const [description, setDescription] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(hours);
    if (!date || isNaN(h) || h <= 0) return;
    onAddOvertime({
      date,
      hours: h,
      type,
      description: description.trim() || undefined,
    });
    setHours("");
    setDescription("");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0B1F33]">Fazla Mesai Kayıt Defteri</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Çalıştığınız ek saatleri kaydedin; tahmini alacağınız anlık hesaplansın.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
          Saatlik: {formatTRY(hourlyGrossRate)}
        </span>
      </div>

      {/* Mesai Ekleme Formu */}
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tarih</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1769E0]"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Saat Sayısı</label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Örn: 3.5"
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1769E0]"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mesai Türü</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as OvertimeType)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1769E0] bg-white"
          >
            <option value="overtime_50">Haftalık Fazla Mesai (%50 Zamlı)</option>
            <option value="weekend_100">Hafta / Genel Tatil (%100 Zamlı)</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-2 px-3 bg-[#1769E0] hover:bg-[#123C68] text-white text-xs font-semibold rounded-lg transition-colors min-h-[38px]"
          >
            + Mesai Ekle
          </button>
        </div>
      </form>

      {/* Kayıtlı Mesailer Listesi */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Kayıtlı Mesailer ({profile.overtimeEntries?.length || 0})
        </h4>

        {(!profile.overtimeEntries || profile.overtimeEntries.length === 0) ? (
          <p className="text-xs text-slate-400 italic py-2">
            Henüz eklenmiş bir fazla mesai kaydı bulunmuyor.
          </p>
        ) : (
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl">
            {profile.overtimeEntries.map((entry) => {
              const mult = entry.type === "weekend_100" ? 2.0 : 1.5;
              const pay = entry.hours * hourlyGrossRate * mult;
              return (
                <div key={entry.id} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">
                      {entry.date} • {entry.hours} Saat
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {entry.type === "weekend_100" ? "%100 Tatil Mesaisi" : "%50 Standart Mesai"}
                      {entry.description ? ` • ${entry.description}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-700">
                      {formatTRY(pay)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteOvertime(entry.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Sil"
                      aria-label="Mesai kaydını sil"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
