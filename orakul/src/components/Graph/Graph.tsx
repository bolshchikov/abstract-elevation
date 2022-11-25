import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  applyEdgeChanges, applyNodeChanges, Background, Controls, Node
} from 'reactflow';
import 'reactflow/dist/style.css';
import runtimeRaw from '../runtime-deps';
import ClassNode from './ClassNode/ClassNode';
import './ClassNode/ClassNode.css';
import { initEdges, initNodes } from './initialElements';

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
    if (curr) {
      const children = getNextChildren(curr.id);
      res.push(...children);
      queue.push(...children)
    }
  }
  return res;
};

const mapTraceToNodes = (traces, nodes): Node[] => {
  const getNodeByName = (name) => {
    return nodes.find(node => node.data.name === name);
  };
  const res: Node[] = [];
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
    const relevantEdges = generatePossibleEdges(nodesInTraces);
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