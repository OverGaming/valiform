<template>
  <div>
    <slot
      v-bind="{
        inputValue,
        inputProps,
        labelProps,
        helpProps,
        errorProps,
        isValid,
        isTouched,
        isDirty,
        error,
        errors,
        validate: _validation.validate,
        reset
      }"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, useId, toValue, onMounted, onUnmounted, watch } from 'vue';
  import type { ComputedRef } from 'vue';
  import { useValidation } from '../composables/useValidation';
  import { useFormStateContext } from '../context/useFormStateContext';
  import { useFieldContextProvider } from '../context/useFieldContext';
  import { useLocaleContext } from '../context/useLocaleContext';
  import type { LocaleMessage } from '../types';

  const props = defineProps<{
    id?: string | null;
    name: string;
    validation?: string | ((value: unknown) => unknown) | null;
    validationMessages?: Record<string, unknown> | null;
    error?: string | string[] | null;
  }>();

  const model = defineModel<unknown>();

  const generatedId = useId();
  const formStateContext = useFormStateContext();
  const localeContext = useLocaleContext();

  const inputValue = computed<unknown>({
    get: () => {
      if (formStateContext) {
        return formStateContext.getFieldValue(props.name);
      }
      return model.value;
    },
    set: (value) => {
      if (formStateContext) {
        formStateContext.setFieldValue(props.name, value);
      } else {
        model.value = value;
      }
    }
  });

  const rules = computed(() => props.validation ?? null);
  const messages = computed(() => ({
    ...(localeContext ? localeContext.locales.value[localeContext.locale.value] : {}),
    ...(props.validationMessages ?? {})
  })) as ComputedRef<Partial<Record<string, LocaleMessage>>>;
  const fields = computed({
    get: () => (formStateContext ? formStateContext.getFields() : {}),
    set: () => {}
  });

  const _validation = useValidation(inputValue, { rules, messages, fields });

  const isTouched = ref(false);
  const isDirty = ref(false);
  const manualErrors = ref<string[]>([]);

  const value = computed(() => inputValue.value ?? null);
  const isValid = computed(() => _validation.isValid.value && manualErrors.value.length === 0);
  const errors = computed(() => [..._validation.errors.value, ...manualErrors.value]);
  const error = computed(() => errors.value[0] ?? null);

  const initialValue = toValue(inputValue);
  const id = props.id ?? generatedId;
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const setErrors = (errorInput: string | string[]): void => {
    manualErrors.value = Array.isArray(errorInput) ? errorInput : [errorInput];
  };

  const reset = (): void => {
    inputValue.value = initialValue;
    isTouched.value = false;
    isDirty.value = false;
    manualErrors.value = [];
    _validation.reset();
  };

  watch(
    () => props.error,
    (newError) => {
      if (newError) {
        manualErrors.value = Array.isArray(newError) ? newError : [newError];
      } else {
        manualErrors.value = [];
      }
    },
    { immediate: true }
  );

  const inputProps = computed(() => ({
    id,
    name: props.name,
    modelValue: inputValue.value,
    'aria-invalid': !!error.value,
    'aria-describedby': error.value ? `${errorId} ${helpId}` : helpId,
    'aria-errormessage': error.value ? errorId : undefined,
    'onUpdate:modelValue': (value: unknown) => {
      inputValue.value = value;
      if (!isDirty.value && value !== initialValue) {
        isDirty.value = true;
      }
      if (manualErrors.value.length > 0) {
        manualErrors.value = [];
      }
    },
    onBlur: () => {
      if (!isTouched.value) {
        isTouched.value = true;
        _validation.validate();
      }
    }
  }));

  const labelProps = { for: id };
  const errorProps = { id: errorId, role: 'alert' as const, 'aria-live': 'polite' as const };
  const helpProps = { id: helpId };

  onMounted(() => {
    if (formStateContext) {
      formStateContext.addField(props.name, {
        value,
        isValid,
        isTouched,
        isDirty,
        error,
        errors,
        setErrors,
        reset,
        validate: _validation.validate
      });
    }
  });

  onUnmounted(() => {
    if (formStateContext) {
      formStateContext.removeField(props.name);
    }
  });

  useFieldContextProvider({
    inputValue,
    inputProps,
    labelProps,
    helpProps,
    errorProps,
    isValid,
    isTouched,
    isDirty,
    error,
    errors,
    validate: _validation.validate,
    reset
  });
</script>
