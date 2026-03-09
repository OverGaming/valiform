# Valiform

Lightweight, headless form validation library for Vue 3. Framework-agnostic validation rules, composable field state, and full localization support — with zero UI assumptions.

## Installation

```bash
npm install @overgaming/valiform
```

## Setup

### Vue

```ts
import { createApp } from 'vue';
import { FormsPlugin, es } from '@overgaming/valiform';

const app = createApp(App);

app.use(FormsPlugin, {
  locale: 'es',
  locales: { es }
});
```

### Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@overgaming/valiform/nuxt'],
  valiform: {
    locale: 'es',
    locales: { es }
  }
});
```

The Nuxt module auto-imports `<Form>`, `<Field>`, `useLocale`, `useFormContext` and `useFieldContext`.

---

## Usage

### With custom components (recommended)

Build a custom input component using `useFieldContext` and `defineModel`:

```vue
<!-- MyInput.vue -->
<template>
  <input
    class="my-input"
    :class="{ 'my-input--error': error }"
    v-model.trim="inputValue"
    v-bind="inputProps"
    :type
  />
</template>

<script setup lang="ts">
  import { useFieldContext } from '@overgaming/valiform';

  withDefaults(defineProps<{ type?: string }>(), { type: 'text' });

  const model = defineModel<string>({ default: '' });
  const { inputValue, inputProps, error } = useFieldContext({ inputValue: model });
</script>
```

Then use it inside a `<Field>`:

```vue
<template>
  <Form v-model="formData" @submit="handleSubmit" v-slot="{ isValid }">
    <Field
      name="name"
      validation="required|min:3"
      v-slot="{ labelProps, errorProps, error, isTouched }"
    >
      <label v-bind="labelProps">Name</label>
      <MyInput />
      <span v-if="error && isTouched" v-bind="errorProps">{{ error }}</span>
    </Field>

    <button type="submit" :disabled="!isValid">Submit</button>
  </Form>
