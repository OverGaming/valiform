import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.alpha;
  return typeof message === 'function'
    ? message({})
    : (message ?? 'Must contain only alphabetical characters');
}

function validate(value: unknown): boolean {
  if (!value) return true;
  return /^[a-zA-Z]+$/.test(String(value));
}

export function alpha(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options;
  return validate(value) ? true : getMessage(messages);
}
