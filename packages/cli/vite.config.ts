import { mergeConfig, defineConfig, type UserConfig } from 'vite';
import { builtinModules } from 'node:module';
import path from 'node:path';
import defaultConfig from '../config/vite.config';

const userConfig: UserConfig = {
  resolve: {
    alias: {
      '#cli': path.join(import.meta.dirname, 'src'),
    },
  },
  ssr: { noExternal: ['chalk'] },
  build: {
    ssr: true,
    rollupOptions: {
      input: 'src/index.ts',
      output: {
        entryFileNames: 'vbed.cjs',
        format: 'cjs',
      },
      external: [...builtinModules, 'vite'],
    },
  },
};

export default defineConfig(userConfig);
