import type { RuleOptions } from '../../types';

function getMessage(
  messages: RuleOptions['messages'],
  minOrExact: string,
  maxValue: string | undefined
): string {
  const message = messages.length;
  if (maxValue !== undefined) {
    return typeof message === 'function'
      ? message({ min: minOrExact, max: maxValue })
      : (message ?? `Must be between ${minOrExact} and ${maxValue} characters`);
  }
  return typeof message === 'function'
    ? message({ value: minOrExact })
    : (message ?? `Must be exactly ${minOrExact} characters`);
}

function validate(value: unknown, minOrExact: string, maxValue: string | undefined): boolean {
  if (!value && value !== 0) return true;

  let len = 0;
  if (typeof value === 'string') {
    len = value.length;
  } else if (Array.isArray(value)) {
    len = value.length;
  } else if (typeof value === 'object' && value !== null) {
    len = Object.keys(value).length;
  } else {
    return false;
  }

  if (maxValue !== undefined) {
    const min = Number(minOrExact);
    const max = Number(maxValue);
    return !isNaN(min) && !isNaN(max) && len >= min && len <= max;
  }

  const exact = Number(minOrExact);
  return !isNaN(exact) && len === exact;
}

export function length(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {} } = options;
  const [minOrExact, maxValue] = args;
  return validate(value, minOrExact, maxValue) ? true : getMessage(messages, minOrExact, maxValue);
}
