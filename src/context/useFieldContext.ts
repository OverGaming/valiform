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
 * @param defaultData - Fallback value when no `Field` ancestor is found.
 *   - Pass `null` (default) when the component only reads from context and
 *     must always be used inside a `Field`. The return value will be `null`
 *     if no context exists — use the non-null assertion (`!`) when you are
 *     certain the component is always rendered inside a `Field`.
 *   - Pass a partial `FieldContext` (e.g. `{ inputValue: model }`) when the
 *     component can also work standalone. In that case the provided object is
 *     used as fallback and the component handles the nullable fields
 *     defensively.
 *
 * @example
 * // Inside a Field — always has context, assert non-null:
 * const { labelProps } = useFieldContext(null)!;
 *
 * @example
 * // Standalone-capable input — works inside or outside a Field:
 * const model = defineModel<string>({ default: '' });
 * const { inputValue, inputProps } = useFieldContext({ inputValue: model })!;
 *
 * @example
 * // ❌ Wrong — `{}` does not satisfy FieldContext and will cause a type error:
 * const { labelProps } = useFieldContext({});
 */
export const useFieldContext = (defaultData: FieldContext | null = null): FieldContext | null => {
  return inject(fieldContextKey, defaultData);
};
