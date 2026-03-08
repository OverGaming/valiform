<template>
  <p>Locale: {{ locale }}</p>
  <button @click.prevent="setLocale('en')">English</button>
  <button @click.prevent="setLocale('es')">Español</button>

  <Form v-slot="state" v-model="form" @submit="handleSubmit">
    <p v-if="state.isValid">Valid</p>

    <Field v-slot="field" name="name" validation="required|min:3">
      <label v-bind="field.labelProps">Name</label>
      <CustomInput v-bind="field.inputProps" placeholder="Enter your full name" />
      <p v-bind="field.helpProps">Write your full name</p>
      <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
    </Field>

    <Field v-slot="field" name="email" validation="required|email">
      <label v-bind="field.labelProps">Email</label>
      <CustomInput v-bind="field.inputProps" type="email" placeholder="your@email.com" />
      <p v-bind="field.helpProps">Write a correct email</p>
      <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
    </Field>

    <Field
      v-slot="field"
      name="password"
      validation="required|containsNumeric|containsUppercase|containsLowercase|containsSymbol|min:8"
    >
      <label v-bind="field.labelProps">Password</label>
      <CustomInput v-bind="field.inputProps" placeholder="Enter your password" />
      <p v-bind="field.helpProps">Create a password</p>
      <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
    </Field>

    <Field
      v-slot="field"
      name="confirmPassword"
      validation="required|confirm:password"
      :validation-messages="{
        confirm: 'Passwords do not match'
      }"
    >
      <label v-bind="field.labelProps">Confirm Password</label>
      <CustomInput v-bind="field.inputProps" placeholder="Confirm your password" />
      <p v-bind="field.helpProps">Repeat your password</p>
      <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
    </Field>

    <button type="submit">Submit</button>
    <button type="reset" @click.prevent="state.reset">Reset</button>

    <p v-if="state.error">Error: {{ state.error }}</p>
    <div v-if="state.errors.length">
      <p>Errors:</p>
      <ul>
        <li v-for="(err, index) in state.errors" :key="index">{{ err }}</li>
      </ul>
    </div>

    <button @click.prevent="() => state.setErrors(['Error 1', 'Error 2'])">Set Error</button>

    <slot v-bind="state" />
  </Form>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import Form from '../../Form.vue'
  import Field from '../../Field.vue'
  import CustomInput from './CustomInput.vue'
  import { useLocale } from '../../../composables/useLocale'

  interface FormValues {
    name: string
    email: string
    password: string
    confirmPassword: string
  }

  const props = withDefaults(
    defineProps<{
      handleSubmit?: (
        values: Record<string, unknown>,
        helpers: { setErrors: (...args: unknown[]) => void; reset: () => void }
      ) => void
      initialValues?: FormValues
    }>(),
    {
      handleSubmit: () => {},
      initialValues: () => ({ name: '', email: '', password: '', confirmPassword: '' })
    }
  )

  const { locale, setLocale } = useLocale()

  const form = ref(props.initialValues)
</script>
