import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.containsLowercase;
  return typeof message === 'function'
    ? message({})
    : (message ?? 'Must contain at least one lowercase letter');
}

function validate(value: unknown): boolean {
  if (!value) return true;
  return /[a-z]/.test(String(value));
}

export function containsLowercase(
  value: unknown,
  options: Partial<RuleOptions> = {}
): true | string {
  const { messages = {} } = options;
  return validate(value) ? true : getMessage(messages);
}
