import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges, applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import ClassNode from './ClassNode';
import staticRaw from './static-deps.json';
import runtimeRaw from './runtime-deps.json';

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
      return '#7676df';
    case 'service':
      return '#0cff0cbd';
    default:
      return 'white';
  }
}

const initNodes = Object.values(staticRaw)
  .filter(entry => entry.exports.length > 0)
  .map(({ exports, id }, idx) => ({
    id: id,
    position: { x: idx * 100, y: idx * 100 },
    type: 'class',
    data: exports[0],
    style: {
      background: paintClass(exports[0].name),
      border: '1px solid black',
      borderRadius: '3px',
      padding: '10px 15px',
    }
  }));


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
  const getNextChild = (id) => {
    return runtimeRaw.find(({ parentId }) => parentId === id);
  };
  const [verb, path] = scenarioName.split(' ');
  const root = getRoot(verb, path);
  if (!root) {
    return null;
  }
  const res = [root];
  let curr = root;
  while (curr) {
    const child = getNextChild(curr.id);
    if (child) {
      res.push(child);
    }
    curr = child;
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
const findEdgesByNodes = (nodesInTraces, edges) => {
  const res = {};
  for (let i = 0; i < nodesInTraces.length - 1; i++) {
    const nodeA = nodesInTraces[i];
    const nodeB = nodesInTraces[i + 1];
    const edgeId = `${nodeA.id}-${nodeB.id}`;
    res[edgeId] = true;
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
    const relevantEdges = findEdgesByNodes(nodesInTraces, edges);
    console.log(relevantEdges);
    console.log(edges);
    const newEdges = edges.map(edge => {
      if (relevantEdges[edge.id]) {
        return { ...edge, ...EDGE_ANIMATED_STYLE };
      } else {
        return { ...edge, ...EDGE_DEFAULT_STYLE };
      }
    });
    console.log(newEdges);
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