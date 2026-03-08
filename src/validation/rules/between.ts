import type { RuleOptions } from '../../types'

function getMessage(messages: RuleOptions['messages'], min: string, max: string): string {
  const message = messages.between
  return typeof message === 'function'
    ? message({ min, max })
    : (message ?? `Must be between ${min} and ${max}`)
}

function validate(value: unknown, min: string, max: string): boolean {
  if (!value && value !== 0) return true
  const num = Number(value)
  if (isNaN(num)) return false
  const minNum = Number(min)
  const maxNum = Number(max)
  if (isNaN(minNum) || isNaN(maxNum)) return false
  return num >= minNum && num <= maxNum
}

export function between(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {} } = options
  const [min, max] = args
  return validate(value, min, max) ? true : getMessage(messages, min, max)
}
