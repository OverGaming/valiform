import {
  addComponent,
  addImports,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  resolvePath
} from '@nuxt/kit';
import type { FormsPluginOptions } from '../src/types';

// Extends the core plugin options with Nuxt-specific options.
// rulesPath points to a file that default-exports a rules record — it supports
// closures and external imports, unlike inline `rules` which uses fn.toString()
// and therefore only works with pure functions (no external variable references).
interface NuxtModuleOptions extends FormsPluginOptions {
  rulesPath?: string;
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
    const { rules, rulesPath, ...pluginOptions } = options;

    // Determine how to provide custom rules to the runtime plugin.
    // rulesPath takes precedence over inline rules.
    const lines: string[] = [`export const pluginOptions = ${JSON.stringify(pluginOptions)};`];

    if (rulesPath) {
      // Import from a user-provided file. Closures and external imports work
      // because Nuxt bundles this file with its own context at build time.
      const resolved = await resolvePath(rulesPath);
      lines.unshift(`import _customRules from ${JSON.stringify(resolved)};`);
      lines.push('export const customRules = _customRules;');
    } else if (rules && Object.keys(rules).length > 0) {
      // Serialize inline functions using fn.toString(). Works only for pure
      // functions — any reference to an external variable will throw at runtime.
      const serialized = `{\n${Object.entries(rules)
        .map(([name, fn]) => `  ${JSON.stringify(name)}: ${fn.toString()}`)
        .join(',\n')}\n}`;
      lines.push(`export const customRules = ${serialized};`);
    } else {
      lines.push('export const customRules = null;');
    }

    // Generate a virtual options file that the runtime plugin imports.
    addTemplate({
      filename: 'valiform/options.mjs',
      getContents: () => lines.join('\n'),
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

export type ModuleOptions = NuxtModuleOptions;
