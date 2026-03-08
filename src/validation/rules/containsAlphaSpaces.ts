import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.containsAlphaSpaces;
  return typeof message === 'function'
    ? message({})
    : (message ?? 'Must contain at least one letter or space');
}

function validate(value: unknown): boolean {
  if (!value) return true;
  return /[a-zA-Z\s]/.test(String(value));
}

export function containsAlphaSpaces(
  value: unknown,
  options: Partial<RuleOptions> = {}
): true | string {
  const { messages = {} } = options;
  return validate(value) ? true : getMessage(messages);
}
