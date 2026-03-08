import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages'], disallowedValues: string[]): string {
  const message = messages.not;
  return typeof message === 'function'
    ? message({ disallowedValues })
    : (message ?? `Must not be one of: ${disallowedValues.join(', ')}`);
}

function validate(value: unknown, ...disallowedValues: string[]): boolean {
  if (!value && value !== 0 && value !== false) return true;
  return !disallowedValues.includes(String(value));
}

export function not(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {} } = options;
  return validate(value, ...args) ? true : getMessage(messages, args);
}
