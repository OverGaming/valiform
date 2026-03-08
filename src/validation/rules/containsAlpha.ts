import type { RuleOptions } from '../../types'

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.containsAlpha
  return typeof message === 'function' ? message({}) : (message ?? 'Must contain at least one letter')
}

function validate(value: unknown): boolean {
  if (!value) return true
  return /[a-zA-Z]/.test(String(value))
}

export function containsAlpha(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options
  return validate(value) ? true : getMessage(messages)
}
