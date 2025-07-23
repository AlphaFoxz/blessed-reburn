import { mergeConfig, type UserConfig } from 'vite';
import defaultConfig from '../config/vite.config';

const userConfig: UserConfig = {};
export default mergeConfig(defaultConfig, userConfig);
