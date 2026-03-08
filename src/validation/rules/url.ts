import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.url;
  return typeof message === 'function' ? message({}) : (message ?? 'Must be a valid URL');
}

function validate(value: unknown): boolean {
  if (!value) return true;
  try {
    const url = new URL(String(value));
    return ['http:', 'https:', 'ftp:', 'ftps:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export function url(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options;
  return validate(value) ? true : getMessage(messages);
}
