import React, { useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const AgentNode = ({ id, data }) => {
  const { getEdges, getNodes } = useReactFlow();
  const [inputs, setInputs] = useState(
    data.inputs.reduce((acc, input) => {
      acc[input] = '';
      return acc;
    }, {})
  );



  useEffect(() => {
    
    const edges = getEdges();
    const newActions = edges
      .filter(edge => edge.source === id && edge.targetHandle === 'Tools')
      .map(edge => {
        const targetNode = getNodes().find(node => node.id === edge.target);
        return targetNode ? targetNode.data.label : edge.target;
      });


  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
    data.onChange({ id, name, value });
  };

  return (
    <div className='flex flex-col items-center w-80 bg-slate-100' style={{ padding: 10, border: '1px solid #777', borderRadius: 5 }}>
      <div className='mb-2 font-medium '>{data.label}</div>
      <form className='flex flex-col w-[100%]'>
        {data.inputs && data.inputs.map((input, index) => (
          <div className=' border-x-0 border w-[100%] border-slate-300 h-24 p-3 flex gap-3 flex-col'>
          <label className='  ' key={index}>
          <h5 className='mb-4'> {input} </h5> 
            <input
              type="text"
              name={input}
              value={inputs[input]}
              onChange={handleChange}
              placeholder='Enter the value'
              className='ml-2 h-8 w-[80%] rounded'
            />
          </label>
          </div>
        ))}
      </form>
      {/* <button onClick={() => data.onRemove(id)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">Remove</button> */}
      <Handle type="source" position={Position.Left} id="Agent" style={{ background: '#555' }} />
      <Handle type="target" position={Position.Right} id="Agent" style={{ background: '#555' }} />
    </div>
  );
};

export default AgentNode;
