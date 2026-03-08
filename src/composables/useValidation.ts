import { ref, readonly, toValue, computed } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';
import { validateFunction, validateStringRules } from '../validation';
import { watchDebounced } from '@vueuse/core';
import { parseRules } from '../utils/parseRules';
import type { FieldState, LocaleMessages } from '../types';

type UseValidationOptions = {
  rules?: MaybeRefOrGetter<string | ((value: unknown) => unknown) | null>;
  messages?: MaybeRefOrGetter<LocaleMessages>;
  fields?: MaybeRefOrGetter<Record<string, FieldState>>;
};

export function useValidation(
  valueRef: MaybeRefOrGetter<unknown>,
  options: UseValidationOptions = {}
) {
  const isValid = ref(true);
  const isResetting = ref(false);
  const errors: Ref<string[]> = ref([]);
  const resetTimeoutId: Ref<ReturnType<typeof setTimeout> | null> = ref(null);

  const rules = computed(() => toValue(options.rules) ?? null);
  const messages = computed(() => toValue(options.messages) ?? {});
  const fields = computed(() => toValue(options.fields) ?? {});

  const confirmTargetValue = computed(() => {
    if (!rules.value || typeof rules.value !== 'string') return null;

    const parsedRules = parseRules(rules.value);
    const targetFieldName = parsedRules.confirm;

    if (!targetFieldName || targetFieldName === true) return null;

    const targetField = fields.value[targetFieldName as string];
    // fields.value is a reactive proxy — FieldState.value is auto-unwrapped to its computed value
    return (targetField as unknown as Record<string, unknown>)?.value ?? null;
  });

  const validate = (): boolean => {
    let result;

    if (typeof rules.value === 'function') {
      result = validateFunction(toValue(valueRef), rules.value);
    } else {
      result = validateStringRules(
        toValue(valueRef),
        rules.value as string | null,
        messages.value,
        fields.value
      );
    }

    if (result === true) {
      isValid.value = true;
      errors.value = [];
      return true;
    } else if (Array.isArray(result)) {
      isValid.value = false;
      errors.value = result;
      return false;
    }

    return result;
  };

  const reset = (): void => {
    if (resetTimeoutId.value) {
      clearTimeout(resetTimeoutId.value);
    }

    isResetting.value = true;
    isValid.value = true;
    errors.value = [];

    resetTimeoutId.value = setTimeout(() => {
      isResetting.value = false;
      resetTimeoutId.value = null;
    }, 1000);
  };

  watchDebounced(
    () => toValue(valueRef),
    () => {
      if (isResetting.value) return;
      validate();
    },
    { debounce: 300 }
  );

  watchDebounced(
    () => toValue(confirmTargetValue),
    () => {
      if (isResetting.value) return;
      if (!toValue(valueRef)) return;
      validate();
    },
    { debounce: 300 }
  );

  return {
    validate,
    reset,
    isValid: readonly(isValid),
    errors: readonly(errors)
  };
}
