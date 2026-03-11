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
  FormSubmitHelpers,
  FormSubmitHandler,
  InputProps,
  RuleFunction,
  RuleOptions,
  LocaleMessageFn,
  LocaleMessage,
  LocaleMessages,
  FormsPluginOptions,
  ValiformConfig
} from './types';

export { defineValiformConfig } from './defineValiformConfig';

export { en } from './locales/en';
export { es } from './locales/es';
