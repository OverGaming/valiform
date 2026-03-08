import type { RuleOptions } from '../../types';

const regexForFormat = (format: string): RegExp => {
  const escaped = format.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const formats: Record<string, string> = {
    YYYY: '\\d{4}',
    YY: '\\d{2}',
    MM: '(0[1-9]|1[012])',
    M: '([1-9]|1[012])',
    DD: '([012][0-9]|3[01])',
    D: '([012]?[0-9]|3[01])'
  };

  let pattern = escaped;
  Object.keys(formats).forEach((token) => {
    pattern = pattern.replace(new RegExp(token, 'g'), formats[token]);
  });

  return new RegExp(`^${pattern}$`);
};

function getMessage(messages: RuleOptions['messages'], format: string): string {
  const message = messages.dateFormat;
  return typeof message === 'function'
    ? message({ format })
    : (message ?? `Must match the format ${format}`);
}

function validate(value: unknown, format: string | undefined): boolean {
  if (!value) return true;
  if (format && typeof format === 'string') {
    return regexForFormat(format).test(String(value));
  }
  return !isNaN(Date.parse(String(value)));
}

export function dateFormat(value: unknown, options: Partial<RuleOptions> = {}): true | string {
  const { args = [], messages = {} } = options;
  const [format] = args;
  return validate(value, format) ? true : getMessage(messages, format);
}
