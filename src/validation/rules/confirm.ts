import type { RuleOptions } from '../../types';

function getMessage(messages: RuleOptions['messages'], fieldName: string): string {
  const message = messages.confirm;
  return typeof message === 'function'
    ? message({ fieldName })
    : (message ?? `Must match ${fieldName}`);
}

function validate(value: unknown, fieldName: string, fields: RuleOptions['fields']): boolean {
  if (!value) return true;
  if (!fields) return false;
  // fields is a Vue reactive proxy — FieldState.value is auto-unwrapped to its computed value
  return value === (fields[fieldName] as unknown as Record<string, unknown>)?.value;
}

export function confirm(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {}, fields = {} } = options;
  const [fieldName] = args;
  return validate(value, fieldName, fields) ? true : getMessage(messages, fieldName);
}
