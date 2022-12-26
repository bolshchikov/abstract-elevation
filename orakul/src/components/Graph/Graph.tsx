import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';

import ClassNode from './ClassNode/ClassNode';
import './ClassNode/ClassNode.css';
import { initEdges, initNodes } from './initialElements';
import useAnimatedEdges from './useAnimatedEdges';
import useAutoLayout, { Direction } from './useAutoLayout';

const proOptions = {
  hideAttribution: true,
};

const nodeTypes = { class: ClassNode };

interface GraphProps {
  query?: string;
  activeScenario?: string;
  direction?: Direction;
  onNodeSelect: Function;
}

const Graph = ({ activeScenario, direction = 'TB', onNodeSelect }: GraphProps) => {

  useAutoLayout({ direction });

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  useAnimatedEdges(activeScenario);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      minZoom={0.2}
      maxZoom={1}
      proOptions={proOptions}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeDragStart={(_, node) => onNodeSelect(node)}
    >
      <MiniMap pannable />
      <Controls showZoom />
      <Background />
    </ReactFlow >
  )
};

const GraphWrapper = (props) => {
  return (
    <ReactFlowProvider>
      <Graph {...props} />
    </ReactFlowProvider>
  );
};

export default GraphWrapper;