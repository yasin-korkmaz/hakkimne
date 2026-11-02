"use client";

import React, { useState } from "react";
import type { JobOffer, OfferWeights, WorkModel } from "./types";
import { DEFAULT_WEIGHTS } from "./offerEngine";

interface OfferComparisonFormProps {
  onCompare: (offerA: JobOffer, offerB: JobOffer, weights: OfferWeights) => void;
}

interface OfferFields {
  name: string;
  salary: string;
  meal: string;
  transport: string;
  bonus: string;
  hours: string;
  leave: string;
  model: WorkModel;
  commute: string;
}

const DEFAULT_A: OfferFields = {
  name: "A Şirketi (Mevcut / 1. Teklif)",
  salary: "45000",
  meal: "4000",
  transport: "2000",
  bonus: "0",
  hours: "45",
  leave: "14",
  model: "office",
  commute: "60",
};

const DEFAULT_B: OfferFields = {
  name: "B Şirketi (Yeni Teklif)",
  salary: "52000",
  meal: "5000",
  transport: "0",
  bonus: "20000",
  hours: "40",
  leave: "20",
  model: "hybrid",
  commute: "40",
};

function toJobOffer(id: string, f: OfferFields): JobOffer {
  return {
    id,
    companyName: f.name.trim() || id,
    grossSalary: parseFloat(f.salary) || 0,
    mealAllowance: parseFloat(f.meal) || 0,
    transportAllowance: parseFloat(f.transport) || 0,
    bonusAnnual: parseFloat(f.bonus) || 0,
    weeklyHours: parseInt(f.hours, 10) || 45,
    annualLeaveDays: parseInt(f.leave, 10) || 14,
    workModel: f.model,
    commuteMinutes: parseInt(f.commute, 10) || 0,
  };
}

export default function OfferComparisonForm({ onCompare }: OfferComparisonFormProps) {
  const [fieldsA, setFieldsA] = useState<OfferFields>(DEFAULT_A);
  const [fieldsB, setFieldsB] = useState<OfferFields>(DEFAULT_B);
  const [weights, setWeights] = useState<OfferWeights>(DEFAULT_WEIGHTS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompare(toJobOffer("offer_a", fieldsA), toJobOffer("offer_b", fieldsB), weights);
  };

  const renderOfferBox = (
    title: string,
    badgeBg: string,
    fields: OfferFields,
    setFields: React.Dispatch<React.SetStateAction<OfferFields>>
  ) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-3">
      <div className="border-b border-slate-100 pb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${badgeBg}`}>{title}</span>
        <input
          type="text"
          value={fields.name}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
          className="mt-1 font-bold text-base w-full px-2 py-1 border border-slate-200 rounded focus:ring-1 focus:ring-[#1769E0]"
          placeholder="Şirket veya Pozisyon Adı"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="font-semibold text-slate-700 block mb-0.5">Aylık Brüt Maaş (TL)</label>
          <input type="number" min="0" value={fields.salary} onChange={(e) => setFields({ ...fields, salary: e.target.value })} className="w-full p-2 border rounded border-slate-300" required />
        </div>
        <div>
          <label className="font-semibold text-slate-700 block mb-0.5">Yemek Desteği (TL)</label>
          <input type="number" min="0" value={fields.meal} onChange={(e) => setFields({ ...fields, meal: e.target.value })} className="w-full p-2 border rounded border-slate-300" />
        </div>
        <div>
          <label className="font-semibold text-slate-700 block mb-0.5">Yol / Ulaşım (TL)</label>
          <input type="number" min="0" value={fields.transport} onChange={(e) => setFields({ ...fields, transport: e.target.value })} className="w-full p-2 border rounded border-slate-300" />
        </div>
        <div>
          <label className="font-semibold text-slate-700 block mb-0.5">Yıllık Prim / Bonus (TL)</label>
          <input type="number" min="0" value={fields.bonus} onChange={(e) => setFields({ ...fields, bonus: e.target.value })} className="w-full p-2 border rounded border-slate-300" />
        </div>
        <div>
          <label className="font-semibold text-slate-700 block mb-0.5">Haftalık Saat</label>
          <input type="number" min="20" max="60" value={fields.hours} onChange={(e) => setFields({ ...fields, hours: e.target.value })} className="w-full p-2 border rounded border-slate-300" />
        </div>
        <div>
          <label className="font-semibold text-slate-700 block mb-0.5">Yıllık İzin (Gün)</label>
          <input type="number" min="14" max="60" value={fields.leave} onChange={(e) => setFields({ ...fields, leave: e.target.value })} className="w-full p-2 border rounded border-slate-300" />
        </div>
        <div>
          <label className="font-semibold text-slate-700 block mb-0.5">Çalışma Modeli</label>
          <select value={fields.model} onChange={(e) => setFields({ ...fields, model: e.target.value as WorkModel })} className="w-full p-2 border rounded border-slate-300 bg-white">
            <option value="office">Tam Ofis</option>
            <option value="hybrid">Hibrit</option>
            <option value="remote">Tam Uzaktan</option>
          </select>
        </div>
        <div>
          <label className="font-semibold text-slate-700 block mb-0.5">Gidiş-Dönüş Yol (Dk)</label>
          <input type="number" min="0" max="240" value={fields.commute} onChange={(e) => setFields({ ...fields, commute: e.target.value })} className="w-full p-2 border rounded border-slate-300" />
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-slate-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderOfferBox("1. Seçenek", "bg-blue-50 text-[#1769E0]", fieldsA, setFieldsA)}
        {renderOfferBox("2. Seçenek", "bg-emerald-50 text-emerald-700", fieldsB, setFieldsB)}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Sizin İçin Hangisi Daha Önemli? (Öncelik Ağırlıkları)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1">Maaş: {weights.salary}/5</label>
            <input type="range" min="1" max="5" value={weights.salary} onChange={(e) => setWeights({ ...weights, salary: parseInt(e.target.value) })} className="w-full accent-[#1769E0]" />
          </div>
          <div>
            <label className="block text-slate-600 mb-1">Yan Haklar: {weights.benefits}/5</label>
            <input type="range" min="1" max="5" value={weights.benefits} onChange={(e) => setWeights({ ...weights, benefits: parseInt(e.target.value) })} className="w-full accent-[#1769E0]" />
          </div>
          <div>
            <label className="block text-slate-600 mb-1">İş-Yaşam Dengesi: {weights.workLifeBalance}/5</label>
            <input type="range" min="1" max="5" value={weights.workLifeBalance} onChange={(e) => setWeights({ ...weights, workLifeBalance: parseInt(e.target.value) })} className="w-full accent-[#1769E0]" />
          </div>
          <div>
            <label className="block text-slate-600 mb-1">Uzaktan Esneklik: {weights.flexibility}/5</label>
            <input type="range" min="1" max="5" value={weights.flexibility} onChange={(e) => setWeights({ ...weights, flexibility: parseInt(e.target.value) })} className="w-full accent-[#1769E0]" />
          </div>
        </div>
      </div>

      <button type="submit" className="w-full py-3.5 px-6 bg-[#1769E0] hover:bg-[#123C68] text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-xs min-h-[44px]">
        Teklifleri Kıyasla ve Artı/Eksilerini Gör →
      </button>
    </form>
  );
}
