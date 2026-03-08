import { inject } from 'vue';
import type { InjectionKey } from 'vue';
import type { LocaleContextData } from '../types';

export const localeContextKey: InjectionKey<LocaleContextData> = Symbol('locale-context');

export const useLocaleContext = (
  defaultData: LocaleContextData | null = null
): LocaleContextData | null => {
  const context = inject(localeContextKey, defaultData);

  if (!context && context !== null) {
    throw new Error('Context with localeContextKey not found');
  }

  return context;
};
