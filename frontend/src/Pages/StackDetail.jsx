import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '../assets/helpers/CustomNodes/CustomNode';
import { useParams } from "react-router-dom";
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
    [setEdges],
  );

  const addAgent = () => {
    const newNode = {
      id: `${nodeId}`,
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: { label: `AGENT`, onChange: (event) => console.log(event.target.value) },
      type: 'custom',
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId(nodeId + 1);
  };

  const addTools = (someValue) => () => {
    const newNode = {
      id: `${nodeId}`,
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: { label: `${someValue}`, onChange: (event) => console.log(event.target.value) },
      type: 'custom',
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId(nodeId + 1);
  };

  const addLLM = (someValue) => () => {
    const newNode = {
      id: `${nodeId}`,
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: { label: `${someValue}`, onChange: (event) => console.log(event.target.value) },
      type: 'custom',
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId(nodeId + 1);
  };

  let { id } = useParams();

  const Tools = ["Github", "DuckDuckGo", "Gmail"];
  const LLMs = ["OpenAI 3.5", "OpenAi 4", "Azure OpenAi"];

  return (
    <div style={{ height: 'calc(100vh - 3.5rem)' }} className='w-screen flex flex-row'>
      <div className='w-[20%] bg-slate-700 flex flex-col h-[100%] items-center gap-8'>
        <h1>Agents</h1>
        <Button onClick={addAgent} variant='default' size='sm'>
          Add Agent
        </Button>
        <h1>Tools</h1> 
        {Tools.map(tool => (
          <Button key={tool} onClick={addTools(tool)} className="w-20">
            {tool}
          </Button>
        ))}
        <h1>LLMs</h1>
        {LLMs.map(llm => (
          <Button key={llm} onClick={addLLM(llm)} className="w-20">
            {llm}
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
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
        <Button className="absolute right-3 bottom-8">
          Build
        </Button>
        <Button className="absolute right-3 bottom-24">
          Run
        </Button>
      </div>
    </div>
  );
};

export default StackDetail;
