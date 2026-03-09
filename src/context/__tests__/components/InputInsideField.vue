<template>
  <Field
    v-model="value"
    name="name"
    :validation="validation ?? null"
    :validation-messages="validationMessages ?? null"
  >
    <template #default="field">
      <label v-bind="field.labelProps">Name</label>
      <FieldInput v-bind="field.inputProps" />
      <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
      <div v-if="field.isValid">Valid</div>
      <div v-if="field.isTouched">Touched</div>
      <div v-if="field.isDirty">Dirty</div>
    </template>
  </Field>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Field from '../../../components/Field.vue';
  import FieldInput from './FieldInput.vue';

  withDefaults(
    defineProps<{
      validation?: string | null;
      validationMessages?: Record<string, unknown> | null;
    }>(),
    {
      validation: null,
      validationMessages: null
    }
  );

  const value = ref('');
</script>
