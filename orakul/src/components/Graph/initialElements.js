import staticRaw from '../static-deps.json';

const paintClass = (fileName) => {
  const parts = fileName.split(/(?=[A-Z])/);
  const type = parts.at(-1) ? parts.at(-1).toLowerCase() : void 0
  switch (type) {
    case 'controller':
      return '#db3b3bbf';
    case 'module':
      return 'transparent';
    case 'service':
      return '#0cff0cbd';
    default:
      return 'white';
  }
};

const isModule = (fileName) => fileName.endsWith('.module');

export const initNodes = Object.values(staticRaw)
  .filter(entry => entry.exports.length > 0)
  .filter(({ name }) => !isModule(name))
  .map(({ exports, id, name }, idx) => {
    const node = {
      id: id,
      position: { x: 0, y: 0 },
      type: 'class',
      data: exports[0],
      selectable: true,
      className: 'ClassNode',
      style: {
        background: paintClass(exports[0].name),
      }
    }
    if (isModule(name)) {
      node.type = 'group';
      node.className = 'ModuleNode';
    }
    return node;
  });

// initNodes.forEach(node => {
//   if (fileToModuleMap[node.id]) {
//     node.parentNode = fileToModuleMap[node.id];
//     // node.extent = 'parent';
//   }
// });

export const initEdges = Object.values(staticRaw)
  .filter(entry => entry.exports.length > 0)
  .filter(entry => !entry.name.includes('module'))
  .reduce((acc, { imports, id }) => {
    const edges = imports.map(dep => ({
      id: `${id}-${dep}`,
      source: id,
      target: dep,
    }));
    acc.push(...edges);
    return acc;
  }, []);