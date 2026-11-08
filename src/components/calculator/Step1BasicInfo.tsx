"use client";

import React from "react";
import { ReasonSelectField, NoticeUsedField } from "../FormSelectFields";
import { DateInputField } from "../FormInputFields";

/**
 * Step1BasicInfo.tsx — 1. Adım: Fesih Nedeni ve Hizmet Tarihleri
 * Dayanak: 1475 sayılı Kanun md. 14 (hizmet süresi) & 4857 sayılı Kanun md. 17, 24, 25.
 */

interface Step1BasicInfoProps {
  formData: {
    reason: string;
    noticeUsed: string;
    startIso: string;
    exitIso: string;
  };
  errors: Record<string, string>;
  showNoticeFields: boolean;
  refs: {
    reason: React.RefObject<HTMLSelectElement | null>;
    noticeUsed: React.RefObject<HTMLSelectElement | null>;
    startIso: React.RefObject<HTMLInputElement | null>;
    exitIso: React.RefObject<HTMLInputElement | null>;
  };
  onChange: (field: string, value: string) => void;
}

export default function Step1BasicInfo({
  formData,
  errors,
  showNoticeFields,
  refs,
  onChange,
}: Step1BasicInfoProps) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      <div className="border-b border-slate-100 pb-2 mb-1">
        <h3 className="text-base font-bold text-slate-900">1. Adım: Temel Bilgiler</h3>
        <p className="text-xs text-slate-500">
          İşten ayrılış nedeninizi ve çalışma döneminizi eksiksiz giriniz.
        </p>
      </div>

      {/* 1. Fesih Nedeni */}
      <ReasonSelectField
        value={formData.reason}
        error={errors.reason}
        selectRef={refs.reason as React.RefObject<HTMLSelectElement>}
        onChange={(val) => onChange("reason", val)}
      />

      {/* 2. İhbar Öneli (Yalnızca haksız fesih durumunda) */}
      {showNoticeFields && (
        <NoticeUsedField
          value={formData.noticeUsed}
          error={errors.noticeUsed}
          selectRef={refs.noticeUsed as React.RefObject<HTMLSelectElement>}
          onChange={(val) => onChange("noticeUsed", val)}
        />
      )}

      {/* 3. İşe Giriş ve İşten Çıkış Tarihleri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <DateInputField
          id="startIso"
          label="İşe Giriş Tarihi *"
          value={formData.startIso}
          error={errors.startIso}
          inputRef={refs.startIso as React.RefObject<HTMLInputElement>}
          onChange={(val) => onChange("startIso", val)}
        />
        <DateInputField
          id="exitIso"
          label="İşten Çıkış Tarihi *"
          value={formData.exitIso}
          error={errors.exitIso}
          inputRef={refs.exitIso as React.RefObject<HTMLInputElement>}
          onChange={(val) => onChange("exitIso", val)}
        />
      </div>
    </div>
  );
}
