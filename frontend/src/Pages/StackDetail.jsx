import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '../assets/helpers/CustomNodes/CustomNode';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const nodeTypes = {
  custom: CustomNode,
};

const StackDetail = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(0);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleInputChange = ({ id, name, value }) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, [name]: value } } : node
      )
    );
  };

  const hasSearchExecutorCapability = () => {
    return nodes.some((node) => 
      node.data.label === 'AGENT' && node.data.capability === 'search_executor'
    );
  };

  const addAgent = () => {
    const newNode = {
      id: `${nodeId}`,
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        id: `${nodeId}`,
        label: 'AGENT',
        inputs: ['task', 'role', 'backstory', 'capability'],
        onChange: handleInputChange,
      },
      type: 'custom',
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId(nodeId + 1);
  };

  const addTools = (someValue, inputvalue) => () => {
    if (!hasSearchExecutorCapability()) {
      alert('At least one agent must have the capability of search_executor to add tools.');
      return;
    }

    const newNode = {
      id: `${nodeId}`,
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        id: `${nodeId}`,
        label: `${someValue}`,
        inputs: inputvalue,
        onChange: handleInputChange,
      },
      type: 'custom',
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId(nodeId + 1);
  };

  const addLLM = (someValue, opvalue) => () => {
    const newNode = {
      id: `${nodeId}`,
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        id: `${nodeId}`,
        label: `${someValue}`,
        inputs: opvalue,
        onChange: handleInputChange,
      },
      type: 'custom',
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId(nodeId + 1);
  };

  let { id } = useParams();

  const Tools = [
    ['Github', ['GITHUB_APP_ID', 'GITHUB_APP_PRIVATE_KEY', 'GITHUB_REPOSITORY']],
    ['DuckDuckGo', []],
    ['Gmail', ['GMAIL_CREDS']],
  ];
  const LLMs = [
    ['OpenAI 3.5', ['Open Api Key']],
    ['OpenAI 4', ['Open Api Key']],
    ['Azure OpenAI', ['base url', 'deployment name', 'model name', 'openAI Api Version', 'Api key']],
  ];

  const handleBuild = async () => {
    const formattedData = nodes.map((node) => ({
      id: node.id,
      label: node.data.label,
      inputs: node.data.inputs.reduce((acc, input) => {
        acc[input] = node.data[input] || '';
        return acc;
      }, {}),
    }));

    try {
      console.log(formattedData);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 3.5rem)' }} className='w-screen flex flex-row'>
      <div className='w-[20%] bg-slate-700 flex flex-col h-[100%] items-center gap-8'>
        <h1>Agents</h1>
        <Button onClick={addAgent} variant='default' size='sm'>
          Add Agent
        </Button>
        <h1>Tools</h1>
        {Tools.map((tool) => (
          <Button key={tool[0]} onClick={addTools(tool[0], tool[1])} className='w-20'>
            {tool[0]}
          </Button>
        ))}
        <h1>LLMs</h1>
        {LLMs.map((llm) => (
          <Button key={llm[0]} onClick={addLLM(llm[0], llm[1])} className='w-20'>
            {llm[0]}
          </Button>
        ))}
      </div>
      <div className='w-[80%] h-[100%]'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <Background variant='dots' gap={12} size={1} />
        </ReactFlow>
        <Button onClick={handleBuild} className='absolute right-3 bottom-8'>
          Build
        </Button>
        <Button className='absolute right-3 bottom-24'>Run</Button>
      </div>
    </div>
  );
};

export default StackDetail;
