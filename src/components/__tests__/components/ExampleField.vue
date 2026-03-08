<template>
  <Field v-slot="field" v-model="value" :name="name ?? 'name'" :validation="validation ?? null" :validation-messages="validationMessages ?? null">
    <label v-bind="field.labelProps">Name</label>
    <CustomInput v-bind="field.inputProps" placeholder="Enter your full name" />
    <p v-bind="field.helpProps">Write your full name</p>
    <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
    <button @click="field.reset">Reset</button>
    <div v-if="field.isValid">Valid</div>
    <div v-if="field.isTouched">Touched</div>
    <div v-if="field.isDirty">Dirty</div>
    <button @click="changeLocale">Change locale</button>
    <slot v-bind="field" />
  </Field>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import Field from '../../Field.vue'
  import CustomInput from './CustomInput.vue'
  import { useLocale } from '../../../composables/useLocale'

  const props = withDefaults(
    defineProps<{
      name?: string
      initialValue?: string
      validation?: string | ((value: unknown) => unknown) | null
      validationMessages?: Record<string, unknown> | null
    }>(),
    {
      name: 'name',
      initialValue: '',
      validation: null,
      validationMessages: null
    }
  )

  const { locale, setLocale } = useLocale()

  const changeLocale = () => {
    setLocale(locale.value === 'en' ? 'es' : 'en')
  }

  const value = ref(props.initialValue)
</script>
