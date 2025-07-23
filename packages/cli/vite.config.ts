import { mergeConfig, type UserConfig } from 'vite';
import defaultConfig from '../config/vite.config';

const userConfig: UserConfig = {
  build: {
    rollupOptions: {
      input: './src/index.ts',
      output: {
        sourcemap: false,
        format: 'esm',
        entryFileNames: 'vbed.mjs',
        banner: '#!/usr/bin/env node\n',
      },
    },
  },
};
defaultConfig.build?.rollupOptions?.external || [];

export default mergeConfig(defaultConfig, userConfig);
