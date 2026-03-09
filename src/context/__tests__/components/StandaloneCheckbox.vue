<template>
  <div>
    <label v-bind="labelProps">
      <input v-model="inputValue" v-bind="inputProps" type="checkbox" />
      {{ label }}
    </label>
    <div v-if="isTouched">Touched</div>
    <div v-if="isDirty">Dirty</div>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup lang="ts">
  import { useInputContext } from '../../useInputContext';

  withDefaults(
    defineProps<{
      label?: string;
    }>(),
    {
      label: 'Accept terms'
    }
  );

  const model = defineModel<boolean>({ default: false });

  const { inputValue, inputProps, labelProps, isTouched, isDirty, reset } = useInputContext(model);
</script>
