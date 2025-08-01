import { mergeConfig, type UserConfig } from 'vite';
import path from 'node:path';
import vBed from '../plugin/src';
import defaultConfig from '../config/vite.config';

const userConfig: UserConfig = {
  plugins: [vBed()],
  resolve: {
    alias: {
      '#core': path.join(import.meta.dirname, '..', 'core', 'src'),
    },
  },
};
export default mergeConfig(defaultConfig, userConfig);
