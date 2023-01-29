import { readdir } from 'fs/promises';
import path from 'path';
import { Config } from './types';

const getDirectories = async (source: string) => {
  return (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
};

const getServicesList = async (root: string, config: Config): Promise<string[]> => {
  if (config.include && config.include.length > 0) {
    return config.include;
  }
  const folders = await getDirectories(`${root}/${config.src}`);
  return folders.filter(name => !(<string[]>config.exclude).includes(name));
};

export const getServices = async (root: string, config: Config): Promise<{ [name: string]: string }> => {
  const projectNames = await getServicesList(root, config);
  return projectNames.reduce((acc, curr) => {
    acc[curr] = path.resolve(root, config.src, curr, './src/main.ts');
    return acc;
  }, {} as any);
};