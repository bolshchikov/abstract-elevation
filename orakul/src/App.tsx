import React, { useState } from 'react';
import Graph from './components/Graph/Graph';
import './App.css';

const scenarios = [
  'GET /invoices',
  'PUT /invoices',
  'GET /health-check'
];


function App() {
  const [activeScenario, setActiveScenario] = useState(undefined);
  const scenarioClickHandler = ({ target }) => {
    setActiveScenario(target.value);
  };
  return (
    <div className="App">
      <aside className="Menu">
        <h4>Scenarios</h4>
        {scenarios.map(scenario => (
          <div key={scenario} className="scenarioSelector">
            <input
              name="scenario-selector"
              id={scenario}
              type="radio"
              value={scenario}
              onClick={scenarioClickHandler}
            />
            <label htmlFor={scenario}>{scenario}</label>
          </div>
        ))}
      </aside>
      <main className="Main">
        <Graph activeScenario={activeScenario} />
      </main>
    </div>
  );
}

export default App;
