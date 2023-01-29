import chalk = require('chalk');
import { buildStaticInsights } from './ast';
import { getValidConfig } from './config';
import { getServices } from './input';
import { Config } from './types';
import { exitWithError } from './utils';
import writeJsonFile = require('write-json-file');

const root = process.argv[2].trim();
if (!root) {
  exitWithError('Path to project root file is not specified');
}
console.log(`Root received: ${chalk.green(root)}`);

const config = getValidConfig(root);
if (!config) {
  exitWithError('Config file is not found in the root');
}
console.log('Found config:', chalk.green(JSON.stringify(config)));

const [company, domain] = config?.id.split('/')!;

const patch: any = {
  companies: {
    [company]: {
      id: company,
      domains: [domain]
    }
  },
  domains: {
    [domain]: {
      id: domain,
      owner: company
    }
  },
  services: {}
}

getServices(root, config as Config)
  .then((services) => {
    patch.domains[domain].services = Object.keys(services);
    for (let [name, serviceRoot] of Object.entries(services)) {
      patch.services[name] = {
        owner: domain,
        id: name,
        components: Object.fromEntries(buildStaticInsights(serviceRoot))
      }
    }
    return patch;
  })
  .then(async (data) => {
    const fileName = `${process.cwd()}/results/db-${Date.now()}.json`;
    await writeJsonFile(fileName, data, { indent: 2 });
    return fileName;
  })
  .then((fileName) => console.log('File created:', chalk.yellow(fileName)))
  .catch((error) => exitWithError(error));

