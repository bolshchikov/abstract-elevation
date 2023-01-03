import { Edge, Node } from 'reactflow';
import staticRaw from '../../fixtures/static-deps.json';
import { buildEdge } from './Edge/Edge';
import { buildActualNode } from './Node/Node';

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
    const edges = imports.map(dep => buildEdge(id, dep));
    acc.push(...edges);
    return acc;
  }, [] as Edge[]);