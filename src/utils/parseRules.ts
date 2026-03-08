import type { ParsedRules } from '../types';

export function parseRules(ruleString: string): ParsedRules {
  if (!ruleString || typeof ruleString !== 'string') {
    return {};
  }

  const rules = ruleString.split('|').filter(Boolean);
  const result: ParsedRules = {};

  for (const rule of rules) {
    const [name, ...valueParts] = rule.split(':');
    const ruleName = name.trim();

    if (valueParts.length === 0) {
      result[ruleName] = true;
    } else {
      const fullValue = valueParts.join(':');
      const values = fullValue.split(',').map((v) => v.trim());

      result[ruleName] = values.length === 1 ? values[0] : values;
    }
  }

  return result;
}
