import { addComponent, addImports, addPluginTemplate, defineNuxtModule } from '@nuxt/kit'
import type { FormsPluginOptions } from './types'

export default defineNuxtModule<FormsPluginOptions>({
  meta: {
    name: '@overgaming/valiform',
    configKey: 'valiform',
    compatibility: { nuxt: '>=3.0.0' },
  },
  defaults: {},
  setup(options: FormsPluginOptions) {
    addPluginTemplate({
      filename: 'valiform.plugin.mjs',
      getContents: () =>
        [
          `import { defineNuxtPlugin } from '#app'`,
          `import { FormsPlugin } from '@overgaming/valiform'`,
          `export default defineNuxtPlugin((nuxtApp) => {`,
          `  nuxtApp.vueApp.use(FormsPlugin, ${JSON.stringify(options)})`,
          `})`,
        ].join('\n'),
    })

    addComponent({ name: 'Form', export: 'Form', filePath: '@overgaming/valiform' })
    addComponent({ name: 'Field', export: 'Field', filePath: '@overgaming/valiform' })

    addImports([
      { name: 'useLocale', from: '@overgaming/valiform' },
      { name: 'useFormContext', from: '@overgaming/valiform' },
      { name: 'useFieldContext', from: '@overgaming/valiform' },
    ])
  },
})

export type ModuleOptions = FormsPluginOptions
