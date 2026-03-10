import { defineNuxtPlugin } from '#app';
import { FormsPlugin, registerRules } from '@overgaming/valiform';
// @ts-ignore virtual module resolved by Nuxt at build time
import { pluginOptions, valiformConfig } from '#build/valiform/options.mjs';

export default defineNuxtPlugin({
  enforce: 'post',
  setup(nuxtApp) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { syncI18n, ...formsOpts } = pluginOptions;
    const opts = { ...formsOpts };

    if (valiformConfig?.locales) {
      opts.locales = valiformConfig.locales;
    }

    if (syncI18n) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const i18nLocale = (nuxtApp as any).$i18n?.locale;
      if (i18nLocale) {
        opts.locale = i18nLocale;
      }
    }

    nuxtApp.vueApp.use(FormsPlugin, opts);

    if (valiformConfig?.rules) {
      registerRules(valiformConfig.rules);
    }
  }
});
