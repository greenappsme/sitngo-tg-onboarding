import type { _GenerationFormControlConfig } from '@tok/generation/defineConfig';

export type SubmitFormOption = {
  value: string;
  label: string;
};

export type SubmitFormControl = _GenerationFormControlConfig & {
  options?: SubmitFormOption[];
  defaultValue?: string;
};

export const RENTAL_START_DATE_ID = 'rental_start_date';
export const RENTAL_END_DATE_ID = 'rental_end_date';
export const DEFAULT_RENTAL_DURATION_DAYS = 7;

export const MONTH_OPTIONS: SubmitFormOption[] = [
  { value: '01', label: 'Январь' },
  { value: '02', label: 'Февраль' },
  { value: '03', label: 'Март' },
  { value: '04', label: 'Апрель' },
  { value: '05', label: 'Май' },
  { value: '06', label: 'Июнь' },
  { value: '07', label: 'Июль' },
  { value: '08', label: 'Август' },
  { value: '09', label: 'Сентябрь' },
  { value: '10', label: 'Октябрь' },
  { value: '11', label: 'Ноябрь' },
  { value: '12', label: 'Декабрь' },
];

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function addDaysToIsoDate(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  date.setDate(date.getDate() + days);

  return formatIsoDate(date);
}

export function getDefaultDateValue(fieldId: string): string {
  const today = formatIsoDate(new Date());

  if (fieldId === RENTAL_START_DATE_ID) {
    return today;
  }

  if (fieldId === RENTAL_END_DATE_ID) {
    return addDaysToIsoDate(today, DEFAULT_RENTAL_DURATION_DAYS);
  }

  return today;
}

export function parseIsoDate(isoDate: string) {
  const [year = '', month = '', day = ''] = isoDate.split('-');

  return { year, month, day };
}

export function buildIsoDate(parts: {
  year: string;
  month: string;
  day: string;
}): string {
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getDaysInMonth(year: string, month: string): number {
  return new Date(Number(year), Number(month), 0).getDate();
}

export function getYearOptions(): SubmitFormOption[] {
  const currentYear = new Date().getFullYear();

  return Array.from({ length: 3 }, (_, index) => {
    const year = String(currentYear + index);

    return { value: year, label: year };
  });
}

export function getDayOptions(year: string, month: string): SubmitFormOption[] {
  const daysCount = getDaysInMonth(year, month);

  return Array.from({ length: daysCount }, (_, index) => {
    const day = String(index + 1).padStart(2, '0');

    return { value: day, label: day };
  });
}

export function normalizeDateParts(parts: {
  year: string;
  month: string;
  day: string;
}): { year: string; month: string; day: string } {
  const daysCount = getDaysInMonth(parts.year, parts.month);
  const day = Math.min(Number(parts.day), daysCount);

  return {
    year: parts.year,
    month: parts.month,
    day: String(day).padStart(2, '0'),
  };
}

export function getSubmitFormOptions(control: SubmitFormControl): SubmitFormOption[] {
  return control.options ?? [];
}

export function getSubmitFormInitialValue(
  control: SubmitFormControl,
  storedValue: unknown
): unknown {
  if (storedValue !== undefined && storedValue !== null && storedValue !== '') {
    return storedValue;
  }

  if (control.defaultValue !== undefined) {
    return control.defaultValue;
  }

  if (control.type === 'checkbox') {
    return false;
  }

  if (control.type === 'select' || control.type === 'radio') {
    return control.options?.[0]?.value ?? null;
  }

  if (control.type === 'date') {
    return getDefaultDateValue(control.id);
  }

  return null;
}

export function getSubmitFormOptionLabel(
  control: SubmitFormControl,
  value: unknown
): string {
  const option = control.options?.find((item) => item.value === value);

  return option?.label ?? String(value ?? '');
}

export function getDateMinValue(fieldId: string, startDate: unknown): string {
  if (fieldId === RENTAL_END_DATE_ID && typeof startDate === 'string' && startDate) {
    return startDate;
  }

  return formatIsoDate(new Date());
}

export function isDateBefore(left: string, right: string): boolean {
  return left < right;
}
