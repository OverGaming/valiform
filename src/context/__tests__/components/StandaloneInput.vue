<template>
  <div>
    <label :for="inputProps.id">{{ label }}</label>
    <input v-model.trim="inputValue" v-bind="inputProps" :placeholder="label" />
    <p v-bind="helpProps">{{ helpText }}</p>
    <p v-if="error" v-bind="errorProps">{{ error }}</p>
    <button @click="reset">Reset</button>
    <div v-if="isValid">Valid</div>
    <div v-if="isTouched">Touched</div>
    <div v-if="isDirty">Dirty</div>
  </div>
</template>

<script setup lang="ts">
  import { useInputContext } from '../../useInputContext';

  withDefaults(
    defineProps<{
      label?: string;
      helpText?: string;
    }>(),
    {
      label: 'Name',
      helpText: 'Enter your name'
    }
  );

  const model = defineModel<string>({ default: '' });

  const { inputValue, inputProps, helpProps, errorProps, error, isValid, isTouched, isDirty, reset } =
    useInputContext(model);
</script>
