import fs from 'fs';
import path from 'path';
import { Parser } from 'acorn';
import { simple } from 'acorn-walk';


const readFile = (path: string) => {
  return fs.readFileSync(path, { encoding: 'utf-8' });
};

const isLocalImport = (name: string) => name.startsWith('.') || name.startsWith('/');

const buildAst = (fileContent: string) => {
  return Parser.parse(fileContent, {
    sourceType: 'module',
    ecmaVersion: 'latest'
  });
};


export const buildImportMap = (root: string): Map<string, string[]> => {
  const paths = [root];
  const graph = new Map();

  while (paths.length) {
    const currentPath = paths.shift();
    if (currentPath === undefined) {
      continue;
    }
    if (!graph.has(currentPath)) {
      graph.set(currentPath, []);
    }
    const fileContent = readFile(currentPath);
    const ast = buildAst(fileContent);
    simple(ast, {
      ImportDeclaration: function (node: any) {
        if (isLocalImport(node.source.value)) {
          const newPath = path.join(path.parse(currentPath).dir, node.source.value);
          paths.push(newPath);
          graph.get(currentPath).push(newPath);
        }
      }
    });
  };

  return graph;
};