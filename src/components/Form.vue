<template>
  <form @submit.prevent="onSubmit">
    <slot
      v-bind="{
        isValid,
        error,
        errors,
        values,
        fields,
        reset,
        setErrors,
        validate
      }"
    />
  </form>
</template>

<script setup lang="ts">
  import { ref, computed, reactive, isReactive } from 'vue';
  import { useFormStateContextProvider } from '../context/useFormStateContext';
  import { useFormContextProvider } from '../context/useFormContext';
  import { getValueByPath, setValueByPath } from '../utils/valueByPath';
  import type { FieldState } from '../types';

  const emit = defineEmits<{
    submit: [
      values: Record<string, unknown>,
      helpers: { setErrors: typeof setErrors; reset: typeof reset }
    ];
  }>();

  const model = defineModel<Record<string, unknown>>({
    default: () => ({})
  });

  if (!isReactive(model.value)) {
    model.value = reactive(model.value ?? {});
  }

  const fields = ref<Record<string, FieldState>>({});
  const errors = ref<string[]>([]);

  const values = computed(() => model.value);
  const error = computed(() => errors.value[0] ?? null);
  const isValid = computed(() =>
    Object.keys(fields.value).every((name) => fields.value[name].isValid as unknown as boolean)
  );

  const validate = (): void => {
    Object.keys(fields.value).forEach((name) => {
      fields.value[name].validate?.();
    });
  };

  const onSubmit = (): void => {
    validate();
    if (!isValid.value) return;
    errors.value = [];
    emit('submit', model.value, { setErrors, reset });
  };

  const setErrors = (...args: unknown[]): void => {
    if (args.length === 1) {
      const errorInput = args[0];

      if (typeof errorInput === 'object' && !Array.isArray(errorInput) && errorInput !== null) {
        Object.keys(errorInput as Record<string, unknown>).forEach((key) => {
          setErrors(key, (errorInput as Record<string, unknown>)[key]);
        });
        return;
      }

      errors.value = Array.isArray(errorInput) ? (errorInput as string[]) : [errorInput as string];
    } else if (args.length === 2) {
      const [fieldName, errorInput] = args as [string, string | string[]];
      fields.value[fieldName]?.setErrors(errorInput);
    }
  };

  const reset = (): void => {
    errors.value = [];
    Object.keys(fields.value).forEach((name) => {
      fields.value[name].reset();
    });
  };

  useFormStateContextProvider({
    getFields() {
      return fields.value;
    },
    getField(name: string) {
      return fields.value[name];
    },
    addField(name: string, field: FieldState) {
      fields.value[name] = field;
    },
    removeField(name: string) {
      delete fields.value[name];
    },
    setFieldValue(name: string, value: unknown) {
      setValueByPath(model.value as Record<string, unknown>, name, value);
    },
    getFieldValue(name: string) {
      return getValueByPath(model.value as Record<string, unknown>, name);
    }
  });

  useFormContextProvider({
    values,
    isValid,
    error,
    errors,
    fields,
    reset,
    setErrors,
    validate
  });
</script>
