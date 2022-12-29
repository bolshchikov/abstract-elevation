import { useState } from 'react';
import './App.css';
import Editor from './components/Editor';
import Scene from './components/Scene';
import Scenarios from './components/Scenarios';
import { getSourceCode } from './services/api';
import { SceneNodeType } from './components/Scene/Node';

function App() {
  const [activeScenario, setActiveScenario] = useState(undefined);
  const [sourceCode, setSourceCode] = useState('');
  const scenarioClickHandler = ({ target }) => setActiveScenario(target.value);

  const onNodeSelectHandler = async node => {
    if (node.type === SceneNodeType.ACTUAL) {
      const res = await getSourceCode(node.id);
      if (res) {
        setSourceCode(res);
      }
    } else {
      setSourceCode('');
    }
  };

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
