import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }) => {
  const [inputs, setInputs] = useState(
    data.inputs.reduce((acc, input) => {
      acc[input] = '';
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
    data.onChange({ id: data.id, name, value });
  };

  return (
    <div className='flex flex-col items-center bg-slate-200' style={{ padding: 10, border: '1px solid #777', borderRadius: 5 }}>
      <div className='mb-2'>{data.label}</div>
      <form className='flex flex-col'>
        {data.inputs && data.inputs.map((input, index) => (
          <label className='mb-2' key={index}>
            {input}
            <input
              type="text"
              name={input}
              value={inputs[input]}
              onChange={handleChange}
              className='ml-2'
            />
          </label>
        ))}
      </form>
      <Handle type="source" position={Position.Left} id="a" style={{ background: '#555' }} />
      <Handle type="target" position={Position.Right} id="b" style={{ background: '#555' }} />
    </div>
  );
};

export default CustomNode;

