import { mergeConfig, type UserConfig } from 'vite';
import vBed from '../plugin/src';
import defaultConfig from '../config/vite.config';

const userConfig: UserConfig = {
  plugins: [vBed()],
};
export default mergeConfig(defaultConfig, userConfig);
