import { useState } from 'react';
import './App.css';
import Editor from './components/Editor';
import Graph from './components/Graph/Graph';
import Scenarios from './components/Scenarios';
import { getSourceCode } from './services/api';

function App() {
  const [activeScenario, setActiveScenario] = useState(undefined);
  const [sourceCode, setSourceCode] = useState('');
  const scenarioClickHandler = ({ target }) => setActiveScenario(target.value);

  const onNodeSelectHandler = async node => {
    const res = await getSourceCode(node.id);
    if (res) {
      setSourceCode(res);
    }
  };

  return (
    <div className="App">
      <aside className="Menu">
        <Scenarios onChange={scenarioClickHandler} />
      </aside>
      <main className="Main">
        <Graph activeScenario={activeScenario} onNodeSelect={onNodeSelectHandler} />
      </main>
      <aside className="Code">
        <Editor sourceCode={sourceCode} />
      </aside>
    </div>
  );
}

export default App;
