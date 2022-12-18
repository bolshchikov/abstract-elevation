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
  const isNotBreakLine = (char: string) => char !== '\n';
  return name
    .trim()
    .split('')
    .filter(isNotQuote)
    .filter(isNotBreakLine)
    .join('');
};

const hasDuplicate = (collection: any[], target: string) => {
  if (!collection || collection.length === 0) {
    return false;
  }
  if (typeof collection[0] === 'object') {
    return collection.some(({ id }) => target === id);
  }
  return collection.includes(target);
}

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

/**
 * 
 * Example: @Controller('invoices'), @Put()
 */
const tokenizeDecorator = (decorator: string): [verb: string, path: string] | null => {
  const decoratorRegEx = /@(.*)\((.*)\)/g;
  const groups = decoratorRegEx.exec(decorator);
  if (groups) {
    return [groups[1], removeQuotes(groups[2])];
  }
  return null;
};

const getControllerPath = (node: ts.ClassDeclaration, sourceFile: ts.SourceFile): string | null => {
  const isControllerDecorator = (dec: ts.Decorator) => removeQuotes(dec.getFullText(sourceFile)).startsWith('@Controller');
  const ctrlDecorator = ts.getDecorators(node)?.find(isControllerDecorator);
  if (!ctrlDecorator) {
    return null;
  }
  const text = ctrlDecorator.getFullText(sourceFile);
  const tokens = tokenizeDecorator(text);
  if (!tokens) {
    return null;
  }
  const [, path] = tokens;
  return path ? `/${path}` : '/';
};

const getControllerHandler = (node: ts.ClassElement, sourceFile: ts.SourceFile) => {
  const knownVerbs = ['Put', 'Get', 'Post', 'Delete', 'Patch'].map(v => `@${v}`);
  const isRESTDecorator = (dec: ts.Decorator) => {
    const text = removeQuotes(dec.getFullText(sourceFile));
    return knownVerbs.some(v => text.startsWith(v));
  };
  const restDecorator = ts.getDecorators(node as any)?.find(isRESTDecorator);
  if (!restDecorator) {
    return null;
  }
  const text = restDecorator.getFullText(sourceFile);
  return tokenizeDecorator(text);
};

const hasAllowedFileExtension = (path: string) => {
  const exts = ['.js', '.ts'];
  return exts.some(ext => path.endsWith(ext));
};

export const buildStaticInsights = (root: string): TStaticDepsMap => {
  const paths = [root];
  const graph: TStaticDepsMap = new Map();

  const handleImportDeclaration = (currentPath: string, node: ts.ImportDeclaration, sourceFile: ts.SourceFile) => {
    const newRawPath = removeQuotes(node.moduleSpecifier.getFullText(sourceFile));
    if (isLocalImport(newRawPath)) {
      const ext = hasAllowedFileExtension(newRawPath) ? '' : '.ts';
      const newPath = path.join(path.parse(currentPath).dir, newRawPath) + ext;
      paths.push(newPath);
      if (!hasDuplicate(graph.get(currentPath)?.imports ?? [], newPath)) {
        graph.get(currentPath)?.imports.push(newPath);
      }
    }
  };
  const handleClassDeclaration = (currentPath: string, node: ts.ClassDeclaration, sourceFile: ts.SourceFile) => {
    if (!isExported(node)) {
      return;
    }
    const classId = node.name?.getText(sourceFile);
    const className = node.name?.getText(sourceFile);

    if (classId && !hasDuplicate(graph.get(currentPath)?.exports ?? [], classId)) {
      graph.get(currentPath)?.exports.push({
        id: classId,
        name: className,
        apiPath: getControllerPath(node, sourceFile) ?? '',
        members: node.members
          .filter(({ kind }) => SyntaxKind.MethodDeclaration === kind)
          .map((member) => {
            const api = getControllerHandler(member, sourceFile);
            return {
              id: `${className}.${member.name?.getText(sourceFile)}`,
              name: member.name?.getText(sourceFile),
              method: api ? api[0].toUpperCase() : '',
              apiPath: api ? getControllerPath(node, sourceFile) as string + api[1] : getControllerPath(node, sourceFile) as string
            }
          })
      });
    }
  };

  while (paths.length) {
    const currentPath = paths.pop();
    if (currentPath === undefined) {
      continue;
    }
    // To avoid loops
    if (graph.has(currentPath)) {
      continue;
    }
    if (!graph.has(currentPath)) {
      graph.set(currentPath, buildEmptyRecord(currentPath));
    }

    try {
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
    } catch (error) {
      console.error(`Error in file: ${currentPath}`);
      console.log(`Current graph: `, graph);
      console.error(error);
      process.exit(1);
    }


  }
  return graph;
}