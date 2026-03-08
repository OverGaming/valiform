import type { ComputedRef, Ref, ShallowRef, WritableComputedRef } from 'vue';

// ─── Validation ───────────────────────────────────────────────────────────────

export type RuleValue = true | string | string[];

export type ParsedRules = Record<string, RuleValue>;

export type LocaleMessageFn = (args: Record<string, unknown>) => string;

export type LocaleMessage = string | LocaleMessageFn;

export type LocaleMessages = Partial<Record<string, LocaleMessage>>;

export type RuleOptions = {
  args: string[];
  messages: LocaleMessages;
  fields: Record<string, FieldState>;
};

export type RuleFunction = (value: unknown, options: RuleOptions) => true | string | undefined;

export type ValidationResult = true | string[];

// ─── Field ───────────────────────────────────────────────────────────────────

export interface FieldState {
  value: ComputedRef<unknown>;
  isValid: ComputedRef<boolean>;
  isTouched: Ref<boolean>;
  isDirty: Ref<boolean>;
  error: ComputedRef<string | null>;
  errors: ComputedRef<string[]>;
  setErrors: (input: string | string[]) => void;
  reset: () => void;
  validate: () => boolean | void;
}

export type InputProps = {
  id: string;
  name: string;
  modelValue: unknown;
  'aria-invalid': boolean;
  'aria-describedby': string;
  'aria-errormessage': string | undefined;
  'onUpdate:modelValue': (value: unknown) => void;
  onBlur: () => void;
};

export interface FieldContext {
  inputValue: WritableComputedRef<unknown>;
  inputProps: ComputedRef<InputProps>;
  labelProps: { for: string };
  helpProps: { id: string };
  errorProps: { id: string; role: string; 'aria-live': string };
  isValid: ComputedRef<boolean>;
  isTouched: Ref<boolean>;
  isDirty: Ref<boolean>;
  error: ComputedRef<string | null>;
  errors: ComputedRef<string[]>;
  validate: () => boolean | void;
  reset: () => void;
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export interface FormStateContext {
  getFields: () => Record<string, FieldState>;
  getField: (name: string) => FieldState | undefined;
  addField: (name: string, field: FieldState) => void;
  removeField: (name: string) => void;
  setFieldValue: (name: string, value: unknown) => void;
  getFieldValue: (name: string) => unknown;
}

export interface FormContext {
  values: ComputedRef<Record<string, unknown>>;
  isValid: ComputedRef<boolean>;
  error: ComputedRef<string | null>;
  errors: Ref<string[]>;
  fields: Ref<Record<string, FieldState>>;
  reset: () => void;
  setErrors: (...args: unknown[]) => void;
  validate: () => void;
}

// ─── Locale ───────────────────────────────────────────────────────────────────

export interface LocaleContextData {
  locale: Readonly<Ref<string>>;
  locales: Readonly<ShallowRef<Record<string, LocaleMessages>>>;
  setLocale: (locale: string) => void;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export type FormsPluginOptions = {
  locale?: string | Ref<string>;
  locales?: Record<string, LocaleMessages>;
  rules?: Record<string, RuleFunction>;
};
