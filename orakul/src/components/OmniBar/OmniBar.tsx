import './OmniBar.css';
import { PlusCircleDotted } from 'react-bootstrap-icons';


const OmniBar = ({ onSearch }) => {
  const inputHandler = (ev) => onSearch(ev.target.value);

  return (
    <div className="OmniBarContainer">
      <input className="OmniBarSearch" placeholder="Search" onChange={inputHandler} />
      <div className="OmniBarControls">
        <button className="OmniBarControl" title="Add New Node">
          <PlusCircleDotted color="white" size={20} />
        </button>
      </div>
    </div>
  );
};

export default OmniBar;