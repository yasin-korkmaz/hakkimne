export interface ValidateRatesResult {
  ok: boolean;
  errors: string[];
}

export function validateRates(rates: unknown, today?: Date): ValidateRatesResult;
export function run(): void;
