/**
 * rates.json dosyasının TypeScript tip tanımları.
 * Tüm veriler yalnızca bu yapı üzerinden okunur; kod içine sabit yazılmaz.
 */

export interface Meta {
  rules_version: string;
  last_updated: string;
  legal_sources: {
    severance: string;
    notice: string;
    tax: string;
  };
}

export interface StampTax {
  rate: number;
  verified: boolean;
  source_url: string;
}

export interface SeveranceCeilingPeriod {
  period_id: string;
  label: string;
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
  amount_try: number;
  verified: boolean;
  source_url: string;
}

export interface NoticeWeeks {
  less_than_6_months: number;
  from_6_to_18_months: number;
  from_18_to_36_months: number;
  more_than_36_months: number;
  verified: boolean;
}

export interface IncomeTaxRates {
  rates: number[];
  default_rate: number;
  verified: boolean;
}

export interface RatesConfig {
  meta: Meta;
  stamp_tax: StampTax;
  severance_ceiling_periods: SeveranceCeilingPeriod[];
  notice_weeks: NoticeWeeks;
  income_tax_rates_for_estimate: IncomeTaxRates;
}

// Hata kodları
export type ConfigErrorCode =
  | "NO_PERIOD"
  | "PERIOD_UNVERIFIED"
  | "CONFIG_INVALID"
  | "STAMP_TAX_UNVERIFIED"
  | "NOTICE_UNVERIFIED"
  | "INCOME_TAX_UNVERIFIED"
  | "INVALID_DATE";

// Discriminated union sonuç tipi — hesaplama katmanı bu tipi kullanır
export type ConfigResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: ConfigErrorCode; message: string };

// selectCeilingPeriod özelinde sonuç
export type PeriodResult =
  | { ok: true; period: SeveranceCeilingPeriod }
  | { ok: false; code: ConfigErrorCode; message: string };
