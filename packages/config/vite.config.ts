import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { builtinModules } from 'node:module';

export default defineConfig({
  plugins: [dts()],
  resolve: {
    extensions: ['.ts'],
    dedupe: ['@vue/runtime-core'],
  },
  ssr: { target: 'node' },
  esbuild: {
    // drop: ['console', 'debugger'],
  },
  build: {
    minify: false,
    ssr: true,
    target: 'node18',
    emptyOutDir: true,
    rollupOptions: {
      external: [...builtinModules, 'chalk', 'vue', '@vue/runtime-core'],
    },
  },
});
