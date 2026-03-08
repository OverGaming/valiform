import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages'], suffixes: string[]): string {
  const message = messages.endsWith;
  return typeof message === 'function'
    ? message({ suffix: suffixes.length === 1 ? suffixes[0] : suffixes })
    : (message ?? `Must end with: ${suffixes.join(', ')}`);
}

function validate(value: unknown, ...suffixes: string[]): boolean {
  if (!value) return true;
  const str = String(value);
  return suffixes.some((suffix) => str.endsWith(suffix));
}

export function endsWith(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {} } = options;
  return validate(value, ...args) ? true : getMessage(messages, args);
}
