import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*', 'nuxt/index.ts'],
      outDir: 'dist'
    })
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        nuxt: resolve(__dirname, 'nuxt/index.ts'),
        // Runtime plugin compiled separately so Nuxt can inject it into the user's app.
        // #app and #build/* are Nuxt virtual modules resolved at the user's build time.
        'runtime/plugin': resolve(__dirname, 'nuxt/runtime/plugin.ts')
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['vue', '@nuxt/kit', '#app', /^#build\/.*/],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts']
  }
});
