import { computed, inject, ref, toValue, useId } from 'vue';
import type { Ref } from 'vue';
import type { FieldContext } from '../types';
import { fieldContextKey } from './useFieldContext';

/**
 * Creates a dual-mode input context. If the component is inside a `Field`,
 * returns the Field's injected context. If standalone (no Field ancestor),
 * creates a minimal `FieldContext` with sensible defaults using the provided
 * model ref.
 *
 * This is the recommended way to build input components that work both
 * inside `<Field>` and as standalone elements with `v-model`.
 *
 * @param model - A ref from `defineModel()` that holds the input value.
 *   When inside a `Field`, this parameter is ignored (Field owns the value).
 *   When standalone, it is used as the input's reactive value.
 *
 * @example
 * // Works inside <Field> AND standalone — same code, no casts, no `!`:
 * const model = defineModel<string>({ default: '' });
 * const { inputValue, inputProps, error } = useInputContext(model);
 *
 * @example
 * // Boolean (checkbox):
 * const model = defineModel<boolean>({ default: false });
 * const { inputValue, inputProps, labelProps } = useInputContext(model);
 */
export function useInputContext<T>(model: Ref<T>): FieldContext {
  const injected = inject(fieldContextKey, null);

  if (injected) {
    return injected;
  }

  const initialValue = toValue(model);

  const id = useId();
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const isTouched = ref(false);
  const isDirty = ref(false);

  const inputProps = computed(() => ({
    id,
    name: id,
    modelValue: model.value as unknown,
    'aria-invalid': false,
    'aria-describedby': helpId,
    'aria-errormessage': undefined as string | undefined,
    'onUpdate:modelValue': (value: unknown) => {
      model.value = value as T;
      if (!isDirty.value && value !== initialValue) {
        isDirty.value = true;
      }
    },
    onBlur: () => {
      if (!isTouched.value) {
        isTouched.value = true;
      }
    }
  }));

  return {
    inputValue: model,
    inputProps,
    labelProps: { for: id },
    helpProps: { id: helpId },
    errorProps: { id: errorId, role: 'alert', 'aria-live': 'polite' },
    isValid: computed(() => true),
    isTouched,
    isDirty,
    error: computed(() => null),
    errors: computed<string[]>(() => []),
    validate: () => true,
    reset: () => {
      model.value = initialValue;
      isTouched.value = false;
      isDirty.value = false;
    }
  };
}
