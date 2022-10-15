import fs from 'fs';
import path from 'path';
import { Parser } from 'acorn';
import { simple } from 'acorn-walk';

const isLocalImport = name => name.startsWith('.') || name.startsWith('/');

const buildAst = (fileContent) => {
  return Parser.parse(fileContent, {
    sourceType: 'module',
    ecmaVersion: 'latest'
  });
};

const readFile = (path) => {
  return fs.readFileSync(path, { encoding: 'utf-8' });
};

const root = process.argv[2];

if (!root) {
  throw new Error('Path to project root file is not specified');
}

const paths = [root];
const graph = new Map();

while (paths.length) {
  const currentPath = paths.shift();
  if (!graph.has(currentPath)) {
    graph.set(currentPath, []);
  }
  const fileContent = readFile(currentPath);
  const ast = buildAst(fileContent);
  simple(ast, {
    ImportDeclaration: function (node) {
      if (isLocalImport(node.source.value)) {
        const newPath = path.join(path.parse(currentPath).dir, node.source.value);
        paths.push(newPath);
        graph.get(currentPath).push(newPath);
      }
    }
  });
};

console.log(graph);