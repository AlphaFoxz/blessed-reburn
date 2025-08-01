import { defineConfig, type UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
// import dts from 'unplugin-dts/vite';
import defaultConfig from '../config/vite.config';

const userConfig: UserConfig = {
  plugins: [dts({ entryRoot: 'src' })],
  build: {
    ssr: true,
    rollupOptions: {
      input: 'src/index.ts',
      output: {
        format: 'esm',
      },
    },
  },
};
export default defineConfig(userConfig);
// export default mergeConfig(defaultConfig, userConfig);
