import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.accepted;
  return typeof message === 'function' ? message({}) : (message ?? 'Must be accepted');
}

function validate(value: unknown): boolean {
  if (!value) return false;
  return ['yes', 'on', '1', 'true'].includes(String(value).toLowerCase());
}

export function accepted(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options;
  return validate(value) ? true : getMessage(messages);
}
