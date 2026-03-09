export { FormsPlugin } from './plugins/FormsPlugin';
export { registerRule, registerRules } from './validation/registry';

export { default as Form } from './components/Form.vue';
export { default as Field } from './components/Field.vue';

export { useLocale } from './composables/useLocale';

export { useFormContext } from './context/useFormContext';
export { useFieldContext } from './context/useFieldContext';
export { useInputContext } from './context/useInputContext';

export type {
  FieldContext,
  FieldState,
  FormContext,
  InputProps,
  RuleFunction,
  FormsPluginOptions
} from './types';

export { en } from './locales/en';
export { es } from './locales/es';
