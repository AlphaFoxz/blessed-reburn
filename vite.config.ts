import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { builtinModules } from 'node:module';
// import * as compiler from '@vue/compiler-sfc';

export default defineConfig({
  plugins: [vue({ features: { customElement: true } })],
  resolve: {
    alias: {
      vue: '@vue/runtime-core',
    },
    dedupe: ['@vue/runtime-core'],
  },
  ssr: {
    target: 'node',
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    target: 'node18',
    // ssr: true,
    // lib: {
    //   entry: 'src/main.ts',
    //   formats: ['cjs'],
    // },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.ts',
      output: {
        entryFileNames: '[name].cjs',
        format: 'cjs',
      },
      external: [...builtinModules /* '@vue/runtime-core' */],
    },
  },
});
