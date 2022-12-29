import { useCallback, useState } from 'react';
import './App.css';
import Editor, { defaultComment, plannedNodeCode } from './components/Editor';
import Scene from './components/Scene';
import Scenarios from './components/Scenarios';
import { getSourceCode } from './services/api';
import { SceneNodeType } from './components/Scene/Node';
import { Node } from 'reactflow';

function App() {
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
    <div className="App">
      <aside className="Menu">
        <Scenarios onChange={scenarioClickHandler} />
      </aside>
      <main className="Main">
        <Scene
          activeScenario={activeScenario}
          onNodeSelect={onNodeSelectHandler}
        />
      </main>
      <aside className="Code">
        <Editor sourceCode={sourceCode} />
      </aside>
    </div>
  );
}

export default App;
