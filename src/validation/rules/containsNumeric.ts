import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.containsNumeric;
  return typeof message === 'function'
    ? message({})
    : (message ?? 'Must contain at least one number');
}

function validate(value: unknown): boolean {
  if (!value) return true;
  return /\d/.test(String(value));
}

export function containsNumeric(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options;
  return validate(value) ? true : getMessage(messages);
}
