import { useState } from 'react';
import './App.css';
import Graph from './components/Graph/Graph';
import Scenarios from './components/Scenarios';

function App() {
  const [activeScenario, setActiveScenario] = useState(undefined);
  const scenarioClickHandler = ({ target }) => {
    setActiveScenario(target.value);
  };
  return (
    <div className="App">
      <aside className="Menu">
        <Scenarios onChange={scenarioClickHandler} />
      </aside>
      <main className="Main">
        <Graph activeScenario={activeScenario} />
      </main>
    </div>
  );
}

export default App;
