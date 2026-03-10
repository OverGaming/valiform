import type { ValiformConfig } from './types';

/**
 * Define the Valiform configuration for a Nuxt application.
 *
 * Use this in a dedicated config file (e.g. `valiform.config.ts`) that you
 * reference from `nuxt.config.ts` via the `config` option. Because Nuxt
 * bundles this file at build time with full module resolution, imports and
 * closures work normally — unlike inline options in `nuxt.config.ts`.
 *
 * @example
 * ```ts
 * // valiform.config.ts
 * import { defineValiformConfig, es, en } from '@overgaming/valiform';
 * import * as rules from './rules';
 *
 * export default defineValiformConfig({
 *   locales: { es, en },
 *   rules
 * });
 * ```
 */
export function defineValiformConfig(config: ValiformConfig): ValiformConfig {
  return config;
}
