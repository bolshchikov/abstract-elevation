import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const readFile = (path: string) => fs.readFileSync(path, { encoding: 'utf-8' });

const isLocalImport = (name: string) => name.startsWith('.') || name.startsWith('src/');

const buildAst = (fileName: string, fileContent: string) => ts.createSourceFile(
  fileName,
  fileContent,
  ts.ScriptTarget.ES2015,
);

const removeQuotes = (name: string) => {
  const isNotQuote = (char: string) => char !== '"' && char !== "'";
  return name.trim().split('').filter(isNotQuote).join('');
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
    const sourceFile = buildAst(currentPath, fileContent);

    ts.forEachChild(sourceFile, node => {
      if (ts.isImportDeclaration(node)) {
        const newRawPath = removeQuotes(node.moduleSpecifier.getFullText(sourceFile));
        if (isLocalImport(newRawPath)) {
          const newPath = path.join(path.parse(currentPath).dir, newRawPath) + '.ts';
          paths.push(newPath);
          graph.get(currentPath).push(newPath);
        }
      }
    });

  }

  return graph;
};