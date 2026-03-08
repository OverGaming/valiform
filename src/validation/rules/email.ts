import type { RuleOptions } from '../../types'

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.email
  return typeof message === 'function' ? message({}) : (message ?? 'Please enter a valid email address')
}

function validate(value: unknown): boolean {
  if (!value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
}

export function email(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options
  return validate(value) ? true : getMessage(messages)
}
