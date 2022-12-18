import staticRaw from './static-deps.json';

const isController = (file) => file.name.endsWith('.controller');

const Scenarios = ({ onChange }) => {
  const controllers = Object.values(staticRaw).filter(isController);
  return (
    <>
      <h4>Scenarios</h4>
      {controllers.map(({ name, exports }) => {
        const members = exports[0].members;
        return (
          <>
            <h6>{name}</h6>
            {members.map(member => {
              const scenario = `${member.method} ${member.apiPath}`;
              return (
                <div key={scenario} className="scenarioSelector">
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
          </>
        )
      })}
    </>
  );
};
export default Scenarios;