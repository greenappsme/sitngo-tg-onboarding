import type { _GenerationFormControlConfig } from '@tok/generation/defineConfig';

export type SubmitFormOption = {
  value: string;
  label: string;
};

export type SubmitFormControl = _GenerationFormControlConfig & {
  options?: SubmitFormOption[];
  defaultValue?: string;
};

export function getSubmitFormOptions(control: SubmitFormControl): SubmitFormOption[] {
  return control.options ?? [];
}

export function getSubmitFormInitialValue(
  control: SubmitFormControl,
  storedValue: unknown
): unknown {
  if (storedValue !== undefined && storedValue !== null) {
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
    return '';
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
