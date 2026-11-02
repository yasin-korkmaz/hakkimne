"use client";

import React, { useState } from "react";
import type { InterviewRole, InterviewQuestion, InterviewEvaluation } from "./types";
import {
  ROLE_LABELS,
  INTERVIEW_QUESTIONS,
  evaluateInterviewAnswer,
} from "./interviewEngine";

export default function InterviewSimulator() {
  const [selectedRole, setSelectedRole] = useState<InterviewRole>("software_engineer");
  const questions = INTERVIEW_QUESTIONS[selectedRole] || [];
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const activeQuestion: InterviewQuestion | undefined = questions[currentQuestionIdx];

  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);

  const handleRoleChange = (role: InterviewRole) => {
    setSelectedRole(role);
    setCurrentQuestionIdx(0);
    setAnswer("");
    setEvaluation(null);
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    const ev = evaluateInterviewAnswer(answer);
    setEvaluation(ev);
  };

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col gap-6 text-slate-900">
      {/* 1. Pozisyon / Rol Seçici */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Hedeflediğiniz Pozisyonu Seçin:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(ROLE_LABELS) as InterviewRole[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleChange(role)}
              className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all min-h-[44px] ${
                selectedRole === role
                  ? "border-[#1769E0] bg-blue-50/60 text-[#1769E0] ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
              }`}
            >
              {ROLE_LABELS[role]}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Soru Kartı */}
      {activeQuestion && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-50 text-[#1769E0] rounded-md">
              {activeQuestion.category === "behavioral" ? "Davranışsal Soru" : activeQuestion.category === "technical" ? "Teknik Yaklaşım" : "Vaka / Senaryo"}
            </span>
            <span className="text-xs text-slate-500">
              Soru {currentQuestionIdx + 1} / {questions.length}
            </span>
          </div>

          <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
            "{activeQuestion.questionText}"
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl">
            💡 <strong>İpucu:</strong> {activeQuestion.contextHint}
          </p>
        </div>
      )}

      {/* 3. Yanıt Formu veya Değerlendirme */}
      {!evaluation ? (
        <form onSubmit={handleEvaluate} className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Cevabınızı STAR yöntemiyle (Durum, Görev, Eylem, Sonuç) yazın:</span>
            <span>{wordCount} kelime</span>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            placeholder="Örn: Çalıştığım önceki şirkette canlı sisteme geçiş sırasında... Görevim kök nedeni bulmaktı... Şu adımları attım... Neticede %25 oranında..."
            className="w-full p-4 border border-slate-300 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-[#1769E0] focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={!answer.trim()}
            className="w-full py-3.5 px-6 bg-[#1769E0] hover:bg-[#123C68] disabled:opacity-50 text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-xs min-h-[44px]"
          >
            Mülakat Cevabımı Değerlendir →
          </button>
        </form>
      ) : (
        /* Değerlendirme Raporu */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                Mülakat Değerlendirmesi
              </span>
              <h4 className="font-bold text-lg text-slate-900 mt-1">STAR Metodu & Yetkinlik Analizi</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Genel Skor</span>
              <span className="text-2xl font-extrabold text-[#1769E0]">{evaluation.overallScore}/100</span>
            </div>
          </div>

          {/* STAR Rozetleri */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-xl border ${evaluation.starEvaluation.hasSituation ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
              {evaluation.starEvaluation.hasSituation ? "✓ S - Durum" : "✕ S - Durum"}
            </div>
            <div className={`p-2.5 rounded-xl border ${evaluation.starEvaluation.hasTask ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
              {evaluation.starEvaluation.hasTask ? "✓ T - Görev" : "✕ T - Görev"}
            </div>
            <div className={`p-2.5 rounded-xl border ${evaluation.starEvaluation.hasAction ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
              {evaluation.starEvaluation.hasAction ? "✓ A - Eylem" : "✕ A - Eylem"}
            </div>
            <div className={`p-2.5 rounded-xl border ${evaluation.starEvaluation.hasResult ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
              {evaluation.starEvaluation.hasResult ? "✓ R - Sonuç" : "✕ R - Sonuç"}
            </div>
          </div>

          {/* Genel Tavsiye */}
          <p className="text-xs sm:text-sm text-slate-700 bg-blue-50/60 border border-blue-200/60 p-3.5 rounded-xl leading-relaxed">
            {evaluation.generalFeedback}
          </p>

          {/* Güçlü ve Geliştirilecek Yönler */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-emerald-800 block mb-1.5">Öne Çıkan Güçlü Yönler:</span>
              <ul className="flex flex-col gap-1 text-slate-700">
                {evaluation.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-bold text-[#1769E0] block mb-1.5">Geliştirme Tavsiyeleri:</span>
              <ul className="flex flex-col gap-1 text-slate-700">
                {evaluation.improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5"><span className="text-[#1769E0] font-bold">•</span> {imp}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              onClick={() => { setEvaluation(null); setAnswer(""); }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Yeniden Cevapla / Başka Soru
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
