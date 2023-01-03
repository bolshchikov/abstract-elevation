import { useCallback, useRef, useState } from 'react';
import { Node } from 'reactflow';
import './App.css';
import Editor from '../Editor/Editor';
import Scenarios from '../Scenarios/Scenarios';
import { SceneNodeType } from '../Scene/Node/Node';
import Scene from '../Scene/Scene';
import useSplitPanel from './useSplitPanel';
import { getSourceCode } from '../../services/api';
import { defaultComment, plannedNodeCode } from '../Editor/comments';

function App() {
  const paneContainer = useRef(null);
  const paneLeft = useRef(null);
  const paneRight = useRef(null);

  const {
    onResizeEnd,
    onResizeStart,
    onResizing
  } = useSplitPanel(paneContainer, paneLeft, paneRight);

  const [activeScenario, setActiveScenario] = useState(undefined);
  const [sourceCode, setSourceCode] = useState('');
  const scenarioClickHandler = ({ target }) => setActiveScenario(target.value);

  const fetchSourceCodeForNode = async (node) => {
    try {
      const res = await getSourceCode(node.id);
      if (res) {
        setSourceCode(res);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onNodeSelect = useCallback((node: Node) => {
    switch (node.type) {
      case SceneNodeType.ACTUAL:
        return fetchSourceCodeForNode(node);
      case SceneNodeType.PLANNED:
        return setSourceCode(plannedNodeCode);
    }
  }, []);

  const onNodeDeselect = () => {
    return setSourceCode(defaultComment);
  };

  const onNodeSelectHandler = useCallback((node: Node | undefined) => {
    if (node) {
      onNodeSelect(node);
    } else {
      onNodeDeselect();
    }
  }, [onNodeSelect]);

  return (
    <div className="App" ref={paneContainer} onMouseMove={onResizing} onMouseUp={onResizeEnd}>
      <aside className="Menu" ref={paneLeft}>
        <Scenarios onChange={scenarioClickHandler} />
      </aside>
      <div className="Splitter" data-index={0} onMouseDown={onResizeStart}></div>
      <main className="Main">
        <Scene
          activeScenario={activeScenario}
          onNodeSelect={onNodeSelectHandler}
        />
      </main>
      <div className="Splitter" data-index={1} onMouseDown={onResizeStart}></div>
      <aside className="Code" ref={paneRight}>
        <Editor sourceCode={sourceCode} />
      </aside>
    </div>
  );
}

export default App;
