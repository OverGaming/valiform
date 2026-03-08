import type { RuleOptions } from '../../types'

function getMessage(messages: RuleOptions['messages'], compareDate: string | undefined): string {
  const message = messages.dateAfterOrEqual
  return typeof message === 'function'
    ? message({ date: compareDate })
    : (message ?? (compareDate ? `Must be after or equal to ${compareDate}` : 'Must be after or equal to today'))
}

function validate(value: unknown, compareDate: string | undefined): boolean {
  if (!value) return true
  const inputDate = new Date(String(value))
  const targetDate = compareDate ? new Date(compareDate) : new Date()
  return !isNaN(inputDate.getTime()) && !isNaN(targetDate.getTime()) && inputDate >= targetDate
}

export function dateAfterOrEqual(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {} } = options
  const [compareDate] = args
  return validate(value, compareDate) ? true : getMessage(messages, compareDate)
}
