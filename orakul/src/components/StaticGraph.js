import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges, applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import ClassNode from './ClassNode';
import raw from './static-deps.json';

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

const initNodes = Object.values(raw)
  .filter(entry => entry.exports.length > 0)
  .map(({ exports, id }, idx) => ({
    id: id,
    position: { x: idx * 100, y: idx * 100 },
    // type: 'class',
    data: {
      label: exports[0].name,
    },
    style: {
      background: paintClass(exports[0].name)
    }
  }));


const initEdges = Object.values(raw)
  .filter(entry => entry.exports.length > 0)
  .filter(entry => !entry.name.includes('module'))
  .reduce((acc, { imports, id }) => {
    const edges = imports.map(dep => ({
      id: `${id}-${dep}`,
      source: id,
      target: dep,
      type: 'step'
    }));
    acc.push(...edges);
    return acc;
  }, []);

const nodeTypes = { class: ClassNode };

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