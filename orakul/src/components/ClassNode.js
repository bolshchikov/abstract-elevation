import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';


function ClassNode({ data }) {
  console.log(data);

  return (
    <div className="class-node">
      hello world
    </div>
  );
}

export default ClassNode;