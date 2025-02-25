import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'blessed-vue',
      fileName: 'blessed-vue',
    },
    target: 'es2018',
  },
});
