import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';
import type { FieldContext } from '../types';

export const fieldContextKey: InjectionKey<FieldContext> = Symbol('field-context');

export const useFieldContextProvider = (data: FieldContext): void => {
  provide(fieldContextKey, data);
};

export const useFieldContext = (defaultData: FieldContext | null = null): FieldContext | null => {
  return inject(fieldContextKey, defaultData);
};
