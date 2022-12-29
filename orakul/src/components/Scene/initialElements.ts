import { Edge, Node } from 'reactflow';
import staticRaw from '../static-deps.json';
import { buildActualNode } from './Node';

const isModule = (fileName) => fileName.endsWith('.module');
const hasPublicMethods = (exports) => exports.length > 0;

const sanitizedRawData = () =>
  Object.values(staticRaw)
    .filter(({ exports }) => hasPublicMethods(exports))
    .filter(({ name }) => !isModule(name));

export const initNodes: Node[] = sanitizedRawData()
  .map(({ exports, id }) => buildActualNode({ id, data: exports[0] }));

export const initEdges: Edge[] = sanitizedRawData()
  .reduce((acc, { imports, id }) => {
    const edges = imports.map(dep => ({
      id: `${id}-${dep}`,
      source: id,
      target: dep,
    }));
    acc.push(...edges);
    return acc;
  }, [] as Edge[]);