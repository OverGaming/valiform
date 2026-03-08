import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.required;
  return typeof message === 'function' ? message({}) : (message ?? 'This field is required');
}

function validate(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  if (value === 0) return true;
  return Boolean(value);
}

export function required(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options;
  return validate(value) ? true : getMessage(messages);
}
