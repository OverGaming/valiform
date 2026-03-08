<template>
  <p>Locale: {{ locale }}</p>
  <button @click.prevent="setLocale('en')">English</button>
  <button @click.prevent="setLocale('es')">Español</button>

  <Form v-slot="state" v-model="form" :handle-submit="handleSubmit">
    <p v-if="state.isValid">Valid</p>

    <Field v-slot="field" name="user.firstName" validation="required|min:2">
      <label v-bind="field.labelProps">First Name</label>
      <CustomInput v-bind="field.inputProps" placeholder="Enter first name" />
      <p v-bind="field.helpProps">Enter your first name</p>
      <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
    </Field>

    <Field v-slot="field" name="user.lastName" validation="required|min:2">
      <label v-bind="field.labelProps">Last Name</label>
      <CustomInput v-bind="field.inputProps" placeholder="Enter last name" />
      <p v-bind="field.helpProps">Enter your last name</p>
      <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
    </Field>

    <Field v-slot="field" name="user.email" validation="required|email">
      <label v-bind="field.labelProps">Email</label>
      <CustomInput v-bind="field.inputProps" type="email" placeholder="your@email.com" />
      <p v-bind="field.helpProps">Enter a valid email address</p>
      <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
    </Field>

    <Field v-slot="field" name="address.street" validation="required|min:5">
      <label v-bind="field.labelProps">Street Address</label>
      <CustomInput v-bind="field.inputProps" placeholder="123 Main Street" />
      <p v-bind="field.helpProps">Enter your street address</p>
      <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
    </Field>

    <Field v-slot="field" name="address.city" validation="required|min:2">
      <label v-bind="field.labelProps">City</label>
      <CustomInput v-bind="field.inputProps" placeholder="Enter city" />
      <p v-bind="field.helpProps">Enter your city</p>
      <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
    </Field>

    <Field v-slot="field" name="address.postalCode" validation="required|min:3">
      <label v-bind="field.labelProps">Postal Code</label>
      <CustomInput v-bind="field.inputProps" placeholder="12345" />
      <p v-bind="field.helpProps">Enter your postal code</p>
      <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
    </Field>

    <div>
      <h3>Skills</h3>
      <div v-for="(_, index) in form.skills" :key="index">
        <Field v-slot="field" :name="`skills.${index}.name`" validation="required|min:2">
          <label v-bind="field.labelProps">Skill Name</label>
          <CustomInput v-bind="field.inputProps" placeholder="e.g., JavaScript" />
          <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
        </Field>

        <Field
          v-slot="field"
          :name="`skills.${index}.level`"
          validation="required|is:beginner,intermediate,advanced,expert"
        >
          <label v-bind="field.labelProps">Level</label>
          <CustomSelect v-bind="field.inputProps">
            <option value="">Select level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </CustomSelect>
          <p v-if="field.error" v-bind="field.errorProps">{{ field.error }}</p>
        </Field>

        <button type="button" @click="removeSkill(index)">Remove Skill</button>
      </div>

      <button type="button" @click="addSkill">Add Skill</button>
    </div>

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
  import CustomSelect from './CustomSelect.vue'

  interface Skill {
    name: string
    level: string
  }

  interface FormValues {
    user: { firstName: string; lastName: string; email: string }
    address: { street: string; city: string; postalCode: string }
    skills: Skill[]
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
      initialValues: () => ({
        user: { firstName: '', lastName: '', email: '' },
        address: { street: '', city: '', postalCode: '' },
        skills: [{ name: '', level: '' }]
      })
    }
  )

  const { locale, setLocale } = useLocale()

  const form = ref(props.initialValues)

  function addSkill() {
    form.value.skills.push({ name: '', level: '' })
  }

  function removeSkill(index: number) {
    if (form.value.skills.length > 1) {
      form.value.skills.splice(index, 1)
    }
  }
</script>
