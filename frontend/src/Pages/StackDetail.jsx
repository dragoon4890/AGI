import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import AgentNode from '../assets/helpers/CustomNodes/AgentNode';  // Import your AgentNode component
import LLMNode from '../assets/helpers/CustomNodes/LLMNode';      // Import your LLMNode component
import ToolsNode from '../assets/helpers/CustomNodes/ToolsNode';  // Import your ToolsNode component
import NewStack from '@/assets/helpers/NewStack/NewStack';
import ChatBoi from '@/assets/helpers/CustomNodes/ChatDialog';

const nodeTypes = {
  agent: AgentNode,
  llm: LLMNode,
  tools: ToolsNode,
};

const StackDetail = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(0);

  let { id } = useParams();

  const Tools = [
    ["DuckDuckGoNewsSearch", []],
    ["WebBaseContextTool", []],
    ["WriteFileAction", []],
  ];
  
  const LLMs = [
    ['OpenAI 3.5', ['api_key', 'model', 'base_url']],
    ['Azure OpenAI', ['api_key', 'model', 'base_url']],
  ];
  const removeNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, [setNodes, setEdges]);

  const addAgent = useCallback(() => {
    const newNode = {
      id: `${nodeId}`,
      type: 'agent',
      position: { x: 250, y: 5 },
      data: { label: `Agent` ,action:[],inputs: ['Role', 'Instruction'], onChange: handleNodeChange , onRemove: removeNode },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeId((id) => id + 1);
  }, [nodeId, setNodes]);

  const addTools = useCallback((name, inputs) => () => {
    const newNode = {
      id: `${nodeId}`,
      type: 'tools',
      position: { x: 250, y: 5 },
      data: { label: name, inputs, onChange: handleNodeChange ,  onRemove: removeNode },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeId((id) => id + 1);
  }, [nodeId, setNodes]);

  const addLLM = useCallback((name, inputs) => () => {
    const newNode = {
      id: `${nodeId}`,
      type: 'llm',
      position: { x: 250, y: 5 },
      data: { label: name, inputs, onChange: handleNodeChange ,  onRemove: removeNode },
    };
    setNodes((nds) => nds.concat(newNode));0
    setNodeId((id) => id + 1);
  }, [nodeId, setNodes]);

  const handleNodeChange = useCallback((change) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === change.id ? { ...node, data: { ...node.data, [change.name]: change.value } } : node))
    );
  }, [setNodes]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  function updateActions() {
    edges.forEach(edge => {
      // Check if edge has 'Tools' as targetHandle
      if (edge.targetHandle === 'Tools') {
        const sourceNode = nodes.find((node) => node.id === edge.source);
        const targetNode = nodes.find((node) => node.id === edge.target);
        
        if (sourceNode && targetNode) {
          const actionLabel = targetNode.data.label;
          
          // Check if actionLabel is already in sourceNode.data.action
          if (!sourceNode.data.action.includes(actionLabel)) {
            sourceNode.data.action.push(actionLabel);
          }
        }
      }
    });
  }
  
  const handleConfig = () => {
    
    const payload = nodes.reduce((acc, node) => {
      if (node.type === 'llm') {
        console.log(node)
        const llmName = node.data.api_key;
        const llmInputs = node.data.model;
        const llmUrl = node.data.base_url;
        
        // Construct an object with necessary details
        acc = {
          api_key: llmName,
          model: llmInputs,
          base_url: llmUrl
        };
      }
      return acc;
    }, null);
  
    // If no LLM node is found, payload will be null
    if (!payload) {
      console.error('No LLM node found');
      return;
    }
  
  
    console.log(payload)
    // Define your API endpoint
    const endpoint = 'http://localhost:8000/config'; // Replace with your actual endpoint
  
    // Send POST request to API endpoint
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('LLM Details sent successfully:', data);
        // Handle any success logic here if needed
      })
      .catch(error => {
        console.error('Error sending LLM Details:', error);
        // Handle error scenario
      });
  };

  const handleBuild = async () => {
     handleConfig()
    updateActions()
//     const AgentNodes=[]
//     nodes.forEach(node => {
//       // Check if the node type is 'Agent'
//       if (node.type === 'agent') {
//         // Append the node to AgentNodes array
//         AgentNodes.push(node);
//       }
//     });
//     const lastagent = [];

// AgentNodes.forEach(node => {
//   // Assume we're checking for edges where edge.target is node.id
//   const hasMatchingEdge = edges.some(edge => edge.source === node.id && edge.sourceHandle==='Agent');

//   if (!hasMatchingEdge) {
//     lastagent.push(node);
//   }
// });

// console.log(lastagent);


    const l=[]
    nodes.map((node,key) => {
      
      const role = node.data.Role 
      const instruction = node.data.Instruction 
      const actions = node.data.action
      
      if (role && instruction && actions){
      l.push({
        role: role,
        instructions: instruction,
        actions: actions})
      }
      
    }
      );
  
    const payload = {
      workers: l,
    };
  

    console.log(payload);
    const endpoint = 'http://localhost:8000/team'; // Replace with your actual endpoint
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      
    },
    body: JSON.stringify(payload),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Data sent successfully:', data);
  })
  .catch(error => {
    console.error('Error sending data:', error);
  });
  };

  return (
    <div style={{ height: 'calc(100vh - 3.5rem)' }} className='w-screen flex flex-row'>
      <div className='w-[15%] bg-white flex flex-col h-[100%] items-center gap-8'>
        <Accordion type="multiple" collapsible className="w-[95%]">
          <AccordionItem value="item-1">
            <AccordionTrigger> <h1 className='ml-12'>Agents</h1></AccordionTrigger>
            <AccordionContent className='flex justify-center items-center'>
              <button onClick={addAgent}  className='w-44 border border-2 rounded-lg p-3 flex flex-start '>
              <h5 >  Agents </h5>
              </button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger><h1 className='ml-12' >Tools</h1></AccordionTrigger>
            <AccordionContent className='flex justify-center items-center h-fit flex-col gap-4'>
              {Tools.map((tool) => (
                <button key={tool[0]} onClick={addTools(tool[0], tool[1])} className='bg-white border border-2 rounded-lg py-5 px-1 flex flex-start text-slate-950 w-44'>
            <p className='ml-1'>      {tool[0]} </p>
                </button>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger><h1 className='ml-12'  >LLMs</h1></AccordionTrigger>
            <AccordionContent className='flex flex-col gap-3 justify-center items-center'>
              {LLMs.map((llm) => (
                <button key={llm[0]} onClick={addLLM(llm[0], llm[1])} className='w-44 border border-2 rounded-lg p-3 flex flex-start '>
                  {llm[0]}
                </button>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
        <ChatBoi className='absolute right-3 bottom-24' />
      </div>
    </div>
  );
};

export default StackDetail;
