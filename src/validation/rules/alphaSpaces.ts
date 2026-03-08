import type { RuleOptions } from '../../types'

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.alphaSpaces
  return typeof message === 'function' ? message({}) : (message ?? 'Must contain only letters and spaces')
}

function validate(value: unknown): boolean {
  if (!value) return true
  return /^[a-zA-Z\s]+$/.test(String(value))
}

export function alphaSpaces(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options
  return validate(value) ? true : getMessage(messages)
}
