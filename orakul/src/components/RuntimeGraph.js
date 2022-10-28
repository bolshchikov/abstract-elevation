import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges, applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import raw from './runtime-deps.json';


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

const initNodes = raw.map((entry, idx) => ({
  id: entry.id,
  position: { x: idx * 100, y: idx * 100 },
  data: { label: entry.name },
  // style: {
  //   borderColor: colorBorders(entry)
  // }
}));


const initEdges = raw
  .filter(entry => entry.parentId)
  .map(entry => ({
    id: `${entry.parentId}-${entry.id}`,
    source: entry.parentId,
    target: entry.id
  }));

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