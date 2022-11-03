import { Handle, Position } from 'reactflow';


const ClassNode = ({ data }) => {
  return (
    <>
      <Handle
        type="target"
        position="top"
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <div>
        {data.name}
        {data.members.length > 0 && <ul>
          {data.members.map(({ name, id }) => <li key={id}>{name}</li>)}
        </ul>}
      </div>
      <Handle
        type="source"
        position="bottom"
        onConnect={(params) => console.log('handle onConnect', params)}
      />

    </>
  );
}

export default ClassNode;