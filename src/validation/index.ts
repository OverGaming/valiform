import { getRule } from './registry'
import { parseRules } from '../utils/parseRules'
import type { FieldState, LocaleMessages, ValidationResult } from '../types'

export const validateStringRules = (
  value: unknown,
  rules: string | null,
  messages: LocaleMessages = {},
  fields: Record<string, FieldState> = {}
): ValidationResult => {
  if (!rules) return true

  const parsedRules = parseRules(rules)
  const errors: string[] = []

  for (const [ruleName, ruleValue] of Object.entries(parsedRules)) {
    const ruleFunction = getRule(ruleName)

    if (ruleFunction) {
      const args = ruleValue === true ? [] : Array.isArray(ruleValue) ? ruleValue : [ruleValue]
      const options = { args, messages, fields }
      const ruleResult = ruleFunction(value, options)

      if (ruleResult !== true) {
        errors.push(ruleResult ?? 'Invalid value')
      }
    } else {
      console.warn(`[Forms] Validation rule "${ruleName}" not found.`)
    }
  }

  return errors.length === 0 ? true : errors
}

export const validateFunction = (
  value: unknown,
  fn: (value: unknown) => unknown
): ValidationResult => {
  const result = fn(value)

  if (result === true) return true
  if (typeof result === 'string') return [result]
  if (Array.isArray(result)) return result as string[]

  const isValid = Boolean(result)
  return isValid ? true : ['Invalid value']
}
