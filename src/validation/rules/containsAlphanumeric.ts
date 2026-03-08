import type { RuleOptions } from '../../types'

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.containsAlphanumeric
  return typeof message === 'function' ? message({}) : (message ?? 'Must contain at least one letter or number')
}

function validate(value: unknown): boolean {
  if (!value) return true
  return /[a-zA-Z0-9]/.test(String(value))
}

export function containsAlphanumeric(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options
  return validate(value) ? true : getMessage(messages)
}
