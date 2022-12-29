import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import OmniBar from './OmniBar/OmniBar';
import ActualNode from './ActualNode/ActualNode';
import { initEdges, initNodes } from './initialElements';
import PlannedNode from './PlannedNode/PlannedNode';
import useAnimatedEdges from './useAnimatedEdges';
import useAutoLayout, { Direction } from './useAutoLayout';
import { useCallback } from 'react';
import { buildPlannedNode } from './Node';

const proOptions = {
  hideAttribution: true,
};

const nodeTypes = {
  actual: ActualNode,
  planned: PlannedNode,
};

interface SceneProps {
  activeScenario?: string;
  direction?: Direction;
  onNodeSelect: Function;
}

const Scene = ({ activeScenario, direction = 'TB', onNodeSelect }: SceneProps) => {

  useAutoLayout({ direction });

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  useAnimatedEdges(activeScenario);

  const onNodeAddHandler = useCallback(() => {
    const name = window.prompt('Enter name');
    const data = { name };
    const newPlannedNode = buildPlannedNode({ data });
    setNodes([...nodes, newPlannedNode]);
  }, [nodes, setNodes]);

  const onEdgeAddHandler = useCallback(({ source, target }) => {
    setEdges([...edges, {
      id: `${source}-${target}`,
      source,
      target
    }]);
  }, [edges, setEdges]);

  return (
    <>
      <OmniBar onAdd={onNodeAddHandler} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={proOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onEdgeAddHandler}
        nodeTypes={nodeTypes}
        onNodeDragStart={(_, node) => onNodeSelect(node)}
      >
        <MiniMap pannable />
        <Controls showZoom />
        <Background />
      </ReactFlow >
    </>
  )
};

const SceneWrapper = (props) => {
  return (
    <ReactFlowProvider>
      <Scene {...props} />
    </ReactFlowProvider>
  );
};

export default SceneWrapper;