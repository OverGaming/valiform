import { inject, provide } from 'vue'
import type { InjectionKey } from 'vue'
import type { FormStateContext } from '../types'

export const formStateContextKey: InjectionKey<FormStateContext> = Symbol('form-state-context')

export const useFormStateContextProvider = (data: FormStateContext): void => {
  provide(formStateContextKey, data)
}

export const useFormStateContext = (defaultData: FormStateContext | null = null): FormStateContext | null => {
  const context = inject(formStateContextKey, defaultData)

  if (!context && context !== null) {
    throw new Error('Context with formStateContextKey not found')
  }

  return context
}
