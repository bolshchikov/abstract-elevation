import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges, applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import raw from './graph.json';

// remove root
for (let key of Object.keys(raw)) {
  if (key.endsWith('main.ts') || key.endsWith('module.ts')) {
    delete raw[key];
  }
}

const colorBorders = (fileName) => {
  const parts = fileName.split('.');
  switch (parts.at(-2)) {
    case 'controller':
      return 'red';
    case 'service':
      return 'green';
    default:
      return 'black';
  }
}

const initNodes = Object.keys(raw).map((entry, idx) => ({
  id: String(idx),
  position: { x: idx * 100, y: idx * 100 },
  data: { label: entry },
  style: {
    borderColor: colorBorders(entry)
  }
}));

const ids = initNodes.reduce((acc, curr) => {
  acc[curr.data.label] = curr.id;
  return acc;
}, {});

const initEdges = Object.keys(raw).reduce((acc, entry) => {
  const _edges = raw[entry].map(target => ({
    id: `${ids[entry]}-${ids[target]}`,
    source: ids[entry],
    target: ids[target]
  }));
  acc.push(..._edges);
  return acc;
}, []);

const Graph = () => {
  const [nodes, setNodes] = useState(initNodes);
  const [edges, setEdges] = useState(initEdges);

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
      fitView
      attributionPosition="top-right"
    >
      <Controls />
      <Background />
    </ReactFlow>
  )
};
export default Graph;