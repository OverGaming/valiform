import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages']): string {
  const message = messages.number;
  return typeof message === 'function' ? message({}) : (message ?? 'Must be a valid number');
}

function validate(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true;
  if (Number.isNaN(value)) return false;
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

export function number(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { messages = {} } = options;
  return validate(value) ? true : getMessage(messages);
}
