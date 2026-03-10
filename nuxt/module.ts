import {
  addComponent,
  addImports,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  hasNuxtModule,
  resolvePath
} from '@nuxt/kit';

interface NuxtModuleOptions {
  /** Default locale key (e.g. 'es', 'en'). Serializable — safe in nuxt.config. */
  locale?: string;
  /**
   * Path to a file that default-exports a `defineValiformConfig({…})` object.
   * Because Nuxt bundles this file at build time, imports, closures and
   * external variables all work normally — no serialization limitations.
   */
  config?: string;
  /**
   * When true, the active locale is automatically synced with @nuxtjs/i18n.
   * Valiform will use `nuxtApp.$i18n.locale` (a Ref<string>) at runtime,
   * so changing the i18n language also changes the validation messages language.
   * The `locale` option is used as fallback if $i18n is not available.
   */
  syncI18n?: boolean;
}

export default defineNuxtModule<NuxtModuleOptions>({
  meta: {
    name: '@overgaming/valiform',
    configKey: 'valiform',
    compatibility: { nuxt: '>=3.0.0' }
  },
  defaults: {},
  async setup(options: NuxtModuleOptions) {
    const resolver = createResolver(import.meta.url);
    const { config: configPath, ...pluginOptions } = options;

    const lines: string[] = [];

    if (configPath) {
      const resolved = await resolvePath(configPath);
      lines.push(`import _config from ${JSON.stringify(resolved)};`);
    }

    lines.push(`export const pluginOptions = ${JSON.stringify(pluginOptions)};`);
    lines.push(`export const valiformConfig = ${configPath ? '_config' : 'null'};`);

    addTemplate({
      filename: 'valiform/options.mjs',
      getContents: () => lines.join('\n'),
      write: true
    });

    const hasI18n = hasNuxtModule('@nuxtjs/i18n');
    const awaitsI18n = pluginOptions.syncI18n && hasI18n;

    addPlugin(resolver.resolve(awaitsI18n ? './runtime/plugin-i18n' : './runtime/plugin'));

    addComponent({ name: 'Form', export: 'Form', filePath: '@overgaming/valiform' });
    addComponent({ name: 'Field', export: 'Field', filePath: '@overgaming/valiform' });

    addImports([
      { name: 'useLocale', from: '@overgaming/valiform' },
      { name: 'useFormContext', from: '@overgaming/valiform' },
      { name: 'useFieldContext', from: '@overgaming/valiform' },
      { name: 'useInputContext', from: '@overgaming/valiform' }
    ]);
  }
});

export type ModuleOptions = NuxtModuleOptions;
