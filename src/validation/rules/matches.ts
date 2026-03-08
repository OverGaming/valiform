import type { RuleOptions } from '../../types'

function getMessage(
  value: unknown,
  messages: RuleOptions['messages'],
  pattern: string
): string {
  const message = messages.matches
  return typeof message === 'function' ? message({ value, pattern }) : (message ?? 'Format is not valid')
}

function validate(value: unknown, pattern: string | undefined): boolean {
  if (!value) return true
  if (!pattern) return false

  try {
    if (pattern.startsWith('/') && pattern.includes('/', 1)) {
      const lastSlashIndex = pattern.lastIndexOf('/')
      const regexPattern = pattern.slice(1, lastSlashIndex)
      const flags = pattern.slice(lastSlashIndex + 1)
      return new RegExp(regexPattern, flags).test(String(value))
    }
    return String(value) === pattern
  } catch {
    return false
  }
}

export function matches(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {} } = options
  const [pattern] = args
  return validate(value, pattern) ? true : getMessage(value, messages, pattern)
}
