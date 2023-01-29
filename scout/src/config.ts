import path from 'path';
import { Config } from './types';
import { exitWithError } from './utils';

const CONFIG_FILE_NAME = 'scout.json';

const isValidConfig = (config: Config): boolean => {
  if (!config.id) {
    exitWithError('Config is missing id');
  }
  if (!config.src) {
    exitWithError('Config is missing `src` path');
  }
  return true;
};

const completeConfig = (config: Config): Config => {
  return {
    exclude: [],
    ...config,
  }
};

const loadConfigFile = (root: string): Config => {
  let config;
  try {
    config = require(path.resolve(root, CONFIG_FILE_NAME));
  } catch (error) {
    exitWithError('Config file is not found in the root');
  }
  return config;
}

export const getValidConfig = (root: string): Config | null => {
  let config = loadConfigFile(root);
  if (isValidConfig(config)) {
    return completeConfig(config);
  }
  return null;
};