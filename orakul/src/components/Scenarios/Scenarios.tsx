import staticRaw from '../../fixtures/static-deps.json';

const isController = (file) => file.name.endsWith('.controller');
const isResolver = (file) => file.name.endsWith('.resolver');

const Scenarios = ({ onChange }) => {
  const controllers = [...Object.values(staticRaw).filter(isController), ...Object.values(staticRaw).filter(isResolver)];
  return (
    <>
      <h4>APIs</h4>
      {controllers.map(({ name, exports }, idx) => {
        const members = exports[0].members;
        return (
          <div key={idx}>
            <h5>{name}</h5>
            {members.map(member => {
              const scenario = `${member.method} ${isResolver({ name }) ? member.name : member.apiPath}`;
              return (
                <div key={scenario} className="ScenarioSelector">
                  <input
                    name="scenario-selector"
                    id={scenario}
                    type="radio"
                    value={scenario}
                    onClick={onChange}
                  />
                  <label htmlFor={scenario}>{scenario}</label>
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  );
};
export default Scenarios;