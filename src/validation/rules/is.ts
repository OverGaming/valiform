import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages'], allowedValues: string[]): string {
  const message = messages.is;
  return typeof message === 'function'
    ? message({ allowedValues })
    : (message ?? `Must be one of: ${allowedValues.join(', ')}`);
}

function validate(value: unknown, ...allowedValues: string[]): boolean {
  if (!value && value !== 0 && value !== false) return true;
  return allowedValues.includes(String(value));
}

export function is(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {} } = options;
  return validate(value, ...args) ? true : getMessage(messages, args);
}
