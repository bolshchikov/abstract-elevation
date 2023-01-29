import { exit } from 'process';
import chalk = require('chalk');

export const exitWithError = (message: string) => {
  console.error(chalk.red(message));
  exit(1);
};
