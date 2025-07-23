import { mergeConfig, type UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import defaultConfig from '../config/vite.config';

const userConfig: UserConfig = {
  plugins: [dts()],
  ssr: { noExternal: ['chalk'] },
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
