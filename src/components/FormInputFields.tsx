import React from "react";

export function MoneyInputField({
  id,
  label,
  description,
  value,
  placeholder,
  error,
  inputRef,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  value: string;
  placeholder?: string;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onChange: (value: string) => void;
}) {
  const descId = `${id}-desc`;
  const errId = `${id}-err`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-gray-900">
        {label}
      </label>
      <span id={descId} className="text-xs text-gray-600">
        {description}
      </span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={error ? `${descId} ${errId}` : descId}
        aria-invalid={!!error}
        placeholder={placeholder}
        className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
      />
      {error && (
        <span id={errId} role="alert" className="text-xs text-red-600 font-medium">
          {error}
        </span>
      )}
    </div>
  );
}

export function DateInputField({
  id,
  label,
  value,
  error,
  inputRef,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onChange: (value: string) => void;
}) {
  const errId = `${id}-err`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-gray-900">
        {label}
      </label>
      <input
        id={id}
        type="date"
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
      />
      {error && (
        <span id={errId} role="alert" className="text-xs text-red-600 font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
