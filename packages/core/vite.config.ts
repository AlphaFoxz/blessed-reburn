import { mergeConfig, type UserConfig } from 'vite';
import defaultConfig from '../config/vite.config';

const userConfig: UserConfig = {
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
