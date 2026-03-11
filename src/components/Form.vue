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
  import type { FieldState, FormSubmitHelpers } from '../types';

  const emit = defineEmits<{
    submit: [values: Record<string, unknown>, helpers: FormSubmitHelpers];
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

  const setErrors = (input: string | string[] | Record<string, string | string[]>): void => {
    if (typeof input === 'object' && !Array.isArray(input) && input !== null) {
      Object.keys(input).forEach((key) => {
        fields.value[key]?.setErrors(input[key]);
      });
      return;
    }

    errors.value = Array.isArray(input) ? input : [input];
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
