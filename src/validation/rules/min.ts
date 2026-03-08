import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages'], minValue: string): string {
  const message = messages.min;
  return typeof message === 'function'
    ? message({ value: minValue })
    : (message ?? `Must be at least ${minValue}`);
}

function validate(value: unknown, minValue: string): boolean {
  if (!value && value !== 0) return true;

  const num = Number(minValue);
  if (isNaN(num)) return false;

  if (typeof value === 'number') return value >= num;
  if (typeof value === 'string') {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) return numericValue >= num;
    return value.length >= num;
  }
  if (Array.isArray(value)) return value.length >= num;

  return false;
}

export function min(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {} } = options;
  const [minValue] = args;
  return validate(value, minValue) ? true : getMessage(messages, minValue);
}
