import { defineConfig } from 'vite';
import { builtinModules } from 'node:module';
import path from 'node:path';

export default defineConfig({
  resolve: {
    extensions: ['.ts'],
    alias: {
      '#core': path.join(__dirname, '../core/src'),
      '#cli': path.join(__dirname, '../cli/src'),
      '#playground': path.join(__dirname, '../playground/src'),
      '#vite-plugin': path.join(__dirname, '../vite-plugin/src'),
    },
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
      external: [...builtinModules, 'chalk'],
    },
  },
});
