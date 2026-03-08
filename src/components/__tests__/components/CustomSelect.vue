<template>
  <select v-model="model">
    <slot />
  </select>
</template>

<script setup lang="ts">
  const model = defineModel<unknown>();
</script>
