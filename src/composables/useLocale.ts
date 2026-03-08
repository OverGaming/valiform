import { useLocaleContext } from '../context/useLocaleContext'
import type { LocaleContextData } from '../types'

export function useLocale(): LocaleContextData {
  const context = useLocaleContext()

  if (!context) {
    throw new Error('[Valiform] useLocale() must be used inside a component with FormsPlugin installed.')
  }

  return {
    locale: context.locale,
    locales: context.locales,
    setLocale: context.setLocale
  }
}
