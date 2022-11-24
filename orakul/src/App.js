import React, { useState } from 'react';
import StaticGraph from './components/Graph/Graph';
import RuntimeGraph from './components/RuntimeGraph';
import './App.css';

const scenarios = [
  'GET /invoices',
  'PUT /invoices',
  'GET /health-check'
]

const App = () => {
  const [activeScenario, setActiveScenario] = useState(null);
  const scenarioClickHandler = ({target}) => {
    setActiveScenario(target.value);
  }
  return (
    <div className="App">
      <aside className="Menu">
        <h4>Scenarios</h4>
        {scenarios.map(scenario => (
          <div key={scenario} className="scenarioSelector">
            <input name="scenario-selector" id={scenario} type="radio" value={scenario} onClick={scenarioClickHandler}/>
            <label htmlFor={scenario}>{scenario}</label>
          </div>
        ))}
      </aside>
      <main className="Main">
        <StaticGraph activeScenario={activeScenario} />
      </main>
    </div>
  );
}

export default App;
