import './Views.css';

export enum Levels {
  CODE = 'Code',
  COMPONENTS = 'Components',
  CONTAINERS = 'Containers',
  SYSTEMS = 'Systems'
};

const Views = ({ current, onChange }) => {
  const onCLickHandler = (ev) => {
    onChange(ev.target.value);
  };
  return (
    <div className="react-flow__panel bottom views">
      {Object.entries(Levels).map(([key, val]) => {
        const classNames = ['react-flow__controls-button'];
        if (current === val) {
          classNames.push('selected');
        }
        return (
          <button key={key} value={val} onClick={onCLickHandler} type="button" className={classNames.join(' ')}>{val}</button>
        );
      })}
    </div>
  );
};

export default Views;