</template>
```

---

## Components

### `<Form>`

Wraps your form and manages the global form state.

| Prop         | Type                      | Description                      |
| ------------ | ------------------------- | -------------------------------- |
| `modelValue` | `Record<string, unknown>` | Form values (use with `v-model`) |

| Event    | Payload                          | Description                  |
| -------- | -------------------------------- | ---------------------------- |
| `submit` | `(values, { setErrors, reset })` | Emitted on valid form submit |

| Slot prop  | Type         | Description                         |
| ---------- | ------------ | ----------------------------------- |
| `isValid`  | `boolean`    | Whether all fields are valid        |
| `errors`   | `string[]`   | Array of all form-level errors      |
| `reset`    | `() => void` | Resets all fields to initial values |
| `validate` | `() => void` | Triggers validation on all fields   |

### `<Field>`

Manages a single field's state and validation.

| Prop                 | Type                      | Description                             |
| -------------------- | ------------------------- | --------------------------------------- |
| `name`               | `string`                  | Field name (used as key in form values) |
| `modelValue`         | `unknown`                 | Field value when used outside `<Form>`  |
| `validation`         | `string \| Function`      | Validation rules                        |
| `validationMessages` | `Record<string, unknown>` | Custom error messages for this field    |
| `error`              | `string \| string[]`      | External error (e.g. from API)          |
| `id`                 | `string`                  | Override the auto-generated input id    |

| Slot prop    | Type                      | Description                                                                                               |
| ------------ | ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `inputProps` | `object`                  | Props for custom Vue components (`modelValue`, `onUpdate:modelValue`, `onBlur`, `id`, `name`, aria attrs) |
| `inputValue` | `unknown`                 | Current field value (writable)                                                                            |
| `labelProps` | `{ for: string }`         | Props for `<label>`                                                                                       |
| `errorProps` | `{ id, role, aria-live }` | Props for the error element                                                                               |
| `helpProps`  | `{ id: string }`          | Props for a help text element                                                                             |
| `error`      | `string \| null`          | First error message                                                                                       |
| `errors`     | `string[]`                | All error messages                                                                                        |
| `isValid`    | `boolean`                 | Whether the field is valid                                                                                |
| `isTouched`  | `boolean`                 | Whether the field has been blurred                                                                        |
| `isDirty`    | `boolean`                 | Whether the value has changed                                                                             |
| `validate`   | `() => void`              | Triggers validation manually                                                                              |
| `reset`      | `() => void`              | Resets to initial value                                                                                   |

---

## Validation rules

Rules are specified as a pipe-separated string: `"required|min:3|max:100"`.

| Rule                | Arguments            | Description                                |
| ------------------- | -------------------- | ------------------------------------------ |
| `required`          | —                    | Value must not be empty                    |
| `min`               | `min`                | Minimum string length                      |
| `max`               | `max`                | Maximum string length                      |
| `email`             | —                    | Valid email address                        |
| `url`               | —                    | Valid URL                                  |
| `number`            | —                    | Must be a number                           |
| `alpha`             | —                    | Letters only                               |
| `alphanumeric`      | —                    | Letters and numbers only                   |
| `alphaSpaces`       | —                    | Letters and spaces only                    |
| `lowercase`         | —                    | Lowercase only                             |
| `uppercase`         | —                    | Uppercase only                             |
| `between`           | `min,max`            | Number between two values                  |
| `length`            | `exact` or `min,max` | String length                              |
| `matches`           | `value1,value2,...`  | Must match one of the values               |
| `is`                | `value`              | Strict equality                            |
| `not`               | `value`              | Must not equal value                       |
| `accepted`          | —                    | Must be truthy (checkboxes)                |
| `confirm`           | `fieldName`          | Must match another field's value           |
| `startsWith`        | `prefix`             | Must start with prefix                     |
| `endsWith`          | `suffix`             | Must end with suffix                       |
| `containsAlpha`     | —                    | Must contain at least one letter           |
| `containsNumeric`   | —                    | Must contain at least one number           |
| `containsUppercase` | —                    | Must contain at least one uppercase letter |
| `containsLowercase` | —                    | Must contain at least one lowercase letter |
| `containsSymbol`    | —                    | Must contain at least one symbol           |
| `dateFormat`        | `format`             | Valid date format                          |
| `dateAfter`         | `date`               | Date must be after                         |
| `dateBefore`        | `date`               | Date must be before                        |
| `dateBetween`       | `start,end`          | Date between two dates                     |

### Custom rules

```ts
app.use(FormsPlugin, {
  rules: {
    myRule: (value, { args, messages }) => {
      if (value !== args[0]) return messages.myRule ?? 'Invalid value';
      return true;
    }
  }
});
```

---

## Localization

Built-in locales: `en` (default), `es`.

```ts
import { en, es } from '@overgaming/valiform';

app.use(FormsPlugin, {
  locale: 'es',
  locales: { en, es }
});
```

### Switch locale at runtime

```vue
<script setup>
  import { useLocale } from '@overgaming/valiform';

  const { locale, setLocale } = useLocale();
</script>
```

### Custom locale

```ts
app.use(FormsPlugin, {
  locales: {
    en: {
      required: 'This field is required',
      email: 'Enter a valid email',
      min: ({ args }) => `Minimum ${args[0]} characters`
    }
  }
});
```

---

## Composables

### `useFormContext()`

Access the parent `<Form>` state from any descendant component.

```ts
const { values, isValid, errors, reset, validate, setErrors } = useFormContext();
```

### `useFieldContext()`

Access the parent `<Field>` state from any descendant component.

Has three call signatures:

```ts
// No args — component must always be inside a Field.
// Returns FieldContext directly (no ! needed).
// Throws at runtime if called outside a Field.
const { labelProps } = useFieldContext();

// With fallback — component works inside or outside a Field.
// Returns FieldContext directly (no ! needed).
// When outside a Field, the fallback object is used instead.
const model = defineModel<string>({ default: '' });
const { inputValue, inputProps, error } = useFieldContext({ inputValue: model });

// Explicit null — handle absence of context manually.
// Returns FieldContext | null.
const ctx = useFieldContext(null);
if (ctx) { ... }
```

TypeScript types for `FieldContext` and other interfaces are exported from the package:

```ts
import type { FieldContext, FieldState, FormContext } from '@overgaming/valiform';
```

### `useLocale()`

Access and change the active locale.

```ts
const { locale, setLocale } = useLocale();
setLocale('es');
```
