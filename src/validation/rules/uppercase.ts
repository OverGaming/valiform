import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.uppercase;
  return typeof message === 'function'
    ? message({})
    : (message ?? 'Must contain only uppercase characters');
}

function validate(value: unknown): boolean {
  if (!value) return true;
  return /^[A-Z]+$/.test(String(value));
}

export function uppercase(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options;
  return validate(value) ? true : getMessage(messages);
}
