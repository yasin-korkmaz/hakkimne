"use client";

/**
 * NoticePeriodForm.tsx — İhbar Süresi ve Olası Bitiş Tarihi Formu
 * Dayanak: 4857 Sayılı İş Kanunu Madde 17
 */

import React, { useState, useRef } from "react";
import { DateInputField } from "@/components/FormInputFields";

export interface NoticePeriodFormData {
  startDate: string;
  notificationDate: string;
}

interface NoticePeriodFormProps {
  onCalculate: (data: NoticePeriodFormData) => void;
  onReset?: () => void;
}

const INITIAL_STATE: NoticePeriodFormData = {
  startDate: "",
  notificationDate: "",
};

function validateNoticePeriodForm(data: NoticePeriodFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.startDate) {
    errors.startDate = "İşe giriş tarihi zorunludur.";
  }
  if (!data.notificationDate) {
    errors.notificationDate = "Bildirim / fesih tarihi zorunludur.";
  }
  if (data.startDate && data.notificationDate && data.notificationDate < data.startDate) {
    errors.notificationDate = "Bildirim tarihi işe giriş tarihinden önce olamaz.";
  }

  return errors;
}

export default function NoticePeriodForm({ onCalculate, onReset }: NoticePeriodFormProps) {
  const [formData, setFormData] = useState<NoticePeriodFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const startRef = useRef<HTMLInputElement>(null);
  const notifyRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof NoticePeriodFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateNoticePeriodForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.startDate) startRef.current?.focus();
      else if (validationErrors.notificationDate) notifyRef.current?.focus();
      return;
    }

    setErrors({});
    onCalculate(formData);
  };

  const handleReset = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full max-w-xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. İşe Giriş Tarihi */}
        <DateInputField
          id="npStartDate"
          label="İşe Giriş Tarihi *"
          value={formData.startDate}
          error={errors.startDate}
          inputRef={startRef}
          onChange={(val) => handleChange("startDate", val)}
        />

        {/* 2. Bildirim / İstifa Tarihi */}
        <DateInputField
          id="npNotificationDate"
          label="Bildirim / İstifa Tarihi *"
          value={formData.notificationDate}
          error={errors.notificationDate}
          inputRef={notifyRef}
          onChange={(val) => handleChange("notificationDate", val)}
        />
      </div>

      <span className="text-xs text-gray-500">
        * İhbar süresi, fesih bildiriminin işverene veya işçiye ulaştığı günün ertesi gününden itibaren işlemeye başlar.
      </span>

      {/* Butonlar */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          className="min-h-[44px] flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-sm shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          Hesapla
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="min-h-[44px] px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md text-sm transition-colors focus:ring-2 focus:ring-gray-400 focus:outline-none"
        >
          Temizle
        </button>
      </div>
    </form>
  );
}
