import type { LocaleMessages } from '../types'

export const en: LocaleMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  min: ({ value }) => `Must be at least ${value}`,
  max: ({ value }) => `Must be at most ${value}`,
  matches: 'Format is not valid',
  number: 'Must be a valid number',
  accepted: 'Must be accepted',
  alpha: 'Must contain only alphabetical characters',
  alphanumeric: 'Must contain only letters and numbers',
  alphaSpaces: 'Must contain only letters and spaces',
  between: ({ min, max }) => `Must be between ${min} and ${max}`,
  confirm: ({ fieldName }) => `Must match ${fieldName}`,
  containsAlpha: 'Must contain at least one letter',
  containsAlphanumeric: 'Must contain at least one letter or number',
  containsAlphaSpaces: 'Must contain at least one letter or space',
  containsLowercase: 'Must contain at least one lowercase letter',
  containsNumeric: 'Must contain at least one number',
  containsSymbol: 'Must contain at least one symbol',
  containsUppercase: 'Must contain at least one uppercase letter',
  dateAfter: ({ date }) => (date ? `Must be after ${date}` : 'Must be after today'),
  dateAfterOrEqual: ({ date }) =>
    date ? `Must be after or equal to ${date}` : 'Must be after or equal to today',
  dateBefore: ({ date }) => (date ? `Must be before ${date}` : 'Must be before today'),
  dateBeforeOrEqual: ({ date }) =>
    date ? `Must be before or equal to ${date}` : 'Must be before or equal to today',
  dateBetween: ({ startDate, endDate }) => `Must be between ${startDate} and ${endDate}`,
  dateFormat: ({ format }) => `Must match the format ${format}`,
  endsWith: ({ suffix }) => {
    if (Array.isArray(suffix)) {
      return `Must end with one of: ${suffix.map((s) => `"${s}"`).join(', ')}`
    }
    return `Must end with "${suffix}"`
  },
  is: ({ allowedValues }) =>
    `Must be one of: ${Array.isArray(allowedValues) ? allowedValues.join(', ') : allowedValues}`,
  length: ({ value, min, max }) => {
    if (min !== undefined && max !== undefined) {
      return `Must be between ${min} and ${max} characters`
    } else if (value !== undefined) {
      return `Must be exactly ${value} characters`
    }
    return 'Invalid length'
  },
  lowercase: 'Must contain only lowercase characters',
  not: ({ disallowedValues }) =>
    `Must not be one of: ${Array.isArray(disallowedValues) ? disallowedValues.join(', ') : disallowedValues}`,
  startsWith: ({ prefix }) => {
    if (Array.isArray(prefix)) {
      return `Must start with one of: ${prefix.join(', ')}`
    }
    return `Must start with "${prefix}"`
  },
  symbol: 'Must contain only symbols',
  uppercase: 'Must contain only uppercase characters',
  url: 'Must be a valid URL'
}
