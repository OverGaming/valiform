import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['index.ts', 'nuxt.ts', 'src/**/*'],
      outDir: 'dist'
    })
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'index.ts'),
        nuxt: resolve(__dirname, 'nuxt.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue', '@nuxt/kit'],
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
