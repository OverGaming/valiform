<template>
  <input v-model.trim="inputValue" v-bind="inputProps" />
</template>

<script setup lang="ts">
  import { useInputContext } from '../../useInputContext';

  const model = defineModel<unknown>({ default: '' });

  const { inputValue, inputProps } = useInputContext(model);
</script>
