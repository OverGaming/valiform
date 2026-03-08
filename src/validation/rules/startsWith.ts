import type { RuleOptions } from '../../types'

function getMessage(messages: RuleOptions['messages'], prefixes: string[]): string {
  const message = messages.startsWith
  return typeof message === 'function'
    ? message({ prefix: prefixes.length === 1 ? prefixes[0] : prefixes })
    : (message ?? `Must start with: ${prefixes.join(', ')}`)
}

function validate(value: unknown, ...prefixes: string[]): boolean {
  if (!value) return true
  const str = String(value)
  return prefixes.some((prefix) => str.startsWith(prefix))
}

export function startsWith(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {} } = options
  return validate(value, ...args) ? true : getMessage(messages, args)
}
