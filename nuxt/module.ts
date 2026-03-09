import {
  addComponent,
  addImports,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule
} from '@nuxt/kit';
import type { FormsPluginOptions } from '../src/types';

export default defineNuxtModule<FormsPluginOptions>({
  meta: {
    name: '@overgaming/valiform',
    configKey: 'valiform',
    compatibility: { nuxt: '>=3.0.0' }
  },
  defaults: {},
  setup(options: FormsPluginOptions) {
    const resolver = createResolver(import.meta.url);
    const { rules, ...pluginOptions } = options;

    // Serialize custom rules as function source code so they survive the
    // build-time code generation step. JSON.stringify would drop functions.
    const rulesCode =
      rules && Object.keys(rules).length > 0
        ? `{\n${Object.entries(rules)
            .map(([name, fn]) => `  ${JSON.stringify(name)}: ${fn.toString()}`)
            .join(',\n')}\n}`
        : 'null';

    // Generate a virtual options file that the runtime plugin imports.
    // Only this small file needs string-based code generation.
    addTemplate({
      filename: 'valiform/options.mjs',
      getContents: () =>
        [
          `export const pluginOptions = ${JSON.stringify(pluginOptions)}`,
          `export const customRules = ${rulesCode}`
        ].join('\n'),
      write: true
    });

    // The plugin itself is a real TypeScript file — no string generation needed.
    addPlugin(resolver.resolve('./runtime/plugin'));

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

export type ModuleOptions = FormsPluginOptions;
