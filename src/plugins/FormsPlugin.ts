import { ref, readonly, shallowRef, isRef } from 'vue'
import type { App } from 'vue'
import { localeContextKey } from '../context/useLocaleContext'
import { en } from '../locales/en'
import { registerRules } from '../validation/registry'
import * as builtInRules from '../validation/rules'
import type { FormsPluginOptions, RuleFunction } from '../types'

export const FormsPlugin = {
  install(app: App, options: FormsPluginOptions = {}) {
    registerRules(builtInRules as Record<string, RuleFunction>)

    if (options.rules) {
      registerRules(options.rules)
    }

    const locale = isRef(options.locale) ? options.locale : ref(options.locale ?? 'en')

    const mergedLocales: Record<string, typeof en> = { en }
    if (options.locales) {
      Object.keys(options.locales).forEach((key) => {
        mergedLocales[key] = { ...(mergedLocales[key] ?? {}), ...options.locales![key] }
      })
    }

    const locales = shallowRef(mergedLocales)

    app.provide(localeContextKey, {
      locale: readonly(locale),
      locales: readonly(locales),
      setLocale: (newLocale: string) => {
        if (locales.value[newLocale]) {
          locale.value = newLocale
        } else {
          console.warn(`Locale "${newLocale}" not available.`)
        }
      }
    })
  }
}
