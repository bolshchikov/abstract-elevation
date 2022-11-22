import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  applyEdgeChanges, applyNodeChanges, Background, Controls
} from 'reactflow';
import 'reactflow/dist/style.css';
import ClassNode from './ClassNode/ClassNode';
import './ClassNode/ClassNode.css';
import runtimeRaw from './runtime-deps';
import staticRaw from './static-deps.json';

const EDGE_DEFAULT_STYLE = {
  animated: false,
  style: {
    stroke: '#b1b1b7'
  }
};
const EDGE_ANIMATED_STYLE = {
  animated: true,
  style: {
    stroke: 'red'
  }
};

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

const fileToModuleMap = Object.values(staticRaw)
  .filter(({ name }) => isModule(name))
  .reduce((acc, {imports, id}) => {
    imports.forEach(dep => acc[dep] = id);
    return acc;
  }, {});

console.log(fileToModuleMap);

const initNodes = Object.values(staticRaw)
  .filter(entry => entry.exports.length > 0)
  .map(({ exports, id, name }, idx) => {
    const node =  {
      id: id,
      position: { x: idx * 100, y: idx * 100 },
      type: 'class',
      data: exports[0],
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

initNodes.forEach(node => {
  if (fileToModuleMap[node.id]) {
    node.parentNode = fileToModuleMap[node.id];
    // node.extent = 'parent';
  }
});

const initEdges = Object.values(staticRaw)
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

const buildTrace = (scenarioName) => {
  const getRoot = (verb, path) => {
    const attrName1 = 'http.url';
    const attrName2 = 'http.method';
    return runtimeRaw.find(trace => trace.attributes[attrName1] === path && trace.attributes[attrName2] === verb);
  };
  const getNextChildren = (id) => {
    return runtimeRaw.filter(({ parentId }) => parentId === id);
  };
  const [verb, path] = scenarioName.split(' ');
  const root = getRoot(verb, path);
  if (!root) {
    return [];
  }
  const res = [root];
  const queue = [root];
  while (queue.length > 0) {
    const curr = queue.shift();
    const children = getNextChildren(curr.id);
    res.push(...children);
    queue.push(...children)
  }
  return res;
};

const mapTraceToNodes = (traces, nodes) => {
  const getNodeByName = (name) => {
    return nodes.find(node => node.data.name === name);
  };
  const res = [];
  for (let trace of traces) {
    const [serviceName, methodName] = trace.name.split('.');
    if (!methodName) {
      continue;
    }
    const maybeNode = getNodeByName(serviceName);
    if (maybeNode) {
      res.push(maybeNode);
    }
  }
  return res;
};
const generatePossibleEdges = (nodesInTraces) => {
  const res = {};
  for (let i = 0; i < nodesInTraces.length; i++) {
    for (let j = i; j < nodesInTraces.length; j++) {
      const nodeA = nodesInTraces[i];
      const nodeB = nodesInTraces[j];
      res[`${nodeA.id}-${nodeB.id}`] = true;
      res[`${nodeB.id}-${nodeA.id}`] = true;
    }
  }
  return res;
};

const nodeTypes = { class: ClassNode };

const Graph = ({ activeScenario }) => {
  const [nodes, setNodes] = useState(initNodes);
  const [edges, setEdges] = useState(initEdges);

  useEffect(() => {
    if (!activeScenario) {
      return
    }

    const traces = buildTrace(activeScenario);
    const nodesInTraces = mapTraceToNodes(traces, nodes);
    const relevantEdges = generatePossibleEdges(nodesInTraces, edges);
    const newEdges = edges.map(edge => {
      if (relevantEdges[edge.id]) {
        return { ...edge, ...EDGE_ANIMATED_STYLE };
      } else {
        return { ...edge, ...EDGE_DEFAULT_STYLE };
      }
    });
    setEdges(newEdges);

  }, [activeScenario]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      attributionPosition="top-right"
    >
      <Controls />
      <Background />
    </ReactFlow>
  )
};
export default Graph;