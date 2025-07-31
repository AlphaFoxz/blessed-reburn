import { mergeConfig, defineConfig, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoImport from 'unplugin-auto-import/vite';
import path from 'node:path';
import defaultConfig from '../config/vite.config';

const userConfig: UserConfig = {
  resolve: {
    alias: {
      '#core': path.join(import.meta.dirname, 'src'),
    },
  },
  plugins: [vue(), autoImport({ imports: ['vitest'], dts: true })],
  build: {
    rollupOptions: {
      input: 'src/index.ts',
      output: {
        format: 'esm',
      },
    },
  },
};
export default mergeConfig(defaultConfig, userConfig);
