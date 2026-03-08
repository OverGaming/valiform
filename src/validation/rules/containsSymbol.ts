import type { RuleOptions } from '../../types'

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.containsSymbol
  return typeof message === 'function' ? message({}) : (message ?? 'Must contain at least one symbol')
}

function validate(value: unknown): boolean {
  if (!value) return true
  return /[^\w\s]/.test(String(value))
}

export function containsSymbol(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options
  return validate(value) ? true : getMessage(messages)
}
