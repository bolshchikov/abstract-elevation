import path from 'path';
import { buildImportMap as buildImportMapJS } from './javascript-ast';
import { buildDepsMap } from './typescript-ast';
import writeJsonFile = require('write-json-file');

const root = process.argv[2].trim();
console.log(`Root received ${root}`);

if (!root) {
  throw new Error('Path to project root file is not specified');
}

let graph;
if (path.extname(root) === '.js') {
  graph = buildImportMapJS(root);
} else if (path.extname(root) === '.ts') {
  graph = buildDepsMap(root);
} else {
  throw new Error('Unsupported file type. Only .js or .ts are supported.');
}

const fileName = `${__dirname}/results/static-graph-${Date.now()}.json`;
writeJsonFile(
  fileName,
  Object.fromEntries(<any>graph),
  { indent: 2 }
).then(() => {
  console.log(`File created: ${fileName}`);
},
  () => {
    console.error('Failed to create file')
  });
