import type { RuleOptions } from '../../types'

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.lowercase
  return typeof message === 'function' ? message({}) : (message ?? 'Must contain only lowercase characters')
}

function validate(value: unknown): boolean {
  if (!value) return true
  return /^[a-z]+$/.test(String(value))
}

export function lowercase(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options
  return validate(value) ? true : getMessage(messages)
}
