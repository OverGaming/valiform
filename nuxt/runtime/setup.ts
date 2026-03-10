import { FormsPlugin, registerRules } from '@overgaming/valiform';
// @ts-ignore virtual module resolved by Nuxt at build time
import { pluginOptions, valiformConfig } from '#build/valiform/options.mjs';

export function setupFormsPlugin(nuxtApp: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { syncI18n, ...formsOpts } = pluginOptions;
  const opts = { ...formsOpts };

  if (valiformConfig?.locales) {
    opts.locales = valiformConfig.locales;
  }

  if (syncI18n) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const i18n = (nuxtApp as any).$i18n;
    if (i18n && i18n.locale) {
      opts.locale = i18n.locale;
    }
  }

  nuxtApp.vueApp.use(FormsPlugin, opts);

  if (valiformConfig?.rules) {
    registerRules(valiformConfig.rules);
  }
}
