import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';
import type { FieldContext } from '../types';

export const fieldContextKey: InjectionKey<FieldContext> = Symbol('field-context');

export const useFieldContextProvider = (data: FieldContext): void => {
  provide(fieldContextKey, data);
};

/**
 * Retrieves the `FieldContext` provided by the nearest `Field` component ancestor.
 *
 * **Three call signatures:**
 *
 * - `useFieldContext()` — no args. Returns `FieldContext` directly (no `!` needed).
 *   Throws at runtime if called outside a `Field`. Use this for components that
 *   must always be nested inside a `Field` (e.g. `FieldLabel`, `FieldError`).
 *
 * - `useFieldContext(fallback: FieldContext)` — with a fallback object. Returns
 *   `FieldContext` directly (no `!` needed). Use this for components that can work
 *   both inside and outside a `Field` (e.g. standalone inputs with `v-model`).
 *
 * - `useFieldContext(null)` — explicit null. Returns `FieldContext | null`.
 *   Use when you want to handle the absence of context manually.
 *
 * @example
 * // Always inside a Field — throws at runtime if misused:
 * const { labelProps } = useFieldContext();
 *
 * @example
 * // Standalone-capable input — works inside or outside a Field:
 * const model = defineModel<string>({ default: '' });
 * const { inputValue, inputProps } = useFieldContext({ inputValue: model });
 *
 * @example
 * // Manual null-handling:
 * const ctx = useFieldContext(null);
 * if (ctx) { ... }
 *
 * @example
 * // ❌ Wrong — `{}` does not satisfy FieldContext and will cause a type error:
 * const { labelProps } = useFieldContext({});
 */
export function useFieldContext(): FieldContext;
export function useFieldContext(defaultData: null): FieldContext | null;
export function useFieldContext(defaultData: FieldContext): FieldContext;
export function useFieldContext(defaultData?: FieldContext | null): FieldContext | null {
  if (defaultData === undefined) {
    const context = inject(fieldContextKey);
    if (!context) throw new Error('useFieldContext() must be called inside a Field component');
    return context;
  }
  return inject(fieldContextKey, defaultData);
}
