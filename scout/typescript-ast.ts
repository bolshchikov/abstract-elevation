import fs from 'fs';
import path from 'path';
import ts, { SyntaxKind } from 'typescript';
import { TFile, TStaticDepsMap } from './types';

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

const buildEmptyRecord = (id: string): TFile => ({
  id,
  name: path.basename(id, '.ts'),
  imports: [],
  exports: []
});

const isExported = (node: ts.Node) => {
  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  if (!modifiers || modifiers.length === 0) {
    return false;
  }
  return modifiers.some(({ kind }) => SyntaxKind.ExportKeyword === kind);
};

export const buildDepsMap = (root: string): TStaticDepsMap => {
  const paths = [root];
  const graph: TStaticDepsMap = new Map();

  const handleImportDeclaration = (currentPath: string, node: ts.ImportDeclaration, sourceFile: ts.SourceFile) => {
    const newRawPath = removeQuotes(node.moduleSpecifier.getFullText(sourceFile));
    if (isLocalImport(newRawPath)) {
      const newPath = path.join(path.parse(currentPath).dir, newRawPath) + '.ts';
      paths.push(newPath);
      graph.get(currentPath)?.imports.push(newPath);
    }
  };
  const handleClassDeclaration = (currentPath: string, node: ts.ClassDeclaration, sourceFile: ts.SourceFile) => {
    if (!isExported(node)) {
      return;
    }
    graph.get(currentPath)?.exports.push({
      id: node.name?.getText(sourceFile),
      name: node.name?.getText(sourceFile),
      members: node.members
        .filter(({ kind }) => SyntaxKind.MethodDeclaration === kind)
        .map((member) => ({
          id: member.name?.getText(sourceFile),
          name: member.name?.getText(sourceFile)
        }))
    });
  };

  while (paths.length) {
    const currentPath = paths.shift();
    if (currentPath === undefined) {
      continue;
    }
    if (!graph.has(currentPath)) {
      graph.set(currentPath, buildEmptyRecord(currentPath));
    }

    const fileContent = readFile(currentPath);
    const sourceFile = buildAst(currentPath, fileContent);

    ts.forEachChild(sourceFile, node => {
      switch (node.kind) {
        case SyntaxKind.ImportDeclaration:
          handleImportDeclaration(currentPath, <ts.ImportDeclaration>node, sourceFile);
          break;
        case SyntaxKind.ClassDeclaration:
          handleClassDeclaration(currentPath, <ts.ClassDeclaration>node, sourceFile);
          break;
      }
    });
  }
  return graph;
}