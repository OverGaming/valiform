import type { RuleOptions } from '../../types'

function getMessage(messages: RuleOptions['messages'], maxValue: string): string {
  const message = messages.max
  return typeof message === 'function' ? message({ value: maxValue }) : (message ?? `Must be at most ${maxValue}`)
}

function validate(value: unknown, maxValue: string): boolean {
  if (!value && value !== 0) return true

  const num = Number(maxValue)
  if (isNaN(num)) return false

  if (typeof value === 'number') return value <= num
  if (typeof value === 'string') {
    const numericValue = Number(value)
    if (!isNaN(numericValue)) return numericValue <= num
    return value.length <= num
  }
  if (Array.isArray(value)) return value.length <= num

  return false
}

export function max(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {} } = options
  const [maxValue] = args
  return validate(value, maxValue) ? true : getMessage(messages, maxValue)
}
