import { mergeConfig, type UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
// import dts from 'unplugin-dts/vite';
import defaultConfig from '../config/vite.config';

const userConfig: UserConfig = {
  plugins: [dts({ entryRoot: 'src' })],
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
