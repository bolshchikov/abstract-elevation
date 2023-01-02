import { useCallback, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, ReactFlowProvider, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import ActualNode from './ActualNode/ActualNode';
import { initEdges, initNodes } from './initialElements';
import { buildPlannedNode } from './Node';
import OmniBar from './OmniBar/OmniBar';
import PlannedNode from './PlannedNode/PlannedNode';
import './Scene.css';
import useAnimatedEdges from './useAnimatedEdges';
import useAutoLayout, { Direction } from './useAutoLayout';

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
  onNodeSelect: (node: Node | undefined) => void;
}

const Scene = ({ activeScenario, direction = 'TB', onNodeSelect }: SceneProps) => {

  useAutoLayout({ direction });

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);

  useAnimatedEdges(activeScenario);

  const onNodeAddHandler = useCallback(() => {
    const name = window.prompt('Enter name');
    if (!name) {
      return;
    }
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

  const onSelectionChangeHandler = useCallback(({ nodes }) => {
    if (nodes.length === 0) {
      setSelectedNode(undefined);
      onNodeSelect(undefined);
      return;
    }
    const node = nodes[0]; // we support only 1 node selection;
    if (node.id !== selectedNode?.id) {
      setSelectedNode(node);
      onNodeSelect(node);
    }
  }, [onNodeSelect, selectedNode]);

  return (
    <>
      <OmniBar onAdd={onNodeAddHandler} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        minZoom={0.2}
        maxZoom={1.5}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        onConnect={onEdgeAddHandler}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChangeHandler}
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