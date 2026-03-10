import { defineNuxtPlugin } from '#app';
import { FormsPlugin, registerRules } from '@overgaming/valiform';
// @ts-ignore virtual module resolved by Nuxt at build time
import { pluginOptions, valiformConfig } from '#build/valiform/options.mjs';

export default defineNuxtPlugin((nuxtApp) => {
  const opts = { ...pluginOptions };

  if (valiformConfig?.locales) {
    opts.locales = valiformConfig.locales;
  }

  nuxtApp.vueApp.use(FormsPlugin, opts);

  if (valiformConfig?.rules) {
    registerRules(valiformConfig.rules);
  }
});
