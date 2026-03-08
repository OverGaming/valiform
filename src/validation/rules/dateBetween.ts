import type { RuleOptions } from '../../types'

function getMessage(
  messages: RuleOptions['messages'],
  startDate: string,
  endDate: string
): string {
  const message = messages.dateBetween
  return typeof message === 'function'
    ? message({ startDate, endDate })
    : (message ?? `Must be between ${startDate} and ${endDate}`)
}

function validate(value: unknown, startDate: string, endDate: string): boolean {
  if (!value) return true
  const inputDate = new Date(String(value))
  const start = new Date(startDate)
  const end = new Date(endDate)
  return (
    !isNaN(inputDate.getTime()) &&
    !isNaN(start.getTime()) &&
    !isNaN(end.getTime()) &&
    inputDate >= start &&
    inputDate <= end
  )
}

export function dateBetween(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {} } = options
  const [startDate, endDate] = args
  return validate(value, startDate, endDate) ? true : getMessage(messages, startDate, endDate)
}
