"use client";
import { Workflow } from '@prisma/client';
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import React, { useCallback, useEffect } from 'react';

import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from '@/lib/helper/workflow/createFlowNode';
import { TaskType } from '@/types/task';
import NodeComponent from './nodes/nodeComponent';
import { AppNode } from '@/types/appNode';


const nodeTypes = {
    FlowScrapeNode: NodeComponent,
};
const snapGrid: [number, number] = [50, 50];

const fitViewOptions = { padding : 1 };



function FlowEditor({ workflow }: { workflow: Workflow}) {
    const [nodes, setNodes, onNodeChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgeChange ] = useEdgesState([]);
    const { setViewport, screenToFlowPosition } = useReactFlow();


    const onDragOver = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },[]);

    const onDrop = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      const taskType = event.dataTransfer.getData("application/reactflow");

      if(typeof taskType === undefined || !taskType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      const newNode = CreateFlowNode(taskType as TaskType, position);

      setNodes((nds) => nds.concat(newNode));

    },[setNodes, screenToFlowPosition]);


    useEffect(() => {

      try {
        const flow = JSON.parse(workflow.defination);
        if(!flow) return;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        if(!flow.viewport) return;
        const { x=0, y=0, zoom=1 } = flow.viewport;
        setViewport({ x ,y ,zoom });
      }
      catch(error) {
    
      }
    
    },[workflow.defination, setNodes, setEdges, setViewport ]);

    return (
    <main className="h-full w-full">
      <ReactFlow nodes={nodes} edges={edges} onEdgesChange={onEdgeChange} onNodesChange={onNodeChange} nodeTypes={nodeTypes} snapToGrid snapGrid={snapGrid} fitView fitViewOptions={fitViewOptions} onDragOver={onDragOver} onDrop={onDrop}>
        <Controls position="top-left" fitViewOptions={fitViewOptions}/>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor;
