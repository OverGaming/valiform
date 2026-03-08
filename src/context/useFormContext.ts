import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';
import type { FormContext } from '../types';

export const formContextKey: InjectionKey<FormContext> = Symbol('form-context');

export const useFormContextProvider = (data: FormContext): void => {
  provide(formContextKey, data);
};

export const useFormContext = (defaultData: FormContext | null = null): FormContext | null => {
  const context = inject(formContextKey, defaultData);

  if (!context && context !== null) {
    throw new Error('Context with formContextKey not found');
  }

  return context;
};
