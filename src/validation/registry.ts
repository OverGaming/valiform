import { shallowRef } from 'vue';
import type { RuleFunction } from '../types';

const rules = shallowRef(new Map<string, RuleFunction>());

export const registerRule = (name: string, handler: RuleFunction): void => {
  rules.value.set(name, handler);
};

export const registerRules = (rulesObject: Record<string, RuleFunction>): void => {
  Object.entries(rulesObject).forEach(([name, handler]) => {
    registerRule(name, handler);
  });
};

export const getRule = (name: string): RuleFunction | undefined => rules.value.get(name);

export const getRules = (): Map<string, RuleFunction> => rules.value;
