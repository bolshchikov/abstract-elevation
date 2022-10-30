import path from 'path';
import { buildImportMap as buildImportMapJS } from './javascript-ast';
import { buildDepsMap, buildImportMap as buildImportMapTS } from './typescript-ast';

const root = process.argv[2];
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

console.log(JSON.stringify(Object.fromEntries(<any>graph)));
